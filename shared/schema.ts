import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
  decimal,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (mandatory for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (mandatory for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  password: text("password"),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  phone: varchar("phone"),
  profileImageUrl: varchar("profile_image_url"),
  userType: varchar("user_type").notNull().default('individual'), // 'individual' or 'professional'
  siret: varchar("siret"),
  companyName: varchar("company_name"),
  companyAddress: varchar("company_address"),
  isAdmin: boolean("is_admin").notNull().default(false),
  referralCode: varchar("referral_code").unique(),
  referredBy: varchar("referred_by"),
  paidOrdersCount: integer("paid_orders_count").notNull().default(0),
  freeCredits: integer("free_credits").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Documents table
export const documents = pgTable("documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  vehicleVin: varchar("vehicle_vin"),
  vehiclePlate: varchar("vehicle_plate").notNull(),
  vehicleYear: integer("vehicle_year"),
  vehicleFiscalHorsepower: integer("vehicle_fiscal_horsepower"),
  vehicleMake: varchar("vehicle_make"),
  vehicleModel: varchar("vehicle_model"),
  documentType: varchar("document_type").notNull(), // 'carte_grise', 'cession', 'duplicata', etc.
  status: varchar("status").notNull().default('pending'), // 'pending', 'in_progress', 'completed'
  filePaths: text("file_paths").array(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = typeof documents.$inferSelect;

// Payments table
export const payments = pgTable("payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  documentId: varchar("document_id").references(() => documents.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status").notNull().default('pending'), // 'pending', 'succeeded', 'failed'
  stripePaymentIntentId: varchar("stripe_payment_intent_id"),
  invoiceUrl: varchar("invoice_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  createdAt: true,
});

export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Payment = typeof payments.$inferSelect;

// Referrals table
export const referrals = pgTable("referrals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  referrerId: varchar("referrer_id").notNull().references(() => users.id),
  referredUserId: varchar("referred_user_id").references(() => users.id),
  referredEmail: varchar("referred_email"),
  status: varchar("status").notNull().default('pending'), // 'pending', 'registered', 'completed'
  reward: decimal("reward", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertReferralSchema = createInsertSchema(referrals).omit({
  id: true,
  createdAt: true,
});

export type InsertReferral = z.infer<typeof insertReferralSchema>;
export type Referral = typeof referrals.$inferSelect;

// Leads table for lead capture
export const leads = pgTable("leads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  phone: varchar("phone").notNull(),
  demarcheId: varchar("demarche_id").notNull(),
  demarcheName: varchar("demarche_name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  createdAt: true,
});

export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leads.$inferSelect;

// FAQ table
export const faqs = pgTable("faqs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  category: varchar("category").notNull(),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertFaqSchema = createInsertSchema(faqs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertFaq = z.infer<typeof insertFaqSchema>;
export type Faq = typeof faqs.$inferSelect;

// Pricing table
export const pricing = pgTable("pricing", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  documentType: varchar("document_type").notNull().unique(),
  basePrice: decimal("base_price", { precision: 10, scale: 2 }).notNull(),
  professionalPrice: decimal("professional_price", { precision: 10, scale: 2 }).notNull(),
  description: text("description"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertPricingSchema = createInsertSchema(pricing).omit({
  id: true,
  updatedAt: true,
});

export type InsertPricing = z.infer<typeof insertPricingSchema>;
export type Pricing = typeof pricing.$inferSelect;

// Contact submissions table
export const contactSubmissions = pgTable("contact_submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  email: varchar("email").notNull(),
  subject: varchar("subject").notNull(),
  message: text("message").notNull(),
  status: varchar("status").notNull().default('unread'), // 'unread', 'read', 'replied'
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertContactSubmissionSchema = createInsertSchema(contactSubmissions).omit({
  id: true,
  createdAt: true,
});

export type InsertContactSubmission = z.infer<typeof insertContactSubmissionSchema>;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;

// Public orders table (no login required)
export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderNumber: varchar("order_number").unique().notNull(),
  userId: varchar("user_id"),
  email: varchar("email").notNull(),
  phone: varchar("phone").notNull(),
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  documentType: varchar("document_type").notNull(),
  vehicleInfo: jsonb("vehicle_info"),
  filePaths: text("file_paths").array(),
  status: varchar("status").notNull().default('pending'),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  governmentTax: decimal("government_tax", { precision: 10, scale: 2 }),
  serviceFee: decimal("service_fee", { precision: 10, scale: 2 }),
  expressFee: decimal("express_fee", { precision: 10, scale: 2 }),
  expressDelivery: boolean("express_delivery").notNull().default(false),
  usedFreeCredit: boolean("used_free_credit").notNull().default(false),
  notes: text("notes"),
  stripePaymentIntentId: varchar("stripe_payment_intent_id"),
  stripeCheckoutSessionId: varchar("stripe_checkout_session_id"),
  paymentStatus: varchar("payment_status").notNull().default('pending'),
  invoiceUrl: varchar("invoice_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  orderNumber: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;
