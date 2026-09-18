import { NextRequest, NextResponse } from 'next/server';
import { inMemoryMockDb, updateOrderStatusInFirestore } from '@/lib/firebase-admin';
import { Report } from '@/types/firestore';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, vendorId, vendorName, workDate, weather, beforePhotos, afterPhotos, workNotes, graveConditionNotes } = body;

    if (!orderId || !workDate || !workNotes) {
      return NextResponse.json({ error: '必須項目が不足しています。（注文ID、作業日、作業報告内容）' }, { status: 400 });
    }

    const reportId = `report_${Date.now()}`;
    const newReport: Report = {
      id: reportId,
      orderId,
      vendorId: vendorId || 'vendor_001',
      vendorName: vendorName || '提携業者',
      workDate,
      weather: weather || '晴れ',
      beforePhotos: beforePhotos || [],
      afterPhotos: afterPhotos || [],
      workNotes,
      graveConditionNotes: graveConditionNotes || '',
      status: 'submitted',
      submittedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // レポート保存
    inMemoryMockDb.reports.set(reportId, newReport);

    // 注文ステータスを 'report_submitted' に更新
    await updateOrderStatusInFirestore(orderId, {
      status: 'report_submitted',
      reportId: reportId,
    });

    return NextResponse.json({
      success: true,
      report: newReport,
      message: '作業完了レポートが提出されました。施主様へ報告完了の案内が送信されます。',
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'レポート提出処理に失敗しました。', details: error.message }, { status: 500 });
  }
}
