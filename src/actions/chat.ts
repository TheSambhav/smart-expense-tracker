"use server";

import { db } from "@/db";
import { transactions, categories, merchants } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { eq, and, sql, desc, gte, lte, sum, avg, count } from "drizzle-orm";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

// Based on the diagnostic list, gemini-2.5-flash is the current supported model
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function processChatQuery(query: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");
  const userId = session.user.id;

  try {
    // 1. The "Fully AI" SQL Generation Step
    const systemPrompt = `
      You are a PostgreSQL Expert. Use this EXACT Physical Table Schema:

      - transactions (snake_case columns): 
        * id, user_id, amount, description, date, payment_method, notes, external_id, created_at, updated_at
        * type: varchar ('INCOME' or 'EXPENSE')
        * transaction_type: varchar ('debit' for expense, 'credit' for income)
        * is_recurring: varchar ('Yes', 'No')
        * weekday: varchar (e.g., 'Monday', 'Tuesday')
        * category_id, merchant_id (JOIN these for names)

      - categories: id, name, icon, color, user_id, is_default
      - merchants: id, name

      Current User ID: "${userId}"
      Current Date: ${new Date().toISOString().split('T')[0]} (YYYY-MM-DD)

      Task: Write a valid PostgreSQL SELECT query to answer the user's question.
      Rules:
      1. ALWAYS filter by transactions.user_id = '${userId}'.
      2. Use 'ilike' for string matches.
      3. Return ONLY the SQL query. NO EXPLANATION.
      4. For currency, use SUM(transactions.amount).
      5. SEARCH STRATEGY: Descriptions follow 'Merchant - Subcategory' (e.g. 'Zomato - Fast Food'). If the user asks for specific types (medicine, coffee, metro, cashback, salary), search BOTH transactions.description AND categories.name AND merchants.name using ILIKE.
      6. DATA MAPPING: 'credit' or 'INCOME' = money received. 'debit' or 'EXPENSE' = money spent.
      7. Check transactions.payment_method for 'UPI', 'Wallet', 'Card', 'Cash'.
      8. Check transactions.is_recurring = 'Yes' for subscriptions.
      9. YEAR ASSUMPTION: If no year is mentioned, search ALL years.
    `;

    const aiExtraction = await model.generateContent([systemPrompt, query]);
    const rawText = aiExtraction.response.text();

    // Robust extraction: Find the first SELECT and end at the last semicolon or end of block
    const sqlMatch = rawText.match(/SELECT[\s\S]*?(?:;|$)/i);
    let sqlQuery = sqlMatch ? sqlMatch[0].replace(/```sql|```/g, "").trim() : "";

    if (!sqlQuery) throw new Error("AI failed to generate a valid SQL query. Try being more specific.");

    console.log("AI GENERATED SQL:", sqlQuery);

    // Security check: Only allow SELECT and prevent common destructive commands
    const forbidden = ["insert", "update", "delete", "drop", "truncate", "alter", "create", "grant", "revoke"];
    const lowerSql = sqlQuery.toLowerCase();

    if (forbidden.some(word => lowerSql.includes(word + " "))) {
      throw new Error("Security Alert: Only SELECT queries are permitted.");
    }

    // 2. Execute the AI's Query
    const result = await db.execute(sql.raw(sqlQuery));

    // postgres-js returns rows directly as the result object
    const resultData = Array.isArray(result) ? result : (result as any).rows || result;

    console.log("SQL RESULT DATA:", resultData);

    // 3. AI Final Response
    const finalPrompt = `
      Answer this: "${query}"
      Data result: ${JSON.stringify(resultData)}
      
      Instructions:
      1. Explain clearly in INR (₹). 
      2. Use markdown bolding for key figures.
      3. If no data, explain that no records were found for that specific criteria.
      4. Be concise but helpful.
    `;
    const finalAiResponse = await model.generateContent(finalPrompt);

    return {
      answer: finalAiResponse.response.text(),
      data: resultData
    };

  } catch (e: any) {
    console.error("SQL AI ERROR:", e);

    // Handle Rate Limit (429) errors gracefully
    if (e.message?.includes("429") || e.status === 429) {
      const retryAfter = e.message?.match(/retry in ([\d.]+)s/i);
      const waitTime = retryAfter ? `Please try again in about ${Math.ceil(parseFloat(retryAfter[1]))} seconds.` : "Please try again later today.";
      return {
        answer: `**AI Limit Reached**: You've hit the daily quota for the AI Analyst. ${waitTime}\n\n*Tip: The free tier allows 20 detailed analyses per day.*`
      };
    }

    return { answer: `I encountered an error while analyzing the data: ${e.message || "Unknown error"}. Try rephrasing your question.` };
  }
}
