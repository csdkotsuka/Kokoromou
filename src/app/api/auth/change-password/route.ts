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

    const safeUser = {
      id: `acc_${email}`,
      email,
      role: email === 'kotsuka@creativesd.net' ? 'admin' : 'cemetery',
      name: email === 'kotsuka@creativesd.net' ? 'Creative System Design（本部統括）' : '管理者',
    };

    const res = NextResponse.json({
      success: true,
      message: 'パスワードを正常に更新しました',
      user: safeUser,
    });

    // 変更と同時に有効なセッションCookieを発行
    res.cookies.set('kokoromou_auth', JSON.stringify(safeUser), {
      httpOnly: false,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax',
    });

    return res;
  } catch (error: any) {
    console.error('Password update error:', error);
    return NextResponse.json(
      { error: error.message || 'パスワードの更新に失敗しました' },
      { status: 500 }
    );
  }
}
