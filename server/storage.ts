import { type User, type UpsertUser, users } from "@shared/schema";
import { db } from "../db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  setUserType(id: string, userType: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const existingUser = userData.id ? await this.getUser(userData.id) : undefined;

    if (existingUser) {
      const [updated] = await db.update(users)
        .set({
          email: userData.email || existingUser.email,
          firstName: userData.firstName || existingUser.firstName,
          lastName: userData.lastName || existingUser.lastName,
          profileImageUrl: userData.profileImageUrl || existingUser.profileImageUrl,
          updatedAt: new Date(),
        })
        .where(eq(users.id, existingUser.id))
        .returning();
      return updated;
    }

    const [newUser] = await db.insert(users)
      .values({
        id: userData.id,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        profileImageUrl: userData.profileImageUrl,
        userType: userData.userType || 'individual',
        isAdmin: userData.isAdmin || false,
        referralCode: userData.referralCode,
        referredBy: userData.referredBy,
      })
      .returning();
    return newUser;
  }

  async setUserType(id: string, userType: string): Promise<void> {
    await db.update(users)
      .set({ userType, updatedAt: new Date() })
      .where(eq(users.id, id));
  }
}

export const storage = new DatabaseStorage();
