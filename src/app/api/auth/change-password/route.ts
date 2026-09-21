import { NextResponse } from 'next/server';
import { updateAccountPassword } from '@/lib/firebase-admin';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, newPassword } = body;

    if (!email || !newPassword || newPassword.length < 4) {
      return NextResponse.json(
        { error: 'メールアドレスと有効な新しいパスワード（4文字以上）を入力してください' },
        { status: 400 }
      );
    }

    await updateAccountPassword(email, newPassword);

    return NextResponse.json({
      success: true,
      message: 'パスワードを正常に更新しました',
    });
  } catch (error: any) {
    console.error('Password update error:', error);
    return NextResponse.json(
      { error: error.message || 'パスワードの更新に失敗しました' },
      { status: 500 }
    );
  }
}
