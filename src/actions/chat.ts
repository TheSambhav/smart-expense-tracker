"use server";

import { db } from "@/db";
import { transactions, categories, merchants } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq, and, sql, desc, sum, count, avg, gte, lte, ilike } from "drizzle-orm";

interface ParsedQuery {
  intent: "sum" | "count" | "max" | "min" | "avg" | "breakdown" | "list" | "info" | "greeting";
  type?: "INCOME" | "EXPENSE";
  month?: number;
  year?: number;
  category?: string;
  merchant?: string;
  paymentMethod?: string;
  timeframe?: "last_month" | "this_month" | "this_year" | "last_30_days";
}

function parseQuery(query: string): ParsedQuery {
  const lower = query.toLowerCase();
  const parsed: ParsedQuery = { intent: "list" };

  // 1. Social/Info Intents
  if (lower.match(/^(hi|hello|hey|greetings)/)) return { intent: "greeting" };
  if (lower.includes("what can you do") || lower.includes("help") || lower.includes("commands")) return { intent: "info" };
  if (lower.includes("thank")) return { intent: "greeting" };

  // 2. Main Intent detection
  if (lower.includes("how much") || lower.includes("total") || lower.includes("sum") || lower.includes("spend")) {
    parsed.intent = "sum";
  }
  if (lower.includes("how many") || lower.includes("count") || lower.includes("number of")) {
    parsed.intent = "count";
  }
  if (lower.includes("highest") || lower.includes("max") || lower.includes("most expensive") || lower.includes("biggest") || lower.includes("top")) {
    parsed.intent = "max";
  }
  if (lower.includes("lowest") || lower.includes("min") || lower.includes("cheapest") || lower.includes("smallest")) {
    parsed.intent = "min";
  }
  if (lower.includes("average") || lower.includes("avg") || lower.includes("mean")) {
    parsed.intent = "avg";
  }
  if (lower.includes("breakdown") || lower.includes("distribution") || lower.includes("stats") || lower.includes("summary")) {
    parsed.intent = "breakdown";
  }

  // 3. Type detection (Income vs Expense)
  if (lower.includes("income") || lower.includes("earn") || lower.includes("salary") || lower.includes("received")) {
    parsed.type = "INCOME";
    parsed.intent = parsed.intent === "list" ? "sum" : parsed.intent; // Default to sum for income queries
  } else if (lower.includes("expense") || lower.includes("spent") || lower.includes("paid")) {
    parsed.type = "EXPENSE";
  }

  // 4. Timeframe detection
  if (lower.includes("last month")) parsed.timeframe = "last_month";
  else if (lower.includes("this month")) parsed.timeframe = "this_month";
  else if (lower.includes("this year")) parsed.timeframe = "this_year";
  else if (lower.includes("last 30 days")) parsed.timeframe = "last_30_days";

  // 5. Month detection
  const months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
  months.forEach((m, idx) => {
    if (lower.includes(m) || lower.includes(m.substring(0, 3))) parsed.month = idx + 1;
  });

  // 6. Year detection
  const yearMatch = query.match(/\b(20\d{2})\b/);
  if (yearMatch) parsed.year = parseInt(yearMatch[1], 10);

  // 7. Payment Method
  if (lower.includes("card")) parsed.paymentMethod = "card";
  if (lower.includes("upi") || lower.includes("gpay") || lower.includes("phonepe")) parsed.paymentMethod = "upi";
  if (lower.includes("cash")) parsed.paymentMethod = "cash";

  // 8. Extract potential Category/Merchant name (words of 3+ letters)
  const words = lower.split(/\s+/).filter(w => w.length > 3 && !["total", "spend", "much", "show", "this", "last"].includes(w));
  if (words.length > 0) parsed.category = words[words.length - 1]; // Take the last relevant word as a hint

  return parsed;
}

