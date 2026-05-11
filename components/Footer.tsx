import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-ink/10 mt-32">
      <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col sm:flex-row justify-between gap-6 text-sm">
        <div>
          <div className="font-serif text-lg tracking-widest mb-2">BURGER &amp; SHRIMP</div>
          <p className="text-ink/60 text-xs">© {new Date().getFullYear()} BURGER &amp; SHRIMP. All rights reserved.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-xs uppercase tracking-widest">
          <Link href="/legal/tokushoho" className="hover:opacity-60">特定商取引法</Link>
          <Link href="/legal/privacy" className="hover:opacity-60">プライバシーポリシー</Link>
          <Link href="/legal/terms" className="hover:opacity-60">利用規約</Link>
          <Link href="/contact" className="hover:opacity-60">お問い合わせ</Link>
        </div>
      </div>
    </footer>
  );
}
