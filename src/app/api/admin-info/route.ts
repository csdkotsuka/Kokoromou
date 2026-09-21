import { NextResponse } from 'next/server';
import { getPlatformAdminInfo, savePlatformAdminInfo } from '@/lib/firebase-admin';

export async function GET() {
  try {
    const info = await getPlatformAdminInfo();
    return NextResponse.json({ success: true, adminInfo: info });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const updated = await savePlatformAdminInfo(body);
    return NextResponse.json({ success: true, adminInfo: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
