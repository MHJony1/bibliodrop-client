import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { stripe } from '@/lib/stripe';

export async function POST(request) {
  try {
    const headersList = await headers();
    const origin = headersList.get('origin');

    // Retrieve active authentication session
    const userSession = await auth.api.getSession({
      headers: await headers(),
    });
    const user = userSession?.user;

    // Parse data sent via JSON body instead of raw FormData
    const { bookId, title, price, deliveryFee } = await request.json();

    if (!title || !price) {
      return NextResponse.json(
        { error: 'Missing required parameters: title or price' },
        { status: 400 },
      );
    }

    // Stripe processes currency values in cents ($1 = 100 cents)
    const basePrice = parseFloat(price) || 0;
    const shippingFee = parseFloat(deliveryFee) || 0;
    const totalAmountInCents = Math.round((basePrice + shippingFee) * 100);

    // Generate Stripe Hosted Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer_email: user?.email || undefined, // Pre-fills user email in Stripe form if logged in
      mode: 'payment',
      success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/browsebooks/${bookId}`,
      metadata: {
        bookId: bookId,
        userId: user?.id || 'guest',
        price: Number(price),
        userEmail: user.email,
        bookTitle: title,
      },
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: title,
              description: `Delivery authorization catalog processing fee`,
            },
            unit_amount: totalAmountInCents,
          },
          quantity: 1,
        },
      ],
    });

    // Return the generated session URL string directly to frontend
    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (err) {
    console.error('Stripe Session Error:', err);
    return NextResponse.json(
      { error: err.message || 'Internal Transaction Initialization Error' },
      { status: 500 },
    );
  }
}
