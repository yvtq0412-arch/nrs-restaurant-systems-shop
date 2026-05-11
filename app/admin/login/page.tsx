'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace('/admin/orders');
    } catch (e: any) {
      setError('ログインに失敗しました。メールアドレスとパスワードを確認してください。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ink text-bone p-6">
      <form onSubmit={handle} className="w-full max-w-sm space-y-6">
        <h1 className="font-serif text-3xl text-center tracking-widest">ADMIN</h1>
        <div>
          <label className="text-xs uppercase tracking-widest text-bone/60 block mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 bg-bone/10 border border-bone/20 text-bone focus:outline-none focus:border-bone"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest text-bone/60 block mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 bg-bone/10 border border-bone/20 text-bone focus:outline-none focus:border-bone"
          />
        </div>
        {error && <p className="text-red-300 text-sm">{error}</p>}
        <button type="submit" disabled={loading} className="w-full py-3 bg-bone text-ink uppercase tracking-widest text-sm disabled:opacity-50">
          {loading ? '...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
