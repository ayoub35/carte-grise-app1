import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { db } from "../db";
import {
  users,
  documents,
  payments,
  referrals,
  faqs,
  contactSubmissions,
  pricing,
  orders,
  leads,
} from "../db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { setupAuth, isAuthenticated } from "./replitAuth";
import {
  insertDocumentSchema,
  insertPaymentSchema,
  insertReferralSchema,
  insertContactSubmissionSchema,
  insertFaqSchema,
  insertPricingSchema,
  insertOrderSchema,
  insertLeadSchema,
} from "@shared/schema";
import { randomBytes } from "crypto";
import { z } from "zod";
import { generateInvoicePDF, orderToInvoiceData } from "./pdfGenerator";
import { getUncachableStripeClient, getStripePublishableKey } from "./stripeClient";
import bcrypt from "bcryptjs";

function generateReferralCode(): string {
  return randomBytes(4).toString('hex').toUpperCase();
}

// Validation schemas for authentication
const registerProSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  firstName: z.string().min(2, "Prénom requis"),
  lastName: z.string().min(2, "Nom requis"),
  phone: z.string().min(10, "Numéro de téléphone invalide"),
  siret: z.string().length(14, "Le SIRET doit contenir 14 chiffres"),
  companyName: z.string().min(2, "Nom de l'entreprise requis"),
  companyAddress: z.string().optional(),
});

const registerParticulierSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  firstName: z.string().min(2, "Prénom requis"),
  lastName: z.string().min(2, "Nom requis"),
  phone: z.string().min(10, "Numéro de téléphone invalide").optional(),
});

const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

// Helper: get userId from session
function getSessionUserId(req: any): string | null {
  return (req.session as any)?.userId || null;
}

// Helper: check if session user is admin
async function checkAdmin(userId: string): Promise<boolean> {
  const [user] = await db.select().from(users).where(eq(users.id, userId));
  return user?.isAdmin ?? false;
}

// Admin middleware: checks session auth + admin flag
function isAdminAuthenticated(req: any, res: Response, next: Function) {
  const userId = getSessionUserId(req);
  if (!userId) {
    return res.status(401).json({ message: "Non authentifié" });
  }
  if (!(req.session as any).isAdmin) {
    return res.status(403).json({ message: "Accès réservé aux administrateurs" });
  }
  return next();
}

