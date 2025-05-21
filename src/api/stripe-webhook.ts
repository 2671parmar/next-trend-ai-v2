import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

const stripe = new Stripe(import.meta.env.VITE_STRIPE_SECRET_KEY, {
  apiVersion: '2025-04-30.basil',
});

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY
);

export async function handleStripeWebhook(req: Request) {
  const signature = req.headers.get('stripe-signature');
  const body = await req.text();

  console.log('Received webhook request');
  console.log('Signature:', signature);

  if (!signature) {
    console.error('No signature found in request');
    return new Response('No signature', { status: 400 });
  }

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      import.meta.env.VITE_STRIPE_WEBHOOK_SECRET
    );

    console.log('Webhook event type:', event.type);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log('Checkout session:', session);
      
      // Use customer_email or fallback to customer_details.email
      const customerEmail = session.customer_email || session.customer_details?.email;
      
      if (!customerEmail) {
        console.error('No customer email found in session');
        throw new Error('No customer email found in session');
      }

      console.log('Creating user for email:', customerEmail);

      // Create a new user in Supabase
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: customerEmail,
        email_confirm: true,
      });
      console.log('Supabase createUser response:', { authData, authError });
      if (authError) {
        console.error('Error creating user:', authError);
        throw authError;
      }

      console.log('User created successfully:', authData.user.id);

      // Create a profile for the user
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email: customerEmail,
          subscription_status: 'active',
          subscription_id: session.subscription,
          created_at: new Date().toISOString(),
        });

      if (profileError) {
        console.error('Error creating profile:', profileError);
        throw profileError;
      }

      console.log('Profile created successfully');

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Webhook error:', err);
    return new Response(
      JSON.stringify({ error: 'Webhook handler failed', details: err.message }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
} 