import Link from 'next/link';
import { adminDb } from '@/lib/firebase/admin';
import type { Product } from '@/lib/types';

export const revalidate = 60; // 1分ごとに最新の商品を取得

async function getProducts(): Promise<Product[]> {
  try {
    const snap = await adminDb().collection('products').where('available', '==', true).get();
    return snap.docs.map((d) => ({ ...d.data(), id: d.id } as Product));
  } catch (e) {
    // Firebase 未設定時はサンプルを返す（最初のデプロイで真っ白にならないように）
    return [
      {
        id: 'sample-beef',
        name: 'ビーフパティ 4枚セット',
        description: '店舗で人気の自家製ビーフパティを、その日の朝に成形し急速冷凍。',
        priceJpy: 3200,
        stock: 30,
        imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1200',
        available: true,
        category: 'beef-patty',
      },
      {
        id: 'sample-shrimp',
        name: 'ガーリックシュリンプ 200g',
        description: '殻付きのまま香ばしく仕上げた、店舗看板メニュー。',
        priceJpy: 2400,
        stock: 30,
        imageUrl: 'https://images.unsplash.com/photo-1625943553852-781c6dd46faa?w=1200',
        available: true,
        category: 'garlic-shrimp',
      },
    ];
  }
}

export default async function HomePage() {
  const products = await getProducts();

  return (
    <div>
      {/* HERO */}
      <section className="relative h-[70vh] flex items-center justify-center text-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=2000)' }}
        />
        <div className="absolute inset-0 bg-ink/50" />
        <div className="relative text-bone px-6">
          <h1 className="font-serif text-5xl sm:text-7xl mb-6 tracking-wide">
            From our kitchen<br />to your table.
          </h1>
          <p className="text-sm sm:text-base tracking-widest uppercase opacity-80">
            Beef Patty & Garlic Shrimp — Frozen, Delivered.
          </p>
          <Link href="#shop" className="inline-block mt-10 px-8 py-3 bg-bone text-ink text-sm uppercase tracking-widest hover:opacity-80 transition">
            Shop Now
          </Link>
        </div>
      </section>

      {/* PRODUCTS */}
      <section id="shop" className="max-w-6xl mx-auto px-6 py-24">
        <h2 className="font-serif text-3xl sm:text-4xl text-center mb-2 tracking-wide">Our Products</h2>
        <p className="text-center text-ink/60 text-sm tracking-widest uppercase mb-16">Made in our kitchen</p>

        <div className="grid sm:grid-cols-2 gap-12">
          {products.map((p) => (
            <Link key={p.id} href={`/products/${p.id}`} className="group">
              <div className="aspect-[4/5] overflow-hidden bg-ink/5 mb-4">
                <img
                  src={p.imageUrl}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <h3 className="font-serif text-2xl">{p.name}</h3>
              <p className="text-ink/60 text-sm mt-2">{p.description}</p>
              <p className="mt-4 tracking-widest">¥{p.priceJpy.toLocaleString()}（税込）</p>
            </Link>
          ))}
        </div>
      </section>

      {/* STORY */}
      <section className="bg-ink text-bone py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-serif text-3xl sm:text-4xl mb-8 tracking-wide">Our Story</h2>
          <p className="text-bone/80 leading-loose">
            店舗で焼き上げる一枚一枚を、ご家庭でも。<br />
            私たちはハンバーガーが大好きで、毎日キッチンに立ってきました。<br />
            その同じ手仕事を、急速冷凍と最短便で全国へお届けします。
          </p>
        </div>
      </section>
    </div>
  );
}