export async function registerRoutes(app: Express): Promise<Server> {

  // Setup session-based authentication
  await setupAuth(app);

  // ===== Custom Email/Password Authentication Routes =====

  // Register Professional
  app.post("/api/auth/register/pro", async (req: Request, res: Response) => {
    try {
      const data = registerProSchema.parse(req.body);

      // Check if email already exists
      const existingUser = await db.select().from(users).where(eq(users.email, data.email)).limit(1);
      if (existingUser.length > 0) {
        return res.status(400).json({ message: "Cet email est déjà utilisé" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(data.password, 10);

      // Create user
      const [newUser] = await db.insert(users).values({
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        siret: data.siret,
        companyName: data.companyName,
        companyAddress: data.companyAddress || null,
        userType: 'professional',
        referralCode: generateReferralCode(),
      }).returning();

      // Set session
      (req.session as any).userId = newUser.id;
      (req.session as any).userType = 'professional';

      return res.json({
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        userType: newUser.userType,
        companyName: newUser.companyName,
      });
    } catch (error: any) {
      console.error("Registration error:", error);
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: error.errors[0].message });
      }
      return res.status(500).json({ message: "Erreur lors de l'inscription" });
    }
  });

  // Register Particulier
  app.post("/api/auth/register/particulier", async (req: Request, res: Response) => {
    try {
      const data = registerParticulierSchema.parse(req.body);

      // Check if email already exists
      const existingUser = await db.select().from(users).where(eq(users.email, data.email)).limit(1);
      if (existingUser.length > 0) {
        return res.status(400).json({ message: "Cet email est déjà utilisé" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(data.password, 10);

      // Create user
      const [newUser] = await db.insert(users).values({
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone || null,
        userType: 'individual',
        referralCode: generateReferralCode(),
      }).returning();

      // Set session
      (req.session as any).userId = newUser.id;
      (req.session as any).userType = 'individual';

      return res.json({
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        userType: newUser.userType,
      });
    } catch (error: any) {
      console.error("Registration error:", error);
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: error.errors[0].message });
      }
      return res.status(500).json({ message: "Erreur lors de l'inscription" });
    }
  });

  // Login Professional
  app.post("/api/auth/login/pro", async (req: Request, res: Response) => {
    try {
      const data = loginSchema.parse(req.body);

      // Find user
      const [user] = await db.select().from(users).where(eq(users.email, data.email)).limit(1);

      if (!user || !user.password) {
        return res.status(401).json({ message: "Email ou mot de passe incorrect" });
      }

      // Check user type
      if (user.userType !== 'professional') {
        return res.status(401).json({ message: "Ce compte n'est pas un compte professionnel" });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(data.password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Email ou mot de passe incorrect" });
      }

      // Set session
      (req.session as any).userId = user.id;
      (req.session as any).userType = 'professional';
      (req.session as any).isAdmin = user.isAdmin;

      return res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        userType: user.userType,
        companyName: user.companyName,
        siret: user.siret,
      });
    } catch (error: any) {
      console.error("Login error:", error);
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: error.errors[0].message });
      }
      return res.status(500).json({ message: "Erreur lors de la connexion" });
    }
  });

  // Login Particulier
  app.post("/api/auth/login/particulier", async (req: Request, res: Response) => {
    try {
      const data = loginSchema.parse(req.body);

      // Find user
      const [user] = await db.select().from(users).where(eq(users.email, data.email)).limit(1);

      if (!user || !user.password) {
        return res.status(401).json({ message: "Email ou mot de passe incorrect" });
      }

      // Check user type
      if (user.userType !== 'individual') {
        return res.status(401).json({ message: "Ce compte n'est pas un compte particulier" });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(data.password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Email ou mot de passe incorrect" });
      }

      // Set session
      (req.session as any).userId = user.id;
      (req.session as any).userType = 'individual';
      (req.session as any).isAdmin = user.isAdmin;

      return res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        userType: user.userType,
      });
    } catch (error: any) {
      console.error("Login error:", error);
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: error.errors[0].message });
      }
      return res.status(500).json({ message: "Erreur lors de la connexion" });
    }
  });

  // Login Admin
  app.post("/api/auth/admin/login", async (req: Request, res: Response) => {
    try {
      const data = loginSchema.parse(req.body);

      // Find user
      const [user] = await db.select().from(users).where(eq(users.email, data.email)).limit(1);

      if (!user || !user.password) {
        return res.status(401).json({ message: "Email ou mot de passe incorrect" });
      }

      // Check if user is admin
      if (!user.isAdmin) {
        return res.status(403).json({ message: "Accès réservé aux administrateurs" });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(data.password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Email ou mot de passe incorrect" });
      }

      // Set session
      (req.session as any).userId = user.id;
      (req.session as any).userType = user.userType;
      (req.session as any).isAdmin = true;

      return res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        userType: user.userType,
        isAdmin: user.isAdmin,
      });
    } catch (error: any) {
      console.error("Admin login error:", error);
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: error.errors[0].message });
      }
      return res.status(500).json({ message: "Erreur lors de la connexion" });
    }
  });

  // Forgot Password
  app.post("/api/auth/forgot-password", async (req: Request, res: Response) => {
    try {
      const { email } = z.object({
        email: z.string().email("Email invalide"),
      }).parse(req.body);

      // Find user
      const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

      if (!user) {
        // Don't reveal if email exists for security
        return res.status(200).json({ message: "Si cet email existe, un lien de réinitialisation a été envoyé" });
      }

      // In production, send email with reset link
      // For now, return success message
      console.log(`Password reset requested for user: ${user.id} (${user.email})`);

      return res.status(200).json({
        message: "Si cet email existe, un lien de réinitialisation a été envoyé",
        email: user.email
      });
    } catch (error: any) {
      console.error("Forgot password error:", error);
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: error.errors[0].message });
      }
      return res.status(500).json({ message: "Erreur lors de la demande de réinitialisation" });
    }
  });

  // Get current session user
  app.get("/api/auth/me", async (req: Request, res: Response) => {
    try {
      const userId = getSessionUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Non authentifié" });
      }

      const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);

      if (!user) {
        return res.status(401).json({ message: "Utilisateur non trouvé" });
      }

      return res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        userType: user.userType,
        companyName: user.companyName,
        siret: user.siret,
        isAdmin: user.isAdmin,
        paidOrdersCount: user.paidOrdersCount || 0,
        freeCredits: user.freeCredits || 0,
      });
    } catch (error: any) {
      console.error("Auth check error:", error);
      return res.status(500).json({ message: "Erreur" });
    }
  });

  // Logout
  app.post("/api/auth/logout", (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Erreur lors de la déconnexion" });
      }
      res.clearCookie('connect.sid');
      return res.json({ message: "Déconnecté" });
    });
  });

  // ===== Documents endpoints =====
  app.get("/api/documents", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = getSessionUserId(req);
      const userDocuments = await db
        .select()
        .from(documents)
        .where(eq(documents.userId, userId!))
        .orderBy(desc(documents.createdAt));

      return res.json(userDocuments);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/documents", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = getSessionUserId(req);
      let documentData;
      let files: string[] = [];

      if (req.is('multipart/form-data')) {
        const data = JSON.parse(req.body.data || '{}');
        documentData = data;
        files = req.body.files || [];
      } else {
        documentData = req.body;
      }

      const validated = insertDocumentSchema.parse({
        ...documentData,
        userId: userId,
        status: 'pending',
        filePaths: files,
      });

      const [newDocument] = await db.insert(documents).values(validated).returning();
      return res.json(newDocument);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  });

  // ===== Payments endpoints =====
  app.get("/api/payments", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = getSessionUserId(req);
      const userPayments = await db
        .select()
        .from(payments)
        .where(eq(payments.userId, userId!))
        .orderBy(desc(payments.createdAt));

      return res.json(userPayments);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/payments", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = getSessionUserId(req);
      const validated = insertPaymentSchema.parse({
        ...req.body,
        userId: userId,
      });

      const [newPayment] = await db.insert(payments).values(validated).returning();
      return res.json(newPayment);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  });

  // ===== Referrals endpoints =====
  app.get("/api/referrals", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = getSessionUserId(req)!;
      const userReferrals = await db
        .select()
        .from(referrals)
        .where(eq(referrals.referrerId, userId))
        .orderBy(desc(referrals.createdAt));

      return res.json(userReferrals);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/referrals/invite", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = getSessionUserId(req)!;
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ message: 'Email is required' });
      }

      const validated = insertReferralSchema.parse({
        referrerId: userId,
        referredEmail: email,
        status: 'pending',
        reward: null,
      });

      const [newReferral] = await db.insert(referrals).values(validated).returning();
      return res.json(newReferral);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  });

  // ===== FAQ endpoints (public) =====
  app.get("/api/faqs", async (req: Request, res: Response) => {
    try {
      const allFaqs = await db
        .select()
        .from(faqs)
        .orderBy(faqs.category, faqs.order);

      return res.json(allFaqs);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  });

  // ===== Contact endpoints (public) =====
  app.post("/api/contact", async (req: Request, res: Response) => {
    try {
      const validated = insertContactSubmissionSchema.parse({
        ...req.body,
        status: 'unread',
      });

      const [newContact] = await db.insert(contactSubmissions).values(validated).returning();
      return res.json(newContact);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  });

  // ===== Pricing endpoints (public) =====
  app.get("/api/pricing", async (req: Request, res: Response) => {
    try {
      const allPricing = await db.select().from(pricing);
      return res.json(allPricing);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  });

  // ===== Order helpers =====
  function generateOrderNumber(): string {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const random = randomBytes(3).toString('hex').toUpperCase();
    return `AD${year}${month}-${random}`;
  }

  // Public order submission schema
  const publicOrderSchema = z.object({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(10),
    documentType: z.string(),
    vehicleInfo: z.object({
      type: z.string().optional(),
      region: z.string().optional(),
      plate: z.string().optional(),
      registrationDay: z.number().optional(),
      registrationMonth: z.number().optional(),
      registrationYear: z.number().optional(),
      fiscalHorsepower: z.number().optional(),
      make: z.string().optional(),
      model: z.string().optional(),
    }).optional(),
    price: z.number(),
    governmentTax: z.number().optional(),
    serviceFee: z.number().optional(),
    expressFee: z.number().optional(),
    expressDelivery: z.boolean().optional(),
    notes: z.string().optional(),
    filePaths: z.array(z.string()).optional(),
    useFreeCredit: z.boolean().optional(),
  });

  const FREE_CREDIT_DEMARCHES = ['declaration_achat', 'cession_vehicule_professionnel', 'enregistrement_cession'];

  // Public order submission (no auth required, but supports logged-in users)
  app.post("/api/documents/public", async (req: any, res: Response) => {
    try {
      const data = publicOrderSchema.parse(req.body);
      const orderNumber = generateOrderNumber();

      let userId: string | null = null;
      let usedFreeCredit = false;
      let finalPrice = data.price;
      let finalServiceFee = data.serviceFee || 30;

      if (req.session?.userId) {
        const sessionUserId = req.session.userId as string;
        userId = sessionUserId;
        const [user] = await db.select().from(users).where(eq(users.id, sessionUserId));

        if (user && user.userType === 'professional' && (user.freeCredits || 0) > 0) {
          if (data.useFreeCredit && FREE_CREDIT_DEMARCHES.includes(data.documentType)) {
            usedFreeCredit = true;
            finalServiceFee = 0;
            finalPrice = (data.governmentTax || 0) + (data.expressFee || 0);

            await db.update(users)
              .set({
                freeCredits: (user.freeCredits || 0) - 1,
                updatedAt: new Date()
              })
              .where(eq(users.id, sessionUserId));
          }
        }
      }

      const [newOrder] = await db.insert(orders).values({
        orderNumber,
        userId,
        email: data.email,
        phone: data.phone,
        firstName: data.firstName,
        lastName: data.lastName,
        documentType: data.documentType,
        vehicleInfo: data.vehicleInfo,
        filePaths: data.filePaths || [],
        status: 'pending',
        price: finalPrice.toString(),
        governmentTax: data.governmentTax?.toString(),
        serviceFee: finalServiceFee.toString(),
        expressFee: data.expressFee?.toString(),
        expressDelivery: data.expressDelivery || false,
        usedFreeCredit,
        notes: data.notes,
        paymentStatus: 'pending',
      }).returning();

      return res.json({
        success: true,
        orderId: newOrder.id,
        orderNumber: newOrder.orderNumber,
        usedFreeCredit,
        message: usedFreeCredit ? 'Commande créée avec crédit gratuit appliqué!' : 'Commande créée avec succès',
      });
    } catch (error: any) {
      console.error("Error creating public order:", error);
      return res.status(400).json({ message: error.message });
    }
  });

  // Get order status by order number (public)
  app.get("/api/orders/track/:orderNumber", async (req: Request, res: Response) => {
    try {
      const { orderNumber } = req.params;
      const [order] = await db
        .select({
          orderNumber: orders.orderNumber,
          status: orders.status,
          paymentStatus: orders.paymentStatus,
          documentType: orders.documentType,
          price: orders.price,
          createdAt: orders.createdAt,
        })
        .from(orders)
        .where(eq(orders.orderNumber, orderNumber));

      if (!order) {
        return res.status(404).json({ message: 'Commande non trouvée' });
      }

      return res.json(order);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  });

  // Generate invoice PDF for an order
  app.get("/api/orders/:orderNumber/invoice", async (req: Request, res: Response) => {
    try {
      const { orderNumber } = req.params;
      const [order] = await db
        .select()
        .from(orders)
        .where(eq(orders.orderNumber, orderNumber));

      if (!order) {
        return res.status(404).json({ message: 'Commande non trouvée' });
      }

      const invoiceData = orderToInvoiceData(order);
      const pdfBuffer = await generateInvoicePDF(invoiceData);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=facture-${orderNumber}.pdf`);
      res.setHeader('Content-Length', pdfBuffer.length);
      return res.send(pdfBuffer);
    } catch (error: any) {
      console.error("Error generating invoice:", error);
      return res.status(500).json({ message: error.message });
    }
  });

  // Get Stripe publishable key (public)
  app.get("/api/stripe/config", async (req: Request, res: Response) => {
    try {
      const publishableKey = await getStripePublishableKey();
      return res.json({ publishableKey });
    } catch (error: any) {
      console.error("Error getting Stripe config:", error);
      return res.status(500).json({ message: 'Stripe configuration error' });
    }
  });

  // Create Stripe Checkout Session for an order
  app.post("/api/orders/:orderNumber/checkout", async (req: Request, res: Response) => {
    try {
      const { orderNumber } = req.params;
      const [order] = await db
        .select()
        .from(orders)
        .where(eq(orders.orderNumber, orderNumber));

      if (!order) {
        return res.status(404).json({ message: 'Commande non trouvée' });
      }

      if (order.paymentStatus === 'succeeded') {
        return res.status(400).json({ message: 'Cette commande a déjà été payée' });
      }

      const stripe = await getUncachableStripeClient();
      const baseUrl = process.env.APP_BASE_URL || `http://localhost:${process.env.PORT || 5000}`;

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: order.documentType,
                description: `Commande ${orderNumber}`,
              },
              unit_amount: Math.round(parseFloat(order.price) * 100),
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${baseUrl}/order/success/${orderNumber}?payment=success`,
        cancel_url: `${baseUrl}/order/success/${orderNumber}?payment=cancelled`,
        customer_email: order.email,
        metadata: {
          orderNumber,
          orderId: order.id,
        },
      });

      await db
        .update(orders)
        .set({
          stripeCheckoutSessionId: session.id,
          updatedAt: new Date(),
        })
        .where(eq(orders.id, order.id));

      return res.json({ url: session.url });
    } catch (error: any) {
      console.error("Error creating checkout session:", error);
      return res.status(500).json({ message: error.message });
    }
  });

  // ===== Admin Routes =====
  // All admin routes use isAdminAuthenticated middleware

  // Admin: Get all orders
  app.get("/api/admin/orders", isAdminAuthenticated, async (req: any, res: Response) => {
    try {
      const allOrders = await db.select().from(orders).orderBy(desc(orders.createdAt));
      return res.json(allOrders);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  });

  // Admin: Update order status
  app.patch("/api/admin/orders/:id", isAdminAuthenticated, async (req: any, res: Response) => {
    try {
      const { id } = req.params;
      const [updated] = await db
        .update(orders)
        .set({ ...req.body, updatedAt: new Date() })
        .where(eq(orders.id, id))
        .returning();

      return res.json(updated);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  });

  // Admin: Get order stats
  app.get("/api/admin/stats", isAdminAuthenticated, async (req: any, res: Response) => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const allOrders = await db.select().from(orders);
      const todayOrders = allOrders.filter(o => new Date(o.createdAt!) >= today);
      const pendingOrders = allOrders.filter(o => o.status === 'pending');
      const totalRevenue = allOrders
        .filter(o => o.paymentStatus === 'succeeded')
        .reduce((sum, o) => sum + parseFloat(o.price || '0'), 0);

      return res.json({
        totalOrders: allOrders.length,
        todayOrders: todayOrders.length,
        pendingOrders: pendingOrders.length,
        totalRevenue: totalRevenue.toFixed(2),
      });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  });

  // Admin: Get all documents
  app.get("/api/admin/documents", isAdminAuthenticated, async (req: any, res: Response) => {
    try {
      const allDocuments = await db.select().from(documents).orderBy(desc(documents.createdAt));
      return res.json(allDocuments);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  });

  // Admin: Update document
  app.patch("/api/admin/documents/:id", isAdminAuthenticated, async (req: any, res: Response) => {
    try {
      const { id } = req.params;
      const [updated] = await db
        .update(documents)
        .set(req.body)
        .where(eq(documents.id, id))
        .returning();

      return res.json(updated);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  });

  // Admin: Get all users
  app.get("/api/admin/users", isAdminAuthenticated, async (req: any, res: Response) => {
    try {
      const allUsers = await db.select().from(users).orderBy(desc(users.createdAt));
      return res.json(allUsers);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  });

  // Admin: Update user
  app.patch("/api/admin/users/:id", isAdminAuthenticated, async (req: any, res: Response) => {
    try {
      const { id } = req.params;
      const [updated] = await db
        .update(users)
        .set(req.body)
        .where(eq(users.id, id))
        .returning();

      return res.json(updated);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  });

  // Admin: Get all payments
  app.get("/api/admin/payments", isAdminAuthenticated, async (req: any, res: Response) => {
    try {
      const allPayments = await db.select().from(payments).orderBy(desc(payments.createdAt));
      return res.json(allPayments);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  });

  // Admin: Get all contact submissions
  app.get("/api/admin/contact", isAdminAuthenticated, async (req: any, res: Response) => {
    try {
      const allContacts = await db.select().from(contactSubmissions).orderBy(desc(contactSubmissions.createdAt));
      return res.json(allContacts);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  });

  // Admin: Update contact submission
  app.patch("/api/admin/contact/:id", isAdminAuthenticated, async (req: any, res: Response) => {
    try {
      const { id } = req.params;
      const [updated] = await db
        .update(contactSubmissions)
        .set(req.body)
        .where(eq(contactSubmissions.id, id))
        .returning();

      return res.json(updated);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  });

  // Admin: Get all FAQs
  app.get("/api/admin/faqs", isAdminAuthenticated, async (req: any, res: Response) => {
    try {
      const allFaqs = await db.select().from(faqs).orderBy(faqs.category, faqs.order);
      return res.json(allFaqs);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  });

  // Admin: Create FAQ
  app.post("/api/admin/faqs", isAdminAuthenticated, async (req: any, res: Response) => {
    try {
      const validated = insertFaqSchema.parse(req.body);
      const [newFaq] = await db.insert(faqs).values(validated).returning();
      return res.json(newFaq);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  });

  // Admin: Update FAQ
  app.patch("/api/admin/faqs/:id", isAdminAuthenticated, async (req: any, res: Response) => {
    try {
      const { id } = req.params;
      const [updated] = await db
        .update(faqs)
        .set(req.body)
        .where(eq(faqs.id, id))
        .returning();

      return res.json(updated);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  });

  // Admin: Delete FAQ
  app.delete("/api/admin/faqs/:id", isAdminAuthenticated, async (req: any, res: Response) => {
    try {
      const { id } = req.params;
      await db.delete(faqs).where(eq(faqs.id, id));
      return res.json({ success: true });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  });

  // Admin: Get all pricing
  app.get("/api/admin/pricing", isAdminAuthenticated, async (req: any, res: Response) => {
    try {
      const allPricing = await db.select().from(pricing);
      return res.json(allPricing);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  });

  // Admin: Create pricing
  app.post("/api/admin/pricing", isAdminAuthenticated, async (req: any, res: Response) => {
    try {
      const validated = insertPricingSchema.parse(req.body);
      const [newPricing] = await db.insert(pricing).values(validated).returning();
      return res.json(newPricing);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  });

  // Admin: Update pricing
  app.patch("/api/admin/pricing/:id", isAdminAuthenticated, async (req: any, res: Response) => {
    try {
      const { id } = req.params;
      const [updated] = await db
        .update(pricing)
        .set(req.body)
        .where(eq(pricing.id, id))
        .returning();

      return res.json(updated);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  });

  // ===== Lead routes =====

  // Lead capture route (no auth required)
  app.post("/api/leads", async (req: Request, res: Response) => {
    try {
      const validated = insertLeadSchema.parse(req.body);
      const [newLead] = await db.insert(leads).values(validated).returning();
      return res.status(201).json(newLead);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  });

  // Get all leads (admin only)
  app.get("/api/admin/leads", isAdminAuthenticated, async (req: any, res: Response) => {
    try {
      const allLeads = await db.select().from(leads).orderBy(desc(leads.createdAt));
      return res.json(allLeads);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  });

  // Delete lead (admin only)
  app.delete("/api/admin/leads/:id", isAdminAuthenticated, async (req: any, res: Response) => {
    try {
      const { id } = req.params;
      await db.delete(leads).where(eq(leads.id, id));
      return res.json({ success: true });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
