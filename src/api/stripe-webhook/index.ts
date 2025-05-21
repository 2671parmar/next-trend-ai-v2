import { handleStripeWebhook } from '../stripe-webhook';

export async function POST(req: Request) {
  return handleStripeWebhook(req);
} 