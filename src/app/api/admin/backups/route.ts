import { NextRequest, NextResponse } from 'next/server';
import { createFullPlatformBackup, getBackupHistory } from '@/lib/firebase-admin';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const isDownload = searchParams.get('download') === 'true';

    // 最新スナップショットの取得・生成
    const snapshot = await createFullPlatformBackup();
    const history = await getBackupHistory();

    if (isDownload) {
      const filename = `kokoromou_${snapshot.backupId}.json`;
      return new NextResponse(JSON.stringify(snapshot, null, 2), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="${filename}"`,
        },
      });
    }

    return NextResponse.json({
      success: true,
      currentSnapshot: snapshot,
      history,
    });
  } catch (error: any) {
    console.error('Backup API Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'バックアップデータの取得に失敗しました' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const snapshot = await createFullPlatformBackup();
    return NextResponse.json({
      success: true,
      message: 'バックアップスナップショットが正常に作成されました',
      snapshot,
    });
  } catch (error: any) {
    console.error('Backup Creation Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'バックアップの生成に失敗しました' },
      { status: 500 }
    );
  }
}
