import Stripe from 'stripe';

let stripeClient: Stripe | null = null;

export function getStripeClient(): Stripe {
  if (!stripeClient) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
    }
    stripeClient = new Stripe(secretKey, {
      apiVersion: '2024-12-18.acacia' as any,
    });
  }
  return stripeClient;
}

// Alias for backward compatibility
export async function getUncachableStripeClient(): Promise<Stripe> {
  return getStripeClient();
}

export async function getStripePublishableKey(): Promise<string> {
  const key = process.env.STRIPE_PUBLISHABLE_KEY;
  if (!key) {
    throw new Error('STRIPE_PUBLISHABLE_KEY is not set in environment variables');
  }
  return key;
}

export async function getStripeSecretKey(): Promise<string> {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
  }
  return key;
}

export function getStripeWebhookSecret(): string {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error('STRIPE_WEBHOOK_SECRET is not set in environment variables');
  }
  return secret;
}
