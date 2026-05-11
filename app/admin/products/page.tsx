'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot, doc, setDoc, deleteDoc, addDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import type { Product } from '@/lib/types';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);

  useEffect(() => {
    return onSnapshot(collection(db, 'products'), (snap) => {
      setProducts(snap.docs.map((d) => ({ ...d.data(), id: d.id } as Product)));
    });
  }, []);

  const startNew = () => setEditing({
    id: '',
    name: '',
    description: '',
    priceJpy: 0,
    stock: 0,
    imageUrl: '',
    available: true,
    category: 'beef-patty',
    weightGrams: 0,
  });

  const save = async () => {
    if (!editing) return;
    if (!editing.name || editing.priceJpy <= 0) {
      alert('商品名と価格を入力してください');
      return;
    }
    const payload = { ...editing, updatedAt: Date.now() };
    if (editing.id) {
      const { id, ...rest } = payload;
      await updateDoc(doc(db, 'products', id), rest as any);
    } else {
      const { id, ...rest } = payload;
      await addDoc(collection(db, 'products'), { ...rest, createdAt: Date.now() });
    }
    setEditing(null);
  };

  const remove = async (id: string) => {
    if (!confirm('本当に削除しますか？')) return;
    await deleteDoc(doc(db, 'products', id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-3xl">商品管理</h1>
        <button onClick={startNew} className="btn-primary">＋ 新規追加</button>
      </div>

      <div className="grid gap-4">
        {products.map((p) => (
          <div key={p.id} className="flex gap-4 items-center border border-ink/10 p-4 bg-white">
            <img src={p.imageUrl} alt="" className="w-20 h-20 object-cover bg-ink/5" />
            <div className="flex-1">
              <div className="font-medium">{p.name}</div>
              <div className="text-sm text-ink/60">¥{p.priceJpy.toLocaleString()} ／ 在庫 {p.stock} ／ {p.available ? '販売中' : '停止'}</div>
            </div>
            <button onClick={() => setEditing(p)} className="btn-outline text-xs">編集</button>
            <button onClick={() => remove(p.id)} className="text-xs text-red-600 hover:underline">削除</button>
          </div>
        ))}
        {products.length === 0 && <p className="text-ink/50 text-center py-12">商品が登録されていません。「新規追加」から登録してください。</p>}
      </div>

      {editing && (
        <div className="fixed inset-0 bg-ink/60 flex items-center justify-center p-6 z-50">
          <div className="bg-white max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-auto">
            <h2 className="font-serif text-2xl">{editing.id ? '商品を編集' : '新規商品'}</h2>
            <div>
              <label className="label-field">商品名</label>
              <input className="input-field" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
            </div>
            <div>
              <label className="label-field">説明</label>
              <textarea className="input-field" rows={3} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-field">価格（円・税込）</label>
                <input type="number" className="input-field" value={editing.priceJpy} onChange={(e) => setEditing({ ...editing, priceJpy: Number(e.target.value) })} />
              </div>
              <div>
                <label className="label-field">在庫</label>
                <input type="number" className="input-field" value={editing.stock} onChange={(e) => setEditing({ ...editing, stock: Number(e.target.value) })} />
              </div>
            </div>
            <div>
              <label className="label-field">商品画像URL（FirebaseStorageや外部URL）</label>
              <input className="input-field" value={editing.imageUrl} onChange={(e) => setEditing({ ...editing, imageUrl: e.target.value })} />
            </div>
            <div>
              <label className="label-field">カテゴリ</label>
              <select className="input-field" value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value as Product['category'] })}>
                <option value="beef-patty">ビーフパティ</option>
                <option value="garlic-shrimp">ガーリックシュリンプ</option>
                <option value="other">その他</option>
              </select>
            </div>
            <div>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={editing.available} onChange={(e) => setEditing({ ...editing, available: e.target.checked })} />
                <span>販売中</span>
              </label>
            </div>
            <div className="flex gap-3 pt-4">
              <button onClick={save} className="btn-primary flex-1">保存</button>
              <button onClick={() => setEditing(null)} className="btn-outline flex-1">キャンセル</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
