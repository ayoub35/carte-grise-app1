import { getStripeClient, getStripeWebhookSecret } from './stripeClient';
import { db } from '../db';
import { orders, users } from '../db/schema';
import { eq } from 'drizzle-orm';

export class WebhookHandlers {
  static async processWebhook(payload: Buffer, signature: string): Promise<void> {
    if (!Buffer.isBuffer(payload)) {
      throw new Error(
        'STRIPE WEBHOOK ERROR: Payload must be a Buffer. ' +
        'Received type: ' + typeof payload + '. ' +
        'This usually means express.json() parsed the body before reaching this handler. ' +
        'FIX: Ensure webhook route is registered BEFORE app.use(express.json()).'
      );
    }

    const stripe = getStripeClient();
    const webhookSecret = getStripeWebhookSecret();

    const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);

    switch (event.type) {
      case 'checkout.session.completed':
        await WebhookHandlers.handleCheckoutSessionCompleted(event.data.object);
        break;
      case 'payment_intent.succeeded':
        console.log('Payment intent succeeded:', event.data.object.id);
        break;
      case 'payment_intent.payment_failed':
        console.log('Payment intent failed:', event.data.object.id);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  }

  static async handleCheckoutSessionCompleted(session: any): Promise<void> {
    const orderNumber = session.metadata?.orderNumber;
    if (!orderNumber) {
      console.log('No orderNumber in session metadata, skipping order update');
      return;
    }

    try {
      const [order] = await db
        .select()
        .from(orders)
        .where(eq(orders.orderNumber, orderNumber));

      await db
        .update(orders)
        .set({
          paymentStatus: 'succeeded',
          stripePaymentIntentId: session.payment_intent,
          status: 'processing',
          updatedAt: new Date(),
        })
        .where(eq(orders.orderNumber, orderNumber));

      console.log(`Order ${orderNumber} payment confirmed`);

      if (order?.userId && !order.usedFreeCredit) {
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.id, order.userId));

        if (user && user.userType === 'professional') {
          const newCount = (user.paidOrdersCount || 0) + 1;

          if (newCount >= 2) {
            await db
              .update(users)
              .set({
                paidOrdersCount: 0,
                freeCredits: (user.freeCredits || 0) + 1,
                updatedAt: new Date(),
              })
              .where(eq(users.id, user.id));
            console.log(`Pro user ${user.id}: earned 1 free credit (3x2 promo)`);
          } else {
            await db
              .update(users)
              .set({
                paidOrdersCount: newCount,
                updatedAt: new Date(),
              })
              .where(eq(users.id, user.id));
            console.log(`Pro user ${user.id}: paid orders count now ${newCount}/2`);
          }
        }
      } else if (order?.usedFreeCredit) {
        console.log(`Order ${orderNumber} used free credit - not counting towards 3x2 promo`);
      }
    } catch (error) {
      console.error(`Failed to update order ${orderNumber}:`, error);
    }
  }
}
