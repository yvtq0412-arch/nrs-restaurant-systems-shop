export const metadata = { title: 'Contact' };

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-24">
      <h1 className="font-serif text-4xl mb-12 text-center">Contact</h1>
      <div className="space-y-6 text-ink/80 text-center">
        <p>商品・配送に関するお問い合わせは下記までご連絡ください。</p>
        <div className="border border-ink/10 p-8 space-y-3 text-left">
          <p><span className="text-xs uppercase tracking-widest text-ink/50 block mb-1">メール</span>info@example.com</p>
          <p><span className="text-xs uppercase tracking-widest text-ink/50 block mb-1">電話</span>〇〇-〇〇〇〇-〇〇〇〇</p>
          <p><span className="text-xs uppercase tracking-widest text-ink/50 block mb-1">受付時間</span>11:00 〜 18:00（不定休）</p>
        </div>
      </div>
    </div>
  );
}
