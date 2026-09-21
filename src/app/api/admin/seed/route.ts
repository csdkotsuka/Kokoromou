import { NextResponse } from 'next/server';
import { seedInitialDataToFirestore } from '@/lib/firebase-admin';

export async function POST(req: Request) {
  try {
    const result = await seedInitialDataToFirestore();
    return NextResponse.json({
      success: true,
      message: 'Firestoreへの初期データ投入が完了しました',
      details: result,
    });
  } catch (error: any) {
    console.error('Seed API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || '初期データの投入中にエラーが発生しました',
      },
      { status: 500 }
    );
  }
}
