import { pgTable, text, timestamp, decimal, varchar, boolean, unique, uniqueIndex } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';

// ─── Better Auth Tables ────────────────────────────────────────────────────────

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull(),
  image: text('image'),
  createdAt: timestamp('createdAt').notNull(),
  updatedAt: timestamp('updatedAt').notNull()
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull(),
  updatedAt: timestamp('updatedAt').notNull()
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  expiresAt: timestamp('expiresAt'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull(),
  updatedAt: timestamp('updatedAt').notNull()
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').notNull(),
  updatedAt: timestamp('updatedAt').notNull()
});

// ─── App Tables ───────────────────────────────────────────────────────────────

export const categories = pgTable('categories', {
  id: varchar('id').$defaultFn(() => createId()).primaryKey(),
  name: varchar('name').notNull(),
  icon: varchar('icon'),
  color: varchar('color').default('#3b82f6').notNull(),
  isDefault: boolean('is_default').default(false).notNull(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  unq: unique().on(table.name, table.userId)
}));

export const merchants = pgTable('merchants', {
  id: varchar('id').$defaultFn(() => createId()).primaryKey(),
  name: varchar('name').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  unq: unique().on(table.name)
}));

export const transactions = pgTable('transactions', {
  id: varchar('id').$defaultFn(() => createId()).primaryKey(),
  externalId: varchar('external_id').unique(),
  amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
  type: varchar('type', { enum: ['INCOME', 'EXPENSE'] }).notNull(),
  paymentMethod: varchar('payment_method'),
  description: text('description'),
  date: timestamp('date').notNull(),
  notes: text('notes'),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  categoryId: varchar('category_id').references(() => categories.id, { onDelete: 'set null' }),
  merchantId: varchar('merchant_id').references(() => merchants.id, { onDelete: 'set null' }),
  transactionType: varchar('transaction_type'), // debit/credit
  isRecurring: varchar('is_recurring'), // Yes/No
  weekday: varchar('weekday'), // Monday, etc.
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ─── Relations ────────────────────────────────────────────────────────────────

export const usersRelations = relations(user, ({ many }) => ({
  transactions: many(transactions),
  categories: many(categories),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  user: one(user, {
    fields: [categories.userId],
    references: [user.id],
  }),
  transactions: many(transactions),
}));

export const merchantsRelations = relations(merchants, ({ many }) => ({
  transactions: many(transactions),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(user, {
    fields: [transactions.userId],
    references: [user.id],
  }),
  category: one(categories, {
    fields: [transactions.categoryId],
    references: [categories.id],
  }),
  merchant: one(merchants, {
    fields: [transactions.merchantId],
    references: [merchants.id],
  }),
}));
