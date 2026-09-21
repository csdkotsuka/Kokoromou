import { NextResponse } from 'next/server';
import { authenticateAccount, updateAccountPassword } from '@/lib/firebase-admin';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, clientStoredPassword } = body;

    if (!email) {
      return NextResponse.json({ error: 'メールアドレスを入力してください' }, { status: 400 });
    }

    // クライアント側で保存された新パスワードがあり、現在の入力と一致する場合は即時サーバー同期
    if (clientStoredPassword && password && clientStoredPassword === password) {
      await updateAccountPassword(email, password);
    }

    let account = await authenticateAccount(email, password);

    // 認証失敗時でも、clientStoredPassword と入力が一致していればリカバリー同期
    if (!account && clientStoredPassword && password && clientStoredPassword === password) {
      await updateAccountPassword(email, password);
      account = await authenticateAccount(email, password);
    }

    if (!account) {
      return NextResponse.json(
        { error: 'メールアドレスまたはパスワードが正しくありません' },
        { status: 401 }
      );
    }

    // パスワードを除外して返却
    const { password: _, ...safeUser } = account;

    const res = NextResponse.json({
      success: true,
      user: safeUser,
    });

    // 簡易セッションCookieの発行
    res.cookies.set('kokoromou_auth', JSON.stringify(safeUser), {
      httpOnly: false, // クライアント側でも読み取り可能にする
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7日間有効
      sameSite: 'lax',
    });

    return res;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ error: error.message || 'ログイン処理に失敗しました' }, { status: 500 });
  }
}
