"use server";

import { db } from "@/db";
import { transactions, categories, merchants } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq, inArray } from "drizzle-orm";
import Papa from "papaparse";

export async function importCsvData(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");
  
  const userId = session.user.id;
  const file = formData.get("file") as File;
  
  if (!file) throw new Error("No file provided");

  const text = await file.text();
  const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
  const rows = parsed.data as any[];

  if (rows.length === 0) return { success: true, inserted: 0, skipped: 0 };

  // 1. Collect unique categories and merchants
  const uniqueCategoryNames = Array.from(new Set(rows.map(r => r.category).filter(Boolean)));
  const uniqueMerchantNames = Array.from(new Set(rows.map(r => r.merchant).filter(Boolean)));

  // 2. Ensure Categories exist
  if (uniqueCategoryNames.length > 0) {
    await db.insert(categories)
      .values(uniqueCategoryNames.map(name => ({
        name,
        userId,
        color: "#" + Math.floor(Math.random()*16777215).toString(16)
      })))
      .onConflictDoNothing({ target: [categories.name, categories.userId] });
  }

  // 3. Ensure Merchants exist
  if (uniqueMerchantNames.length > 0) {
    await db.insert(merchants)
      .values(uniqueMerchantNames.map(name => ({ name })))
      .onConflictDoNothing({ target: merchants.name });
  }

  // 4. Build Lookup Maps
  const allCats = await db.query.categories.findMany({
    where: eq(categories.userId, userId)
  });
  const allMerchs = await db.query.merchants.findMany();

  const categoryMap = new Map(allCats.map(c => [c.name.toLowerCase(), c.id]));
  const merchantMap = new Map(allMerchs.map(m => [m.name.toLowerCase(), m.id]));

  // 5. Prepare Transaction Batches
  const transactionsToInsert: any[] = [];
  
  for (const row of rows) {
    const extId = row.transaction_id || row.id;
    if (!extId) continue;

    const categoryId = categoryMap.get(row.category?.toLowerCase()) || null;
    const merchantId = merchantMap.get(row.merchant?.toLowerCase()) || null;

    transactionsToInsert.push({
      externalId: extId,
      userId: userId,
      categoryId,
      merchantId,
      amount: (row.amount || "0").toString(),
      type: row.transaction_type?.toLowerCase() === 'credit' ? 'INCOME' : 'EXPENSE',
      date: new Date(row.date),
      paymentMethod: row.payment_method || "",
      description: row.description || ""
    });
  }

  // 6. Batch Insert in Chunks (to avoid payload limits)
  const chunkSize = 100;
  let totalInserted = 0;

  for (let i = 0; i < transactionsToInsert.length; i += chunkSize) {
    const chunk = transactionsToInsert.slice(i, i + chunkSize);
    const result = await db.insert(transactions)
      .values(chunk)
      .onConflictDoNothing({ target: transactions.externalId })
      .returning({ id: transactions.id });
    
    totalInserted += result.length;
  }

  return { 
    success: true, 
    inserted: totalInserted, 
    skipped: rows.length - totalInserted 
  };
}
