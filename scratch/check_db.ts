
import { db } from "../src/db";
import { transactions, user } from "../src/db/schema";
import { sql } from "drizzle-orm";

async function check() {
  const tCount = await db.execute(sql`SELECT COUNT(*) FROM transactions`);
  const uCount = await db.execute(sql`SELECT COUNT(*) FROM user`);
  const distribution = await db.execute(sql`SELECT user_id, COUNT(*) FROM transactions GROUP BY user_id`);
  
  console.log("Total Transactions:", tCount);
  console.log("Total Users:", uCount);
  console.log("Distribution:", distribution);
  process.exit(0);
}

check();
