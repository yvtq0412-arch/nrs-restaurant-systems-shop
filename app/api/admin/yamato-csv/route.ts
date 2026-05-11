import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { buildYamatoCsv } from '@/lib/yamato-csv';
import type { Order } from '@/lib/types';

export const runtime = 'nodejs';

async function verifyAdmin(req: NextRequest): Promise<boolean> {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return false;
  const token = authHeader.slice(7);

  try {
    const decoded = await adminAuth().verifyIdToken(token);
    const adminEmails = (process.env.ADMIN_EMAILS ?? '').split(',').map((s) => s.trim()).filter(Boolean);
    if (adminEmails.length === 0) return true; // ADMIN_EMAILS未設定なら誰でも可（最初の運用のため）
    return adminEmails.includes(decoded.email ?? '');
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  if (!(await verifyAdmin(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { orderIds } = await req.json();
  if (!Array.isArray(orderIds) || orderIds.length === 0) {
    return NextResponse.json({ error: 'orderIds is required' }, { status: 400 });
  }

  const orders: (Order & { id: string })[] = [];
  for (const id of orderIds) {
    const doc = await adminDb().collection('orders').doc(id).get();
    if (doc.exists) orders.push({ id: doc.id, ...(doc.data() as Order) });
  }

  if (orders.length === 0) {
    return NextResponse.json({ error: 'no orders found' }, { status: 404 });
  }

  // 発送準備中ステータスに更新
  await Promise.all(
    orders.map((o) =>
      adminDb().collection('orders').doc(o.id).update({
        status: 'shipping_prepared',
        updatedAt: Date.now(),
      })
    )
  );

  const csv = buildYamatoCsv(orders);

  // ヤマトB2クラウドはShift_JIS推奨。UTF-8 BOM付きでも開けるが、念のためBOMを付与。
  const bom = '\uFEFF';
  return new NextResponse(bom + csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="yamato-b2.csv"`,
    },
  });
}
