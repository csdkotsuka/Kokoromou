import { NextResponse } from 'next/server';
import { getAllOrders, updateOrderStatusInFirestore, saveOrderToFirestore } from '@/lib/firebase-admin';
import { Order } from '@/types/firestore';

export async function GET() {
  try {
    const orders = await getAllOrders();
    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { orderId, status, vendorId, vendorName, scheduledDate, notes } = body;

    if (!orderId) {
      return NextResponse.json({ success: false, error: '注文IDが必要です' }, { status: 400 });
    }

    const updates: Record<string, any> = {};
    if (status) updates.status = status;
    if (vendorId) updates.vendorId = vendorId;
    if (vendorName) updates.vendorName = vendorName;
    if (scheduledDate) updates.scheduledDate = scheduledDate;
    if (notes !== undefined) updates.specialRequests = notes;

    await updateOrderStatusInFirestore(orderId, updates);
    return NextResponse.json({ success: true, message: '注文情報を更新しました', updates });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
