'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/lib/cart-store';

export default function SuccessPage() {
  const clear = useCart((s) => s.clear);
  const params = useSearchParams();
  const sessionId = params.get('session_id');

  useEffect(() => {
    // 決済成功時にカートを空にする
    clear();
  }, [clear]);

  return (
    <div className="max-w-2xl mx-auto px-6 py-24 text-center">
      <div className="text-5xl mb-6">✓</div>
      <h1 className="font-serif text-4xl mb-6">ご注文ありがとうございました</h1>
      <p className="text-ink/70 leading-loose mb-8">
        ご注文を承りました。<br />
        ご登録のメールアドレスに確認メールをお送りします。<br />
        商品の発送準備が整い次第、改めて発送通知メールをお送りいたします。
      </p>
      {sessionId && (
        <p className="text-xs text-ink/40 mb-8">注文番号: {sessionId.slice(-12)}</p>
      )}
      <Link href="/" className="btn-primary">トップに戻る</Link>
    </div>
  );
}
