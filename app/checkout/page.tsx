'use client';

import { useCart } from '@/lib/cart-store';
import { calcShippingFee, PREFECTURES, FREE_SHIPPING_THRESHOLD } from '@/lib/shipping';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCart((s) => s.items);
  const subtotal = useCart((s) => s.subtotal());
  const [mounted, setMounted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    lastName: '', firstName: '',
    lastNameKana: '', firstNameKana: '',
    postalCode: '', prefecture: '東京都',
    city: '', address1: '', address2: '',
    phone: '', email: '',
    deliveryDate: '', deliveryTimeSlot: '指定なし',
    note: '',
  });

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (mounted && items.length === 0) router.replace('/cart');
  }, [mounted, items.length, router]);

  if (!mounted) return <div className="max-w-3xl mx-auto px-6 py-16" />;

  const shippingFee = calcShippingFee(form.prefecture, subtotal);
  const total = subtotal + shippingFee;

  const handleChange = (k: keyof typeof form, v: string) => setForm({ ...form, [k]: v });

  const validate = () => {
    const req: (keyof typeof form)[] = ['lastName','firstName','lastNameKana','firstNameKana','postalCode','prefecture','city','address1','phone','email'];
    for (const k of req) if (!form[k]) return `${k} は必須です`;
    if (!/^\d{3}-?\d{4}$/.test(form.postalCode)) return '郵便番号は 100-0001 の形式で入力してください';
    if (!/^[\d-]{10,}$/.test(form.phone)) return '電話番号の形式が正しくありません';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) return 'メールアドレスの形式が正しくありません';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, shipping: form, shippingFeeJpy: shippingFee }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? '決済の準備に失敗しました');
      window.location.href = data.url;
    } catch (e: any) {
      setError(e.message);
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-12">
      <div className="md:col-span-2 space-y-8">
        <h1 className="font-serif text-3xl">お届け先情報</h1>

        <div className="grid grid-cols-2 gap-4">
          <div><label className="label-field">姓 *</label><input className="input-field" value={form.lastName} onChange={(e) => handleChange('lastName', e.target.value)} /></div>
          <div><label className="label-field">名 *</label><input className="input-field" value={form.firstName} onChange={(e) => handleChange('firstName', e.target.value)} /></div>
          <div><label className="label-field">セイ *</label><input className="input-field" value={form.lastNameKana} onChange={(e) => handleChange('lastNameKana', e.target.value)} placeholder="ヤマダ" /></div>
          <div><label className="label-field">メイ *</label><input className="input-field" value={form.firstNameKana} onChange={(e) => handleChange('firstNameKana', e.target.value)} placeholder="タロウ" /></div>
        </div>

        <div>
          <label className="label-field">郵便番号 *</label>
          <input className="input-field max-w-xs" value={form.postalCode} onChange={(e) => handleChange('postalCode', e.target.value)} placeholder="100-0001" />
        </div>

        <div>
          <label className="label-field">都道府県 *</label>
          <select className="input-field max-w-xs" value={form.prefecture} onChange={(e) => handleChange('prefecture', e.target.value)}>
            {PREFECTURES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        <div><label className="label-field">市区町村 *</label><input className="input-field" value={form.city} onChange={(e) => handleChange('city', e.target.value)} placeholder="千代田区" /></div>
        <div><label className="label-field">番地 *</label><input className="input-field" value={form.address1} onChange={(e) => handleChange('address1', e.target.value)} placeholder="1-2-3" /></div>
        <div><label className="label-field">建物名・部屋番号</label><input className="input-field" value={form.address2} onChange={(e) => handleChange('address2', e.target.value)} /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="label-field">電話番号 *</label><input className="input-field" value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} placeholder="03-1234-5678" /></div>
          <div><label className="label-field">メールアドレス *</label><input className="input-field" value={form.email} onChange={(e) => handleChange('email', e.target.value)} type="email" /></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label-field">配送希望日</label>
            <input type="date" className="input-field" value={form.deliveryDate} onChange={(e) => handleChange('deliveryDate', e.target.value)} />
          </div>
          <div>
            <label className="label-field">配送希望時間帯</label>
            <select className="input-field" value={form.deliveryTimeSlot} onChange={(e) => handleChange('deliveryTimeSlot', e.target.value)}>
              <option>指定なし</option>
              <option>午前中</option>
              <option>14-16時</option>
              <option>16-18時</option>
              <option>18-20時</option>
              <option>19-21時</option>
            </select>
          </div>
        </div>

        <div>
          <label className="label-field">備考</label>
          <textarea className="input-field" rows={3} value={form.note} onChange={(e) => handleChange('note', e.target.value)} />
        </div>
      </div>

      {/* SUMMARY */}
      <aside className="md:sticky md:top-24 self-start border border-ink/10 p-6 bg-white space-y-4">
        <h2 className="font-serif text-xl mb-4">ご注文内容</h2>
        {items.map((i) => (
          <div key={i.productId} className="flex justify-between text-sm">
            <span>{i.name} × {i.quantity}</span>
            <span>¥{(i.priceJpy * i.quantity).toLocaleString()}</span>
          </div>
        ))}
        <div className="border-t border-ink/10 pt-4 space-y-2 text-sm">
          <div className="flex justify-between"><span>小計</span><span>¥{subtotal.toLocaleString()}</span></div>
          <div className="flex justify-between">
            <span>送料（{form.prefecture}）</span>
            <span>{shippingFee === 0 ? '無料' : `¥${shippingFee.toLocaleString()}`}</span>
          </div>
          {subtotal < FREE_SHIPPING_THRESHOLD && (
            <p className="text-xs text-ink/50">あと ¥{(FREE_SHIPPING_THRESHOLD - subtotal).toLocaleString()} で送料無料</p>
          )}
        </div>
        <div className="border-t border-ink/10 pt-4 flex justify-between text-lg">
          <span>合計</span>
          <span className="tracking-widest">¥{total.toLocaleString()}</span>
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? '処理中...' : 'クレジットカードで支払う'}
        </button>
        <p className="text-xs text-ink/50 text-center">決済はStripeで安全に処理されます</p>
      </aside>
    </form>
  );
}
