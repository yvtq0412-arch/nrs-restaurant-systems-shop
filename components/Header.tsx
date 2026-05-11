'use client';

import Link from 'next/link';
import { useCart } from '@/lib/cart-store';
import { useEffect, useState } from 'react';

export default function Header() {
  const count = useCart((s) => s.count());
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <header className="border-b border-ink/10 bg-bone/95 backdrop-blur sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-serif text-xl tracking-widest">
          BURGER &amp; SHRIMP
        </Link>
        <nav className="hidden sm:flex items-center gap-8 text-sm tracking-widest uppercase">
          <Link href="/" className="hover:opacity-60">Shop</Link>
          <Link href="/about" className="hover:opacity-60">About</Link>
          <Link href="/contact" className="hover:opacity-60">Contact</Link>
        </nav>
        <Link href="/cart" className="text-sm tracking-widest uppercase hover:opacity-60 relative">
          Cart{mounted && count > 0 && (
            <span className="ml-2 inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1 bg-ink text-bone text-xs rounded-full">
              {count}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
