import { NextRequest, NextResponse } from 'next/server';
import { getOrderFromFirestore } from '@/lib/firebase-admin';
import { SAMPLE_ORDERS } from '@/mocks/sample-data';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Firestore またはメモリから検索
  let order = await getOrderFromFirestore(id);

  // なければサンプルデータから検索
  if (!order) {
    order = SAMPLE_ORDERS.find((o) => o.id === id) || null;
  }

  if (!order) {
    return NextResponse.json({ error: '指定された注文が見つかりません。' }, { status: 404 });
  }

  return NextResponse.json({ order });
}
