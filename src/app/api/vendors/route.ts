import { NextResponse } from 'next/server';
import { getVendors, saveVendor } from '@/lib/firebase-admin';
import { User } from '@/types/firestore';

export async function GET() {
  try {
    const vendors = await getVendors();
    return NextResponse.json({ success: true, vendors });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const vendor: User = await req.json();
    if (!vendor.id || !vendor.displayName) {
      return NextResponse.json({ success: false, error: '無効なデータです' }, { status: 400 });
    }
    const saved = await saveVendor(vendor);
    return NextResponse.json({ success: true, vendor: saved });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
