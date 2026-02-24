import session from "express-session";
import type { Express, RequestHandler } from "express";
import connectPg from "connect-pg-simple";
import MemoryStore from "memorystore";

const MemoryStoreSession = MemoryStore(session);

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 7 days
  const databaseUrl = process.env.DATABASE_URL;
  const hasRealDb = databaseUrl && !databaseUrl.includes('placeholder') && !databaseUrl.includes('localhost');

  let store: any;

  if (hasRealDb) {
    const pgStore = connectPg(session);
    store = new pgStore({
      conString: databaseUrl,
      createTableIfMissing: true,
      ttl: sessionTtl,
      tableName: "sessions",
    });
    console.log('[session] Using PostgreSQL session store');
  } else {
    store = new MemoryStoreSession({
      checkPeriod: sessionTtl,
    });
    console.log('[session] Using in-memory session store (no DB configured — sessions will not persist across restarts)');
  }

  return session({
    secret: process.env.SESSION_SECRET || "autodossiers-dev-secret-change-me",
    store,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: sessionTtl,
    },
  });
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
}

// Session-based authentication middleware
export const isAuthenticated: RequestHandler = (req, res, next) => {
  if (req.session && (req.session as any).userId) {
    return next();
  }
  return res.status(401).json({ message: "Non authentifié" });
};

// Admin authentication middleware
export const isAdmin: RequestHandler = async (req, res, next) => {
  if (!req.session || !(req.session as any).userId) {
    return res.status(401).json({ message: "Non authentifié" });
  }
  if (!(req.session as any).isAdmin) {
    return res.status(403).json({ message: "Accès réservé aux administrateurs" });
  }
  return next();
};
