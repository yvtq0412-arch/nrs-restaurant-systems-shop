'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
      if (!u && pathname !== '/admin/login') {
        router.replace('/admin/login');
      }
    });
  }, [pathname, router]);

  if (pathname === '/admin/login') return <>{children}</>;
  if (loading) return <div className="p-12 text-center text-ink/50">読み込み中...</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-ink/10 bg-ink text-bone">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <span className="font-serif tracking-widest">ADMIN</span>
            <Link href="/admin/orders" className="text-sm hover:opacity-60">注文管理</Link>
            <Link href="/admin/products" className="text-sm hover:opacity-60">商品管理</Link>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-bone/60">{user.email}</span>
            <button onClick={() => signOut(auth).then(() => router.push('/admin/login'))} className="hover:opacity-60">
              ログアウト
            </button>
          </div>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
