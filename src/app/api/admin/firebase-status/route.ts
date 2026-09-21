import { NextResponse } from 'next/server';
import { getFirebaseAdminStatus } from '@/lib/firebase-admin';

export async function GET() {
  try {
    const status = getFirebaseAdminStatus();
    return NextResponse.json({ success: true, status });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
