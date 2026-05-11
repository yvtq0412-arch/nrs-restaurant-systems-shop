export const metadata = { title: '利用規約' };

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="font-serif text-3xl mb-8">利用規約</h1>
      <div className="space-y-6 text-sm leading-loose text-ink/80">
        <p>本利用規約（以下「本規約」）は、BURGER &amp; SHRIMP（以下「当店」）が運営するオンラインショップ（以下「本サイト」）の利用条件を定めるものです。</p>

        <h2 className="font-serif text-xl mt-8">第1条（適用）</h2>
        <p>本規約は、お客様と当店との間の本サイトの利用に関わる一切の関係に適用されます。</p>

        <h2 className="font-serif text-xl mt-8">第2条（注文の成立）</h2>
        <p>お客様が決済を完了し、当店より注文確認メールを送信した時点で売買契約が成立します。</p>

        <h2 className="font-serif text-xl mt-8">第3条（禁止事項）</h2>
        <p>転売目的での購入、当店または第三者に不利益を与える行為を禁止します。</p>

        <h2 className="font-serif text-xl mt-8">第4条（免責事項）</h2>
        <p>天災その他不可抗力により配送が遅延した場合、当店は責任を負いません。</p>

        <p className="text-xs text-ink/40 mt-12">制定日：2025年〇月〇日</p>
      </div>
    </div>
  );
}