export async function processChatQuery(query: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");
  
  const userId = session.user.id;
  const parsed = parseQuery(query);

  // Handle Social/Info Responses immediately
  if (parsed.intent === "greeting") {
    return { answer: "Hello! I'm here to help you track your finances. Ask me about your spending, income, or a breakdown of your categories!" };
  }
  if (parsed.intent === "info") {
    return { answer: "I can help with:\n• 'Total spend this month'\n• 'How much did I earn in March?'\n• 'Highest spend on Food'\n• 'Breakdown by category'\n• 'Recent transactions'" };
  }

  let condition = eq(transactions.userId, userId);

  // Apply Filters
  if (parsed.type) condition = and(condition, eq(transactions.type, parsed.type)) as any;
  if (parsed.paymentMethod) condition = and(condition, ilike(transactions.paymentMethod, `%${parsed.paymentMethod}%`)) as any;

  // Timeframes
  const now = new Date();
  if (parsed.timeframe === "last_month") {
    const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const end = new Date(now.getFullYear(), now.getMonth(), 0);
    condition = and(condition, gte(transactions.date, start), lte(transactions.date, end)) as any;
  } else if (parsed.timeframe === "this_month") {
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    condition = and(condition, gte(transactions.date, start)) as any;
  } else if (parsed.timeframe === "this_year") {
    const start = new Date(now.getFullYear(), 0, 1);
    condition = and(condition, gte(transactions.date, start)) as any;
  }

  if (parsed.month && !parsed.timeframe) condition = and(condition, sql`EXTRACT(MONTH FROM ${transactions.date}) = ${parsed.month}`) as any;
  if (parsed.year && !parsed.timeframe) condition = and(condition, sql`EXTRACT(YEAR FROM ${transactions.date}) = ${parsed.year}`) as any;
  
  // Advanced Category/Merchant Lookup
  if (parsed.category) {
    // Check Categories first
    const cat = await db.query.categories.findFirst({
      where: (c, { ilike, and, eq }) => and(ilike(c.name, `%${parsed.category}%`), eq(c.userId, userId))
    });
    if (cat) {
      condition = and(condition, eq(transactions.categoryId, cat.id)) as any;
    } else {
      // Check Merchants
      const merch = await db.query.merchants.findFirst({
        where: (m, { ilike }) => ilike(m.name, `%${parsed.category}%`)
      });
      if (merch) condition = and(condition, eq(transactions.merchantId, merch.id)) as any;
    }
  }

  try {
    switch (parsed.intent) {
      case "sum": {
        const res = await db.select({ total: sum(transactions.amount) }).from(transactions).where(condition);
        const total = Number(res[0].total || 0);
        return {
          answer: `The ${parsed.type === "INCOME" ? "total income" : "total spend"} is ₹${total.toLocaleString('en-IN')}.`,
          data: { total }
        };
      }
      case "avg": {
        const res = await db.select({ val: avg(transactions.amount) }).from(transactions).where(condition);
        const val = Number(res[0].val || 0);
        return {
          answer: `The average amount is ₹${val.toLocaleString('en-IN')}.`,
          data: { average: val }
        };
      }
      case "max":
      case "min": {
        const res = await db.select({
          amount: transactions.amount,
          merchant: merchants.name,
          date: transactions.date,
          desc: transactions.description
        })
        .from(transactions)
        .leftJoin(merchants, eq(transactions.merchantId, merchants.id))
        .where(condition)
        .orderBy(parsed.intent === "max" ? desc(transactions.amount) : transactions.amount)
        .limit(1);

        if (res.length > 0) {
          return {
            answer: `The ${parsed.intent === "max" ? "highest" : "lowest"} amount was ₹${Number(res[0].amount).toLocaleString('en-IN')} at ${res[0].merchant || res[0].desc || 'Unknown'} on ${new Date(res[0].date).toLocaleDateString()}.`,
            data: res[0]
          };
        }
        return { answer: "I couldn't find any transactions for that query." };
      }
      case "breakdown": {
        const res = await db.select({
          name: categories.name,
          total: sum(transactions.amount)
        })
        .from(transactions)
        .leftJoin(categories, eq(transactions.categoryId, categories.id))
        .where(condition)
        .groupBy(categories.id, categories.name)
        .orderBy(desc(sum(transactions.amount)))
        .limit(8);

        if (res.length === 0) return { answer: "No data to break down." };
        const list = res.map(r => `• ${r.name || 'Uncategorized'}: ₹${Number(r.total).toLocaleString('en-IN')}`).join("\n");
        return { answer: `Here is the breakdown:\n${list}`, data: res };
      }
      default: {
        const res = await db.select({
          amount: transactions.amount,
          date: transactions.date,
          merchant: merchants.name,
          desc: transactions.description
        })
        .from(transactions)
        .leftJoin(merchants, eq(transactions.merchantId, merchants.id))
        .where(condition)
        .orderBy(desc(transactions.date))
        .limit(5);

        if (res.length === 0) return { answer: "I found no matching transactions." };
        const list = res.map(r => `₹${Number(r.amount).toLocaleString('en-IN')} - ${r.merchant || r.desc || 'Unknown'} (${new Date(r.date).toLocaleDateString()})`).join("\n");
        return { answer: `Here are the results:\n${list}`, data: res };
      }
    }
  } catch (e: any) {
    return { answer: `Sorry, I ran into an error: ${e.message}` };
  }
}
