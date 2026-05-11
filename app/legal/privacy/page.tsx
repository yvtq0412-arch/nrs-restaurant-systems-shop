export const metadata = { title: 'プライバシーポリシー' };

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 prose">
      <h1 className="font-serif text-3xl mb-8">プライバシーポリシー</h1>
      <div className="space-y-6 text-sm leading-loose text-ink/80">
        <p>BURGER &amp; SHRIMP（以下「当店」）は、お客様の個人情報の保護を重要な責務と認識し、以下の方針に基づき適切に取り扱います。</p>

        <h2 className="font-serif text-xl mt-8">1. 取得する情報</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>氏名、フリガナ、郵便番号、住所、電話番号、メールアドレス</li>
          <li>購入履歴、配送状況に関する情報</li>
          <li>サイトの利用状況（アクセスログ、Cookie等）</li>
        </ul>

        <h2 className="font-serif text-xl mt-8">2. 利用目的</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>商品の発送および代金決済</li>
          <li>注文・配送・お問い合わせへの対応</li>
          <li>サービス改善およびご案内</li>
        </ul>

        <h2 className="font-serif text-xl mt-8">3. 第三者提供</h2>
        <p>商品配送のためヤマト運輸株式会社へお客様のお届け先情報を提供します。決済処理のためStripe, Inc.へ必要な情報を提供します。これら以外の第三者へは、法令に基づく場合を除き提供しません。</p>

        <h2 className="font-serif text-xl mt-8">4. お問い合わせ</h2>
        <p>個人情報の開示・訂正・削除のご要望は、お問い合わせフォームよりご連絡ください。</p>

        <p className="text-xs text-ink/40 mt-12">制定日：2025年〇月〇日</p>
      </div>
    </div>
  );
}
