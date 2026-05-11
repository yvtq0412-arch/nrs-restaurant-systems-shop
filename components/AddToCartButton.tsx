'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart-store';
import type { Product } from '@/lib/types';

export default function AddToCartButton({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const add = useCart((s) => s.add);
  const router = useRouter();

  const handleAdd = () => {
    add(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleBuyNow = () => {
    add(product, qty);
    router.push('/cart');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <span className="label-field mb-0">数量</span>
        <div className="flex items-center border border-ink/20">
          <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-4 py-2 hover:bg-ink/5">−</button>
          <span className="w-12 text-center">{qty}</span>
          <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="px-4 py-2 hover:bg-ink/5">＋</button>
        </div>
        <span className="text-xs text-ink/50">残り {product.stock} 個</span>
      </div>
      <button onClick={handleAdd} className="btn-outline w-full">
        {added ? '✓ カートに追加しました' : 'カートに入れる'}
      </button>
      <button onClick={handleBuyNow} className="btn-primary w-full">
        今すぐ購入
      </button>
    </div>
  );
}
