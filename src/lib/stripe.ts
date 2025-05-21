import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export interface StripeProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  paymentLink: string;
}

export const getStripe = () => stripePromise;

export const redirectToCheckout = async (paymentLink: string) => {
  try {
    const stripe = await stripePromise;
    if (!stripe) throw new Error('Stripe failed to initialize');

    // Redirect to Stripe Checkout
    const { error } = await stripe.redirectToCheckout({
      url: paymentLink,
    });

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error redirecting to checkout:', error);
    throw error;
  }
}; 