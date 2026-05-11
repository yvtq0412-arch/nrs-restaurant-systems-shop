export const metadata = { title: '特定商取引法に基づく表記' };

export default function TokushohoPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="font-serif text-3xl mb-12">特定商取引法に基づく表記</h1>
      <dl className="space-y-6 text-sm">
        <Row label="販売事業者" value="〇〇株式会社 ／ 屋号: BURGER & SHRIMP" />
        <Row label="運営統括責任者" value="（代表者氏名を記入）" />
        <Row label="所在地" value="〒〇〇〇-〇〇〇〇 〇〇県〇〇市〇〇 1-2-3" />
        <Row label="電話番号" value="〇〇-〇〇〇〇-〇〇〇〇（受付時間：11:00〜18:00）" />
        <Row label="メールアドレス" value="info@example.com" />
        <Row label="販売価格" value="各商品ページに記載の価格（税込）" />
        <Row label="商品代金以外の必要料金" value="送料（地域別。チェックアウト画面で表示）、決済手数料はかかりません" />
        <Row label="お支払い方法" value="クレジットカード決済（Visa / Mastercard / JCB / American Express）" />
        <Row label="支払い時期" value="ご注文時に決済が確定します" />
        <Row label="商品の引渡し時期" value="ご注文確定後、3〜5営業日以内に発送いたします" />
        <Row label="返品・交換について" value="食品の性質上、お客様都合による返品・交換はお受けできません。商品到着時に破損・品違い等があった場合は、商品到着後3日以内にご連絡ください。代替品の発送または返金にて対応いたします。" />
      </dl>
      <p className="text-xs text-ink/40 mt-12">※本ページの記載事項は実際の事業情報に書き換えてください。</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 border-b border-ink/10 pb-4">
      <dt className="font-medium tracking-wider text-ink/70">{label}</dt>
      <dd className="sm:col-span-2 leading-relaxed">{value}</dd>
    </div>
  );
}
