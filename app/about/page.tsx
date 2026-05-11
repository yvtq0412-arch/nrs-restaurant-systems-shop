export const metadata = { title: 'About' };

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-24">
      <h1 className="font-serif text-4xl mb-12 text-center">About Us</h1>
      <div className="space-y-8 text-ink/80 leading-loose">
        <p>BURGER &amp; SHRIMP は、〇〇に店舗を構えるハンバーガー専門店です。</p>
        <p>「店舗で食べるあの一枚を、ご家庭でも」をコンセプトに、人気のビーフパティとガーリックシュリンプを冷凍便でお届けしています。</p>
        <p>ご注文から発送まで、すべて自社オペレーションで行っています。</p>
      </div>
    </div>
  );
}
