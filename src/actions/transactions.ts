"use server";

import { db } from "@/db";
import { transactions, categories, merchants } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq, and, sql, desc, sum, gte, lte } from "drizzle-orm";

async function getUser() {
  const session = await auth.api.getSession({
    headers: await headers()
  });
  if (!session?.user) throw new Error("Unauthorized");
  return session.user;
}

export async function getSummary(filters: any) {
  const user = await getUser();
  
  // Base condition: User's transactions
  const condition = eq(transactions.userId, user.id);
  // TODO: Add date filtering if filters are provided

  const result = await db.select({
    totalSpend: sum(sql`CASE WHEN ${transactions.type} = 'EXPENSE' THEN ${transactions.amount} ELSE 0 END`),
    totalIncome: sum(sql`CASE WHEN ${transactions.type} = 'INCOME' THEN ${transactions.amount} ELSE 0 END`),
    netBalance: sum(sql`CASE WHEN ${transactions.type} = 'INCOME' THEN ${transactions.amount} ELSE -${transactions.amount} END`),
  }).from(transactions).where(condition);

  const stats = result[0];

  // Get Top Category
  const topCat = await db.select({
    name: categories.name,
    amount: sum(transactions.amount)
  })
  .from(transactions)
  .leftJoin(categories, eq(transactions.categoryId, categories.id))
  .where(and(condition, eq(transactions.type, 'EXPENSE')))
  .groupBy(categories.id)
  .orderBy(desc(sum(transactions.amount)))
  .limit(1);

  return {
    totalSpend: Number(stats.totalSpend || 0),
    totalIncome: Number(stats.totalIncome || 0),
    netBalance: Number(stats.netBalance || 0),
    topCategory: topCat[0]?.name || "None",
  };
}

export async function getMonthlyData(filters: any) {
  const user = await getUser();
  
  const result = await db.select({
    month: sql<string>`to_char(${transactions.date}, 'Mon')`,
    spend: sum(sql`CASE WHEN ${transactions.type} = 'EXPENSE' THEN ${transactions.amount} ELSE 0 END`),
    income: sum(sql`CASE WHEN ${transactions.type} = 'INCOME' THEN ${transactions.amount} ELSE 0 END`),
  })
  .from(transactions)
  .where(eq(transactions.userId, user.id))
  .groupBy(sql`to_char(${transactions.date}, 'Mon'), date_trunc('month', ${transactions.date})`)
  .orderBy(sql`date_trunc('month', ${transactions.date})`);

  return result.map(r => ({
    name: r.month,
    spend: Number(r.spend || 0),
    income: Number(r.income || 0)
  }));
}

export async function getCategoriesData(filters: any) {
  const user = await getUser();
  
  const result = await db.select({
    name: sql<string>`COALESCE(${categories.name}, 'Uncategorized')`,
    color: sql<string>`COALESCE(${categories.color}, '#9ca3af')`,
    value: sum(transactions.amount),
  })
  .from(transactions)
  .leftJoin(categories, eq(transactions.categoryId, categories.id))
  .where(and(
    eq(transactions.userId, user.id),
    eq(transactions.type, 'EXPENSE')
  ))
  .groupBy(categories.id)
  .orderBy(desc(sum(transactions.amount)));

  return result.map(r => ({
    ...r,
    value: Number(r.value || 0)
  }));
}

export async function getTransactionsList(page = 1, limit = 20) {
  const user = await getUser();
  const offset = (page - 1) * limit;

  const data = await db.select({
    id: transactions.id,
    date: transactions.date,
    amount: transactions.amount,
    type: transactions.type,
    merchant: sql<string>`COALESCE(merchants.name, 'Unknown')`,
    category: sql<string>`COALESCE(categories.name, 'Uncategorized')`,
  })
  .from(transactions)
  .leftJoin(categories, eq(transactions.categoryId, categories.id))
  .leftJoin(merchants, eq(transactions.merchantId, merchants.id))
  .where(eq(transactions.userId, user.id))
  .orderBy(desc(transactions.date))
  .limit(limit)
  .offset(offset);

  const totalRes = await db.select({ count: sql<number>`count(*)` })
    .from(transactions)
    .where(eq(transactions.userId, user.id));

  const total = Number(totalRes[0].count);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
}
