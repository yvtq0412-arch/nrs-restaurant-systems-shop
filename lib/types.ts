// アプリ全体で使う型定義

export type Product = {
  id: string;
  name: string;             // 例: "ビーフパティ 4枚セット"
  description: string;
  priceJpy: number;         // 税込価格
  stock: number;            // 在庫数
  imageUrl: string;
  available: boolean;       // 販売中か
  weightGrams?: number;     // 重さ（送り状に必要）
  category?: 'beef-patty' | 'garlic-shrimp' | 'other';
  createdAt?: number;
  updatedAt?: number;
};

export type CartItem = {
  productId: string;
  name: string;
  priceJpy: number;
  imageUrl: string;
  quantity: number;
};

export type ShippingAddress = {
  lastName: string;
  firstName: string;
  lastNameKana: string;
  firstNameKana: string;
  postalCode: string;       // 例: "100-0001"
  prefecture: string;       // 例: "東京都"
  city: string;             // 市区町村
  address1: string;         // 番地
  address2?: string;        // 建物名・部屋番号
  phone: string;
  email: string;
};

export type Order = {
  id: string;
  stripeSessionId: string;
  stripePaymentIntentId?: string;
  status: 'pending' | 'paid' | 'shipping_prepared' | 'shipped' | 'cancelled' | 'refunded';
  items: CartItem[];
  shipping: ShippingAddress;
  subtotalJpy: number;
  shippingFeeJpy: number;
  totalJpy: number;
  trackingNumber?: string;
  deliveryDate?: string;            // 配送希望日（YYYY-MM-DD）
  deliveryTimeSlot?: string;        // 配送希望時間帯
  note?: string;                    // お客様からの備考
  createdAt: number;
  updatedAt: number;
};
