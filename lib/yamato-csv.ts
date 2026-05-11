// ヤマトB2クラウド用CSV生成
// 参考: B2クラウド「送り状データ取込」テンプレート（発払・クール宅急便）
// ※実際のテンプレートはB2クラウドからダウンロードできるサンプルCSVに合わせて
// 列順を調整してください。ここでは一般的に使われる列を実装しています。

import type { Order } from './types';

const COLUMNS = [
  'お客様管理番号',
  '送り状種類',           // 0:発払 / 2:コレクト / 3:クロネコゆうメール / 5:タイム / 6:着払 / 7:e1
  'クール区分',           // 0:通常 / 1:冷蔵 / 2:冷凍
  '伝票番号',
  '出荷予定日',
  'お届け予定日',
  '配達時間帯',           // 0812 / 1214 / 1416 / 1618 / 1820 / 1921
  'お届け先コード',
  'お届け先電話番号',
  'お届け先電話番号枝番',
  'お届け先郵便番号',
  'お届け先住所',
  'お届け先アパートマンション名',
  'お届け先会社・部門名1',
  'お届け先会社・部門名2',
  'お届け先名',
  'お届け先名(カナ)',
  '敬称',
  'ご依頼主コード',
  'ご依頼主電話番号',
  'ご依頼主電話番号枝番',
  'ご依頼主郵便番号',
  'ご依頼主住所',
  'ご依頼主アパートマンション',
  'ご依頼主名',
  'ご依頼主名(カナ)',
  '品名コード1',
  '品名1',
  '品名コード2',
  '品名2',
  '荷扱い1',
  '荷扱い2',
  '記事',
  'コレクト代金引換額（税込)',
  '内消費税額等',
  '止置き',
  '営業所コード',
  '発行枚数',
  '個数口表示フラグ',
  '請求先顧客コード',
  '請求先分類コード',
  '運賃管理番号',
];

// ===== 出荷元（お店）情報。実際の店舗情報に書き換えてください =====
const SENDER = {
  name: 'BURGER & SHRIMP',
  nameKana: 'バーガーアンドシュリンプ',
  phone: '00-0000-0000',
  postalCode: '0000000',
  address: '東京都千代田区〇〇1-2-3',
  building: '',
};
// =================================================================

function timeSlotCode(slot?: string): string {
  switch (slot) {
    case '午前中': return '0812';
    case '14-16時': return '1416';
    case '16-18時': return '1618';
    case '18-20時': return '1820';
    case '19-21時': return '1921';
    default: return '';
  }
}

function fmtPostal(p: string): string {
  return (p ?? '').replace(/-/g, '');
}

function fmtDate(d?: string): string {
  if (!d) return '';
  // YYYY-MM-DD → YYYY/MM/DD
  return d.replace(/-/g, '/');
}

function csvEscape(v: string | number | undefined): string {
  const s = String(v ?? '');
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export function buildYamatoCsv(orders: (Order & { id: string })[]): string {
  const rows: string[] = [];
  rows.push(COLUMNS.join(','));

  const today = new Date();
  const yyyymmdd = `${today.getFullYear()}/${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}`;

  for (const o of orders) {
    const productSummary = o.items.map((i) => `${i.name}×${i.quantity}`).join(' ');
    const productName1 = productSummary.slice(0, 25);
    const productName2 = productSummary.slice(25, 50);

    const row = {
      'お客様管理番号': o.id.slice(0, 20),
      '送り状種類': '0', // 発払
      'クール区分': '2', // 冷凍
      '伝票番号': '',
      '出荷予定日': yyyymmdd,
      'お届け予定日': fmtDate(o.deliveryDate),
      '配達時間帯': timeSlotCode(o.deliveryTimeSlot),
      'お届け先コード': '',
      'お届け先電話番号': o.shipping.phone,
      'お届け先電話番号枝番': '',
      'お届け先郵便番号': fmtPostal(o.shipping.postalCode),
      'お届け先住所': `${o.shipping.prefecture}${o.shipping.city}${o.shipping.address1}`,
      'お届け先アパートマンション名': o.shipping.address2 ?? '',
      'お届け先会社・部門名1': '',
      'お届け先会社・部門名2': '',
      'お届け先名': `${o.shipping.lastName} ${o.shipping.firstName}`,
      'お届け先名(カナ)': `${o.shipping.lastNameKana} ${o.shipping.firstNameKana}`,
      '敬称': '様',
      'ご依頼主コード': '',
      'ご依頼主電話番号': SENDER.phone,
      'ご依頼主電話番号枝番': '',
      'ご依頼主郵便番号': SENDER.postalCode,
      'ご依頼主住所': SENDER.address,
      'ご依頼主アパートマンション': SENDER.building,
      'ご依頼主名': SENDER.name,
      'ご依頼主名(カナ)': SENDER.nameKana,
      '品名コード1': '',
      '品名1': productName1,
      '品名コード2': '',
      '品名2': productName2,
      '荷扱い1': '冷凍食品',
      '荷扱い2': '',
      '記事': (o.note ?? '').slice(0, 40),
      'コレクト代金引換額（税込)': '',
      '内消費税額等': '',
      '止置き': '0',
      '営業所コード': '',
      '発行枚数': '1',
      '個数口表示フラグ': '1',
      '請求先顧客コード': '',
      '請求先分類コード': '',
      '運賃管理番号': '',
    } as Record<string, string | number>;

    rows.push(COLUMNS.map((c) => csvEscape(row[c])).join(','));
  }

  return rows.join('\r\n');
}
