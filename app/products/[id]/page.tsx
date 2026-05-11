import { adminDb } from '@/lib/firebase/admin';
import type { Product } from '@/lib/types';
import { notFound } from 'next/navigation';
import AddToCartButton from '@/components/AddToCartButton';

export const revalidate = 60;

async function getProduct(id: string): Promise<Product | null> {
  // サンプル対応
  const samples: Record<string, Product> = {
    'sample-beef': {
      id: 'sample-beef',
      name: 'ビーフパティ 4枚セット',
      description:
        '店舗で人気の自家製ビーフパティを、その日の朝に成形し急速冷凍。1枚あたり約150g、しっかりとした粗挽きの肉感が特徴です。',
      priceJpy: 3200,
      stock: 30,
      imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1600',
      available: true,
      category: 'beef-patty',
      weightGrams: 600,
    },
    'sample-shrimp': {
      id: 'sample-shrimp',
      name: 'ガーリックシュリンプ 200g',
      description:
        '殻付きのまま香ばしく仕上げた、店舗看板メニュー。ご家庭ではフライパンで温め直すだけ。バゲットやサラダと相性抜群。',
      priceJpy: 2400,
      stock: 30,
      imageUrl: 'https://images.unsplash.com/photo-1625943553852-781c6dd46faa?w=1600',
      available: true,
      category: 'garlic-shrimp',
      weightGrams: 200,
    },
  };

  try {
    const doc = await adminDb().collection('products').doc(id).get();
    if (doc.exists) return { id: doc.id, ...doc.data() } as Product;
  } catch {}

  return samples[id] ?? null;
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  if (!product) notFound();

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="grid md:grid-cols-2 gap-12">
        <div className="aspect-square bg-ink/5 overflow-hidden">
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
        </div>
        <div>
          <h1 className="font-serif text-4xl mb-4">{product.name}</h1>
          <p className="tracking-widest text-xl mb-8">¥{product.priceJpy.toLocaleString()}（税込）</p>
          <p className="text-ink/70 leading-loose mb-8 whitespace-pre-wrap">{product.description}</p>

          <div className="border-t border-ink/10 pt-6 mb-8 text-sm space-y-2 text-ink/70">
            <p>・配送方法: クール宅急便（冷凍）</p>
            <p>・賞味期限: 冷凍で約30日</p>
            <p>・お届け目安: ご注文から3〜5営業日</p>
            {product.weightGrams && <p>・内容量: {product.weightGrams}g</p>}
          </div>

          {product.stock > 0 ? (
            <AddToCartButton product={product} />
          ) : (
            <button disabled className="btn-primary w-full">SOLD OUT</button>
          )}
        </div>
      </div>
    </div>
  );
}
