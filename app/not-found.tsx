import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-24 text-center">
      <h1 className="font-serif text-6xl mb-6">404</h1>
      <p className="text-ink/60 mb-8">お探しのページは見つかりませんでした。</p>
      <Link href="/" className="btn-primary">トップに戻る</Link>
    </div>
  );
}
