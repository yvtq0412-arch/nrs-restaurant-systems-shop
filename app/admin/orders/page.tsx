'use client';

import { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase/client';
import type { Order } from '@/lib/types';

const STATUS_LABELS: Record<Order['status'], string> = {
  pending: '決済待ち',
  paid: '入金済み',
  shipping_prepared: '発送準備中',
  shipped: '発送済み',
  cancelled: 'キャンセル',
  refunded: '返金済み',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<(Order & { id: string })[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [filter, setFilter] = useState<Order['status'] | 'all'>('all');

  useEffect(() => {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snap) => {
      setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() } as any)));
    });
  }, []);

  const filtered = orders.filter((o) => filter === 'all' || o.status === filter);

  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const toggleAll = () =>
    setSelected(selected.length === filtered.length ? [] : filtered.map((o) => o.id));

  const downloadCsv = async () => {
    if (selected.length === 0) {
      alert('CSVに含める注文を選択してください');
      return;
    }
    const token = await auth.currentUser?.getIdToken();
    const res = await fetch('/api/admin/yamato-csv', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ orderIds: selected }),
    });
    if (!res.ok) {
      alert('CSV生成に失敗しました');
      return;
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const today = new Date().toISOString().slice(0, 10);
    a.download = `yamato-b2-${today}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const updateStatus = async (id: string, status: Order['status']) => {
    await updateDoc(doc(db, 'orders', id), { status, updatedAt: Date.now() });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-3xl">注文管理</h1>
        <button onClick={downloadCsv} className="btn-primary">
          ヤマトB2用CSVダウンロード（{selected.length}件）
        </button>
      </div>

      <div className="flex gap-2 mb-4 text-sm">
        {(['all', 'pending', 'paid', 'shipping_prepared', 'shipped', 'cancelled'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1 border ${filter === s ? 'bg-ink text-bone border-ink' : 'border-ink/20'}`}
          >
            {s === 'all' ? 'すべて' : STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto border border-ink/10">
        <table className="w-full text-sm">
          <thead className="bg-ink/5">
            <tr>
              <th className="p-3 text-left">
                <input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleAll} />
              </th>
              <th className="p-3 text-left">注文日時</th>
              <th className="p-3 text-left">お客様</th>
              <th className="p-3 text-left">商品</th>
              <th className="p-3 text-right">金額</th>
              <th className="p-3 text-left">ステータス</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.id} className="border-t border-ink/10">
                <td className="p-3">
                  <input type="checkbox" checked={selected.includes(o.id)} onChange={() => toggle(o.id)} />
                </td>
                <td className="p-3 text-xs">{new Date(o.createdAt).toLocaleString('ja-JP')}</td>
                <td className="p-3">
                  <div>{o.shipping.lastName} {o.shipping.firstName}</div>
                  <div className="text-xs text-ink/50">{o.shipping.prefecture}{o.shipping.city}</div>
                </td>
                <td className="p-3 text-xs">
                  {o.items.map((i) => <div key={i.productId}>{i.name} ×{i.quantity}</div>)}
                </td>
                <td className="p-3 text-right">¥{o.totalJpy.toLocaleString()}</td>
                <td className="p-3">
                  <select
                    value={o.status}
                    onChange={(e) => updateStatus(o.id, e.target.value as Order['status'])}
                    className="border border-ink/20 px-2 py-1 text-xs bg-white"
                  >
                    {Object.entries(STATUS_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="p-12 text-center text-ink/50">該当する注文がありません</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
