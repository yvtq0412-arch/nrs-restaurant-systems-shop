'use client';

import { useCart } from '@/lib/cart-store';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function CartPage() {
  const items = useCart((s) => s.items);
  const updateQuantity = useCart((s) => s.updateQuantity);
  const remove = useCart((s) => s.remove);
  const subtotal = useCart((s) => s.subtotal());
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="max-w-3xl mx-auto px-6 py-16" />;

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h1 className="font-serif text-4xl mb-6">Cart</h1>
        <p className="text-ink/60 mb-8">カートは空です。</p>
        <Link href="/" className="btn-primary">商品を見る</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="font-serif text-4xl mb-12">Cart</h1>

      <div className="space-y-6">
        {items.map((item) => (
          <div key={item.productId} className="flex gap-4 pb-6 border-b border-ink/10">
            <img src={item.imageUrl} alt={item.name} className="w-24 h-24 object-cover bg-ink/5" />
            <div className="flex-1">
              <h3 className="font-serif text-lg">{item.name}</h3>
              <p className="text-sm text-ink/60 mt-1">¥{item.priceJpy.toLocaleString()}</p>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center border border-ink/20 text-sm">
                  <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="px-3 py-1 hover:bg-ink/5">−</button>
                  <span className="w-10 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="px-3 py-1 hover:bg-ink/5">＋</button>
                </div>
                <button onClick={() => remove(item.productId)} className="text-xs text-ink/50 hover:text-ink underline">
                  削除
                </button>
              </div>
            </div>
            <div className="text-right">
              <p className="tracking-widest">¥{(item.priceJpy * item.quantity).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 space-y-4">
        <div className="flex justify-between text-lg">
          <span>小計</span>
          <span className="tracking-widest">¥{subtotal.toLocaleString()}</span>
        </div>
        <p className="text-xs text-ink/50 text-right">※送料は次の画面でお届け先入力後に確定します</p>
        <Link href="/checkout" className="btn-primary w-full">
          お会計に進む
        </Link>
      </div>
    </div>
  );
}
