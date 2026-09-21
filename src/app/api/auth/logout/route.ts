import { NextResponse } from 'next/server';

export async function POST() {
  const res = NextResponse.json({ success: true, message: 'ログアウトしました' });
  res.cookies.delete('kokoromou_auth');
  return res;
}
