import Link from 'next/link';

export default function CancelPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-24 text-center">
      <h1 className="font-serif text-4xl mb-6">お支払いがキャンセルされました</h1>
      <p className="text-ink/70 mb-8">カートの内容は保存されています。</p>
      <Link href="/cart" className="btn-primary">カートに戻る</Link>
    </div>
  );
}
