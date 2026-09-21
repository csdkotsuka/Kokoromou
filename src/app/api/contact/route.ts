import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, name, companyName, email, phone, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'お名前、メールアドレス、お問い合わせ内容は必須項目です。' },
        { status: 400 }
      );
    }

    const inquiryData = {
      id: `inq_${Date.now()}`,
      type: type || 'general',
      name,
      companyName: companyName || '',
      email,
      phone: phone || '',
      message,
      createdAt: new Date().toISOString(),
      status: 'unread',
    };

    console.log('📩 [New Inquiry Received]:', inquiryData);

    if (adminDb) {
      try {
        await adminDb.collection('inquiries').doc(inquiryData.id).set({
          ...inquiryData,
          serverTimestamp: FieldValue.serverTimestamp(),
        });
        console.log(`✅ [Firestore] Inquiry saved successfully: ${inquiryData.id}`);
      } catch (err: any) {
        console.warn('⚠️ [Firestore] Failed to save inquiry to Firestore:', err.message);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'お問い合わせを受け付けました。担当者より折り返しご連絡いたします。',
      inquiryId: inquiryData.id,
    });
  } catch (error: any) {
    console.error('Inquiry API Error:', error);
    return NextResponse.json(
      { error: error.message || 'お問い合わせの送信中にエラーが発生しました。' },
      { status: 500 }
    );
  }
}
