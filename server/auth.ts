// Auth types — session-based authentication
// All auth logic is handled via express-session in replitAuth.ts

export interface AuthUser {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  userType?: string;
  isAdmin?: boolean;
}

// Extend express-session types
declare module 'express-session' {
  interface SessionData {
    userId: string;
    userType: string;
    isAdmin: boolean;
  }
}
