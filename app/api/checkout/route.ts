import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { adminDb } from '@/lib/firebase/admin';
import { calcShippingFee } from '@/lib/shipping';
import type { CartItem, ShippingAddress } from '@/lib/types';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const items: CartItem[] = body.items;
    const shipping: ShippingAddress & { deliveryDate?: string; deliveryTimeSlot?: string; note?: string } = body.shipping;

    if (!items?.length) {
      return NextResponse.json({ error: 'カートが空です' }, { status: 400 });
    }

    // サーバー側でも価格・送料を再計算（クライアントの改ざんを防ぐ）
    // 商品マスタを Firestore から引いて検証する
    const productIds = items.map((i) => i.productId);
    const productDocs = await Promise.all(
      productIds.map((id) => adminDb().collection('products').doc(id).get())
    );

    const validatedItems = items.map((item, idx) => {
      const doc = productDocs[idx];
      if (doc?.exists) {
        const data = doc.data()!;
        return {
          ...item,
          name: data.name,
          priceJpy: data.priceJpy,
          imageUrl: data.imageUrl,
        };
      }
      // 商品マスタがない場合（サンプル運用時）はクライアント送信値を使用
      return item;
    });

    const subtotal = validatedItems.reduce((s, i) => s + i.priceJpy * i.quantity, 0);
    const shippingFee = calcShippingFee(shipping.prefecture, subtotal);

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? `https://${req.headers.get('host')}`;

    // 注文をFirestoreに事前作成（pending状態）
    const orderRef = adminDb().collection('orders').doc();
    await orderRef.set({
      status: 'pending',
      items: validatedItems,
      shipping,
      subtotalJpy: subtotal,
      shippingFeeJpy: shippingFee,
      totalJpy: subtotal + shippingFee,
      deliveryDate: shipping.deliveryDate ?? '',
      deliveryTimeSlot: shipping.deliveryTimeSlot ?? '',
      note: shipping.note ?? '',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Stripe Checkout セッションを作成
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        ...validatedItems.map((item) => ({
          quantity: item.quantity,
          price_data: {
            currency: 'jpy',
            unit_amount: item.priceJpy,
            product_data: {
              name: item.name,
              images: item.imageUrl ? [item.imageUrl] : undefined,
            },
          },
        })),
        ...(shippingFee > 0
          ? [
              {
                quantity: 1,
                price_data: {
                  currency: 'jpy',
                  unit_amount: shippingFee,
                  product_data: { name: `送料（${shipping.prefecture}）` },
                },
              },
            ]
          : []),
      ],
      customer_email: shipping.email,
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout/cancel`,
      metadata: {
        orderId: orderRef.id,
      },
      locale: 'ja',
    });

    // セッションIDを注文に紐付け
    await orderRef.update({ stripeSessionId: session.id });

    return NextResponse.json({ url: session.url, id: session.id });
  } catch (err: any) {
    console.error('[checkout]', err);
    return NextResponse.json({ error: err.message ?? '決済処理に失敗しました' }, { status: 500 });
  }
}
