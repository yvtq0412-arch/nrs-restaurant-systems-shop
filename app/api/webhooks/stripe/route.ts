import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { adminDb } from '@/lib/firebase/admin';
import Stripe from 'stripe';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature');
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !secret) {
    return NextResponse.json({ error: 'webhook secret not configured' }, { status: 400 });
  }

  const body = await req.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch (err: any) {
    console.error('[webhook] signature verification failed', err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = session.metadata?.orderId;
        if (orderId) {
          await adminDb()
            .collection('orders')
            .doc(orderId)
            .update({
              status: 'paid',
              stripePaymentIntentId: typeof session.payment_intent === 'string' ? session.payment_intent : undefined,
              updatedAt: Date.now(),
            });

          // 在庫を減らす（商品が存在する場合のみ）
          const doc = await adminDb().collection('orders').doc(orderId).get();
          const order = doc.data();
          if (order?.items) {
            for (const item of order.items) {
              const pRef = adminDb().collection('products').doc(item.productId);
              const pDoc = await pRef.get();
              if (pDoc.exists) {
                const current = pDoc.data()!.stock ?? 0;
                await pRef.update({ stock: Math.max(0, current - item.quantity) });
              }
            }
          }
        }
        break;
      }
      case 'checkout.session.expired':
      case 'checkout.session.async_payment_failed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = session.metadata?.orderId;
        if (orderId) {
          await adminDb().collection('orders').doc(orderId).update({
            status: 'cancelled',
            updatedAt: Date.now(),
          });
        }
        break;
      }
    }
    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('[webhook]', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
