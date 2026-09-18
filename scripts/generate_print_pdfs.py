import base64
import os
import subprocess

def get_base64_image(path):
    with open(path, "rb") as f:
        return f"data:image/jpeg;base64,{base64.b64encode(f.read()).decode('utf-8')}"

grave_before_b64 = get_base64_image("public/images/grave_before.jpg")
grave_after_b64 = get_base64_image("public/images/grave_after.jpg")

qr_svg = '''<svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
  <rect width="100" height="100" fill="#ffffff" rx="4"/>
  <rect x="6" y="6" width="26" height="26" fill="#047857" rx="3"/>
  <rect x="10" y="10" width="18" height="18" fill="#ffffff" rx="2"/>
  <rect x="14" y="14" width="10" height="10" fill="#047857" rx="1"/>
  <rect x="68" y="6" width="26" height="26" fill="#047857" rx="3"/>
  <rect x="72" y="10" width="18" height="18" fill="#ffffff" rx="2"/>
  <rect x="76" y="14" width="10" height="10" fill="#047857" rx="1"/>
  <rect x="6" y="68" width="26" height="26" fill="#047857" rx="3"/>
  <rect x="10" y="72" width="18" height="18" fill="#ffffff" rx="2"/>
  <rect x="14" y="76" width="10" height="10" fill="#047857" rx="1"/>
  <rect x="38" y="8" width="6" height="6" fill="#047857"/>
  <rect x="48" y="14" width="6" height="6" fill="#047857"/>
  <rect x="56" y="8" width="6" height="6" fill="#047857"/>
  <rect x="38" y="22" width="6" height="6" fill="#047857"/>
  <rect x="50" y="24" width="6" height="6" fill="#047857"/>
  <rect x="12" y="38" width="6" height="6" fill="#047857"/>
  <rect x="22" y="44" width="6" height="6" fill="#047857"/>
  <rect x="38" y="38" width="6" height="6" fill="#047857"/>
  <rect x="48" y="44" width="6" height="6" fill="#047857"/>
  <rect x="58" y="38" width="6" height="6" fill="#047857"/>
  <rect x="72" y="44" width="6" height="6" fill="#047857"/>
  <rect x="82" y="38" width="6" height="6" fill="#047857"/>
  <rect x="38" y="54" width="6" height="6" fill="#047857"/>
  <rect x="48" y="60" width="6" height="6" fill="#047857"/>
  <rect x="58" y="54" width="6" height="6" fill="#047857"/>
  <rect x="72" y="60" width="6" height="6" fill="#047857"/>
  <rect x="82" y="68" width="6" height="6" fill="#047857"/>
  <rect x="38" y="74" width="6" height="6" fill="#047857"/>
  <rect x="48" y="82" width="6" height="6" fill="#047857"/>
  <rect x="62" y="76" width="6" height="6" fill="#047857"/>
  <rect x="74" y="82" width="6" height="6" fill="#047857"/>
  <rect x="84" y="86" width="6" height="6" fill="#047857"/>
</svg>'''
qr_b64 = f"data:image/svg+xml;base64,{base64.b64encode(qr_svg.encode('utf-8')).decode('utf-8')}"

# ==============================================================================
# 1. A4縦 ポスター (210mm x 297mm) - 上下均等・迫力のA4フィット
# ==============================================================================
poster_html = f'''<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="utf-8">
<title>ココロモウ A4ポスター</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700;900&display=swap');
  * {{ box-sizing: border-box; margin: 0; padding: 0; }}
  @page {{
    size: 210mm 297mm;
    margin: 0;
  }}
  html, body {{
    width: 210mm;
    height: 297mm;
    margin: 0;
    padding: 0;
    overflow: hidden;
  }}
  body {{
    font-family: 'Noto Sans JP', "Hiragino Kaku Gothic ProN", Meiryo, sans-serif;
    color: #1e293b;
    background: #ffffff;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }}
  .poster-container {{
    width: 210mm;
    height: 297mm;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: #ffffff;
  }}

  /* ヘッダー */
  .hero-header {{
    background: linear-gradient(135deg, #059669 0%, #0d9488 45%, #0284c7 100%);
    color: #ffffff;
    padding: 14mm 16mm 10mm 16mm;
  }}
  .hero-top-bar {{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }}
  .hero-logo-group {{
    display: flex;
    align-items: center;
    gap: 10px;
  }}
  .hero-logo-symbol {{
    width: 44px;
    height: 44px;
    background: #ffffff;
    color: #059669;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    font-weight: 900;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  }}
  .hero-logo-text {{
    font-size: 32px;
    font-weight: 900;
    line-height: 1.1;
  }}
  .hero-logo-sub {{
    font-size: 12px;
    color: #ccfbf1;
    letter-spacing: 0.5px;
    margin-top: 2px;
  }}
  .hero-area-badge {{
    background: #f59e0b;
    color: #0f172a;
    font-weight: 900;
    font-size: 14px;
    padding: 6px 14px;
    border-radius: 6px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.15);
  }}
  .hero-lead-text {{
    font-size: 14.5px;
    font-weight: 700;
    color: #fef08a;
    margin-bottom: 4px;
  }}
  .hero-main-title {{
    font-size: 32px;
    font-weight: 900;
    line-height: 1.35;
    letter-spacing: -0.5px;
    color: #ffffff;
  }}
  .hero-main-title span {{
    color: #fef08a;
  }}

  /* メインコンテンツ */
  .main-body {{
    padding: 6mm 16mm;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }}

  /* 写真Before / After */
  .showcase-wrap {{
    background: #f0fdf4;
    border-radius: 12px;
    padding: 12px 16px;
  }}
  .showcase-header {{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }}
  .showcase-title {{
    font-size: 14px;
    font-weight: 800;
    color: #065f46;
  }}
  .showcase-subtitle {{
    font-size: 12.5px;
    font-weight: 800;
    color: #d97706;
  }}
  .photo-compare-grid {{
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }}
  .photo-item {{
    background: #ffffff;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 6px rgba(0,0,0,0.06);
  }}
  .photo-item.is-after {{
    box-shadow: 0 3px 12px rgba(5, 150, 105, 0.25);
  }}
  .photo-img-wrap {{
    position: relative;
    width: 100%;
    height: 205px;
    overflow: hidden;
  }}
  .photo-img-wrap img {{
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }}
  .photo-label-before {{
    position: absolute;
    top: 8px;
    left: 8px;
    background: rgba(15, 23, 42, 0.85);
    color: #ffffff;
    font-size: 11.5px;
    font-weight: 800;
    padding: 4px 10px;
    border-radius: 4px;
  }}
  .photo-label-after {{
    position: absolute;
    top: 8px;
    left: 8px;
    background: #059669;
    color: #ffffff;
    font-size: 11.5px;
    font-weight: 800;
    padding: 4px 10px;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }}
  .photo-caption {{
    padding: 8px 12px;
    font-size: 11.5px;
    color: #475569;
    line-height: 1.4;
    background: #ffffff;
  }}
  .photo-caption.after-caption {{
    background: #ecfdf5;
    color: #064e3b;
    font-weight: 700;
  }}

  /* 3つの特徴ポイント */
  .features-wrap {{
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 12px;
  }}
  .feature-card {{
    background: #f8fafc;
    border-top: 4px solid #0d9488;
    border-radius: 0 0 8px 8px;
    padding: 12px 14px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  }}
  .feature-card.is-center {{
    border-top-color: #059669;
    background: #f0fdf4;
  }}
  .feature-card.is-right {{
    border-top-color: #f59e0b;
    background: #fffbeb;
  }}
  .feature-head {{
    font-size: 14px;
    font-weight: 800;
    color: #0f172a;
    margin-bottom: 4px;
  }}
  .feature-desc {{
    font-size: 11px;
    color: #475569;
    line-height: 1.45;
  }}

  /* 料金プラン */
  .plans-wrap {{
    background: #ffffff;
  }}
  .plans-sec-header {{
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 8px;
    border-bottom: 2px solid #cbd5e1;
    padding-bottom: 4px;
  }}
  .plans-sec-title {{
    font-size: 16.5px;
    font-weight: 900;
    color: #0f172a;
  }}
  .plans-sec-sub {{
    font-size: 11.5px;
    color: #64748b;
  }}
  .plans-table-grid {{
    display: grid;
    grid-template-columns: 1fr 1.25fr 1fr;
    gap: 10px;
  }}
  .plan-box {{
    background: #f8fafc;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    padding: 12px 10px;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }}
  .plan-box.is-popular {{
    background: #fffbeb;
    border: 2.5px solid #f59e0b;
    box-shadow: 0 4px 12px rgba(245, 158, 11, 0.25);
    transform: scale(1.02);
  }}
  .plan-pop-badge {{
    background: #f59e0b;
    color: #0f172a;
    font-size: 10.5px;
    font-weight: 900;
    padding: 2px 8px;
    border-radius: 4px;
    margin-bottom: 4px;
    display: inline-block;
  }}
  .plan-title {{
    font-size: 13.5px;
    font-weight: 800;
    color: #1e293b;
    margin-bottom: 2px;
  }}
  .plan-box.is-popular .plan-title {{
    color: #92400e;
  }}
  .plan-amount {{
    font-size: 22px;
    font-weight: 900;
    color: #0f172a;
  }}
  .plan-box.is-popular .plan-amount {{
    font-size: 26px;
    color: #047857;
  }}
  .plan-details {{
    font-size: 10.5px;
    color: #64748b;
    margin-top: 5px;
    line-height: 1.45;
  }}
  .plan-box.is-popular .plan-details {{
    color: #1e293b;
    font-weight: 700;
  }}

  /* フッターCTA */
  .footer-wrap {{
    background: linear-gradient(90deg, #f0fdf4 0%, #ffffff 50%, #fffbeb 100%);
    border-top: 3.5px solid #10b981;
    padding: 10mm 16mm;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }}
  .footer-info-col {{
    flex: 1;
  }}
  .footer-vendor-title {{
    font-size: 15px;
    font-weight: 900;
    color: #064e3b;
    margin-bottom: 4px;
  }}
  .footer-address {{
    font-size: 11px;
    color: #475569;
    margin-bottom: 6px;
  }}
  .footer-phone-row {{
    display: flex;
    align-items: center;
    gap: 10px;
  }}
  .footer-phone-btn {{
    background: #ffffff;
    border: 1.5px solid #059669;
    padding: 6px 16px;
    border-radius: 6px;
    font-size: 16px;
    font-weight: 900;
    color: #059669;
  }}
  .footer-phone-note {{
    font-size: 11px;
    color: #64748b;
  }}
  .footer-qr-col {{
    display: flex;
    align-items: center;
    gap: 12px;
    background: #ffffff;
    border: 2px solid #059669;
    padding: 8px 16px;
    border-radius: 10px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.06);
  }}
  .footer-qr-img {{
    width: 65px;
    height: 65px;
    flex-shrink: 0;
  }}
  .footer-qr-text {{
    text-align: left;
  }}
  .footer-qr-heading {{
    font-size: 13.5px;
    font-weight: 900;
    color: #064e3b;
    line-height: 1.2;
  }}
  .footer-qr-sub {{
    font-size: 11.5px;
    font-weight: 800;
    color: #d97706;
    margin-top: 2px;
  }}
  .footer-qr-desc {{
    font-size: 9.5px;
    color: #6b7280;
    margin-top: 1px;
  }}
</style>
</head>
<body>
  <div class="poster-container">
    <div class="hero-header">
      <div class="hero-top-bar">
        <div class="hero-logo-group">
          <div class="hero-logo-symbol">🌸</div>
          <div>
            <div class="hero-logo-text">ココロモウ</div>
            <div class="hero-logo-sub">お墓参り・お掃除代行プラットフォーム</div>
          </div>
        </div>
        <div class="hero-area-badge">愛媛・松山市内 霊園対応</div>
      </div>

      <div style="margin-top: 8px;">
        <div class="hero-lead-text">「忙しくて帰省できない」「高齢でお墓参りが大変」なあなたへ</div>
        <div class="hero-main-title">
          ふるさとのお墓を、真心を込めてピカピカに。<br>
          <span>お墓参り・お掃除代行サービス</span>
        </div>
      </div>
    </div>

    <div class="main-body">
      <div class="showcase-wrap">
        <div class="showcase-header">
          <span class="showcase-title">【施工実績】宝塔寺 旭ヶ丘霊園 モデル施工例</span>
          <span class="showcase-subtitle">✨ 見違えるほどの清らかな仕上がり</span>
        </div>
        <div class="photo-compare-grid">
          <div class="photo-item">
            <div class="photo-img-wrap">
              <img src="{grave_before_b64}" alt="作業前のお墓">
              <div class="photo-label-before">作業前 (Before)</div>
            </div>
            <div class="photo-caption">苔・水垢の付着、敷地内に散乱した落ち葉や雑草</div>
          </div>
          <div class="photo-item is-after">
            <div class="photo-img-wrap">
              <img src="{grave_after_b64}" alt="作業完了後のお墓">
              <div class="photo-label-after">作業完了 (After) ✨</div>
            </div>
            <div class="photo-caption after-caption">全面手作業除草・墓石専用水洗い・生花1対とお線香</div>
          </div>
        </div>
      </div>

      <div class="features-wrap">
        <div class="feature-card">
          <div class="feature-head">📸 鮮明な写真レポート</div>
          <div class="feature-desc">清掃前後の高画質写真をスマホにお届け。遠方からでも仕上がりをじっくり確認できます。</div>
        </div>
        <div class="feature-card is-center">
          <div class="feature-head">🏛️ 地元の確かなプロ施工</div>
          <div class="feature-desc">松山まごころ墓苑サポート等の地元提携店が真心込めて合掌・丁寧にお掃除します。</div>
        </div>
        <div class="feature-card is-right">
          <div class="feature-head">💳 明朗会計・追加料金なし</div>
          <div class="feature-desc">クレジットカード即時決済対応。お見積もり後の不明瞭な追加費用は一切ございません。</div>
        </div>
      </div>

      <div class="plans-wrap">
        <div class="plans-sec-header">
          <span class="plans-sec-title">選べる3つの安心代行プラン（税込・明朗会計）</span>
          <span class="plans-sec-sub">お墓の状態やご予算に合わせて選べます</span>
        </div>
        <div class="plans-table-grid">
          <div class="plan-box">
            <div>
              <div class="plan-title">基本お参りプラン</div>
              <div class="plan-amount">¥8,800</div>
            </div>
            <div class="plan-details">落ち葉拾い・墓石水拭き・お線香合掌・完了写真報告</div>
          </div>

          <div class="plan-box is-popular">
            <div>
              <div class="plan-pop-badge">★ 一番人気</div>
              <div class="plan-title">標準徹底お掃除プラン</div>
              <div class="plan-amount">¥14,800</div>
            </div>
            <div class="plan-details">全面手作業除草・墓石水洗い・生花1対とお線香・詳細写真レポート</div>
          </div>

          <div class="plan-box">
            <div>
              <div class="plan-title">プレミアム美装プラン</div>
              <div class="plan-amount">¥29,800</div>
            </div>
            <div class="plan-details">高圧洗浄・コケ除去・墓石撥水コーティング・防草施工・永代供養相談</div>
          </div>
        </div>
      </div>
    </div>

    <div class="footer-wrap">
      <div class="footer-info-col">
        <div class="footer-vendor-title">提携窓口: 株式会社 伊予メモリアルパートナーズ（ダミー）</div>
        <div class="footer-address">愛媛県松山市土居田町 / 宝塔寺旭ヶ丘霊園ほか松山市内霊園全域対応</div>
        <div class="footer-phone-row">
          <div class="footer-phone-btn">📞 089-997-XXXX</div>
          <div class="footer-phone-note">お電話でのご相談・お申し込みも承っております</div>
        </div>
      </div>

      <div class="footer-qr-col">
        <img class="footer-qr-img" src="{qr_b64}" alt="QRコード">
        <div class="footer-qr-text">
          <div class="footer-qr-heading">スマホで24時間受付</div>
          <div class="footer-qr-sub">簡単Webお申し込み</div>
          <div class="footer-qr-desc">カメラで読み取るだけ</div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
'''

# ==============================================================================
# 2. A4横 三つ折りリーフレット (297mm x 210mm) - 高さ210mmを完全に使い切る充実誌面
# ==============================================================================
leaflet_html = f'''<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="utf-8">
<title>ココロモウ 三つ折りリーフレット</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700;900&display=swap');
  * {{ box-sizing: border-box; margin: 0; padding: 0; }}
  @page {{
    size: 297mm 210mm;
    margin: 0;
  }}
  html, body {{
    width: 297mm;
    height: 210mm;
    margin: 0;
    padding: 0;
  }}
  body {{
    font-family: 'Noto Sans JP', "Hiragino Kaku Gothic ProN", Meiryo, sans-serif;
    color: #1e293b;
    background: #ffffff;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }}
  .sheet-page {{
    width: 297mm;
    height: 210mm;
    display: grid;
    grid-template-columns: 99mm 99mm 99mm;
    page-break-after: always;
    overflow: hidden;
    background: #ffffff;
  }}
  .sheet-page:last-child {{
    page-break-after: auto;
  }}

  /* 各面パネル (幅99mm x 高さ210mm) */
  .panel {{
    width: 99mm;
    height: 210mm;
    padding: 8mm 7.5mm;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    box-sizing: border-box;
    overflow: hidden;
  }}

  /* ---------------- 外側 1ページ目 ---------------- */
  /* 面1（左）：折り込み面 */
  .p-outside-left {{
    background: #fafaf9;
    border-right: 1px dashed #cbd5e1;
  }}
  .flap-badge {{
    font-size: 11px;
    font-weight: 800;
    color: #059669;
    letter-spacing: 0.5px;
    margin-bottom: 3px;
    display: block;
  }}
  .flap-h1 {{
    font-size: 17px;
    font-weight: 900;
    color: #0f172a;
    line-height: 1.35;
    margin-bottom: 6px;
  }}
  .flap-intro {{
    font-size: 9px;
    color: #475569;
    line-height: 1.45;
    margin-bottom: 8px;
    background: #ffffff;
    padding: 6px 8px;
    border-radius: 6px;
    border: 1px solid #e2e8f0;
  }}
  .flap-reason-card {{
    background: #ffffff;
    border-radius: 6px;
    padding: 7px 9px;
    margin-bottom: 6px;
    border: 1px solid #f1f5f9;
  }}
  .flap-reason-title {{
    font-size: 10.5px;
    font-weight: 800;
    color: #065f46;
    margin-bottom: 2px;
  }}
  .flap-reason-desc {{
    font-size: 8.5px;
    color: #475569;
    line-height: 1.4;
  }}
  .staff-msg-box {{
    background: #ecfdf5;
    border: 1px solid #a7f3d0;
    border-radius: 6px;
    padding: 7px 9px;
    margin-bottom: 6px;
  }}
  .staff-msg-title {{
    font-size: 9.5px;
    font-weight: 800;
    color: #065f46;
    margin-bottom: 2px;
  }}
  .staff-msg-text {{
    font-size: 8.5px;
    color: #064e3b;
    line-height: 1.35;
  }}
  .repeat-box {{
    background: #fffbeb;
    border: 1px solid #fde68a;
    border-radius: 6px;
    padding: 6px 9px;
    font-size: 9px;
    color: #92400e;
    font-weight: 700;
    text-align: center;
  }}

  /* 面2（中）：裏表紙 */
  .p-outside-center {{
    background: #ffffff;
    border-right: 1px dashed #cbd5e1;
  }}
  .back-heading {{
    font-size: 13.5px;
    font-weight: 900;
    color: #065f46;
    margin-bottom: 5px;
    display: flex;
    align-items: center;
    gap: 5px;
  }}
  .back-vendor-info {{
    background: #f0fdf4;
    border-radius: 6px;
    padding: 7px 9px;
    margin-bottom: 6px;
    border: 1px solid #dcfce7;
  }}
  .back-vendor-name {{
    font-size: 12px;
    font-weight: 900;
    color: #0f172a;
    margin-bottom: 2px;
  }}
  .back-vendor-addr {{
    font-size: 8.5px;
    color: #475569;
    line-height: 1.4;
  }}
  .back-tel-row {{
    margin-top: 4px;
    font-size: 13.5px;
    font-weight: 900;
    color: #059669;
  }}
  .back-area-list {{
    background: #f8fafc;
    border-radius: 6px;
    padding: 6px 8px;
    font-size: 8px;
    color: #475569;
    line-height: 1.35;
    margin-bottom: 6px;
    border: 1px solid #e2e8f0;
  }}
  .back-area-title {{
    font-weight: 800;
    color: #1e293b;
    margin-bottom: 2px;
  }}
  .back-faq-sec {{
    margin-bottom: 6px;
  }}
  .back-faq-title {{
    font-size: 11px;
    font-weight: 800;
    color: #0f172a;
    border-bottom: 1px solid #cbd5e1;
    padding-bottom: 2px;
    margin-bottom: 5px;
  }}
  .back-faq-grid {{
    display: flex;
    flex-direction: column;
    gap: 5px;
  }}
  .back-faq-item {{
    font-size: 8.5px;
    color: #475569;
    line-height: 1.35;
    background: #fafaf9;
    padding: 5px 7px;
    border-radius: 5px;
  }}
  .back-faq-item strong {{
    color: #065f46;
  }}
  .back-pay-info {{
    font-size: 8.5px;
    color: #475569;
    text-align: center;
    background: #f8fafc;
    padding: 5px;
    border-radius: 5px;
    margin-bottom: 6px;
    border: 1px solid #e2e8f0;
  }}
  .back-qr-box {{
    background: #ffffff;
    border: 1.5px solid #059669;
    border-radius: 8px;
    padding: 6px 8px;
    display: flex;
    align-items: center;
    gap: 8px;
  }}
  .back-qr-img {{
    width: 48px;
    height: 48px;
    flex-shrink: 0;
  }}

  /* 面3（右）：表紙 */
  .p-outside-right {{
    background: linear-gradient(145deg, #059669 0%, #0d9488 45%, #0284c7 100%);
    color: #ffffff;
  }}
  .cover-brand-row {{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }}
  .cover-brand-logo {{
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 16px;
    font-weight: 900;
  }}
  .cover-area-pill {{
    background: #f59e0b;
    color: #0f172a;
    font-size: 10.5px;
    font-weight: 900;
    padding: 2px 7px;
    border-radius: 4px;
  }}
  .cover-center {{
    text-align: center;
    margin: 10px 0 8px 0;
  }}
  .cover-sub-copy {{
    font-size: 12px;
    font-weight: 800;
    color: #fef08a;
    margin-bottom: 4px;
  }}
  .cover-title {{
    font-size: 24px;
    font-weight: 900;
    line-height: 1.35;
    letter-spacing: -0.3px;
  }}
  .cover-desc {{
    font-size: 9.5px;
    color: #f0fdf4;
    line-height: 1.45;
    margin-top: 6px;
  }}
  .cover-target-box {{
    background: rgba(255, 255, 255, 0.12);
    border-radius: 6px;
    padding: 6px 8px;
    margin: 8px 0;
    font-size: 8.5px;
    line-height: 1.4;
  }}
  .cover-target-title {{
    font-weight: 800;
    color: #fef08a;
    margin-bottom: 2px;
  }}
  .cover-trust-row {{
    display: flex;
    justify-content: space-between;
    gap: 4px;
    margin: 6px 0 10px 0;
  }}
  .cover-trust-item {{
    flex: 1;
    background: rgba(255, 255, 255, 0.18);
    backdrop-filter: blur(4px);
    border-radius: 4px;
    padding: 5px 2px;
    text-align: center;
    font-size: 8.5px;
    font-weight: 700;
    line-height: 1.25;
  }}
  .cover-photo-card {{
    background: #ffffff;
    border-radius: 8px;
    padding: 7px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.18);
  }}
  .cover-photo-head {{
    font-size: 9.5px;
    font-weight: 800;
    color: #065f46;
    text-align: center;
    margin-bottom: 4px;
  }}
  .cover-photo-grid {{
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 5px;
  }}
  .cover-photo-grid img {{
    width: 100%;
    height: 98px;
    object-fit: cover;
    border-radius: 4px;
    display: block;
  }}
  .cover-photo-tag {{
    font-size: 8px;
    text-align: center;
    padding: 2px 0;
    margin-top: 2px;
  }}

  /* ---------------- 内側 2ページ目（見開きワイド） ---------------- */
  .p-inside-left {{
    background: #f8fafc;
    border-right: 1px dashed #cbd5e1;
  }}
  .sec-heading {{
    font-size: 13px;
    font-weight: 900;
    color: #0f172a;
    margin-bottom: 6px;
    padding-bottom: 2px;
    border-bottom: 2px solid #059669;
  }}
  .trouble-list {{
    background: #fffbeb;
    border: 1px solid #fde68a;
    border-radius: 6px;
    padding: 7px 9px;
    margin-bottom: 7px;
  }}
  .trouble-item {{
    font-size: 8.5px;
    color: #78350f;
    line-height: 1.45;
    margin-bottom: 3px;
    display: flex;
    align-items: flex-start;
    gap: 4px;
  }}
  .trouble-item:last-child {{ margin-bottom: 0; }}
  
  .trust-box {{
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 7px 9px;
    margin-bottom: 7px;
  }}
  .trust-title {{
    font-size: 10px;
    font-weight: 800;
    color: #065f46;
    margin-bottom: 2px;
  }}
  .trust-desc {{
    font-size: 8.5px;
    color: #475569;
    line-height: 1.4;
  }}
  .find-grave-box {{
    background: #ecfdf5;
    border: 1px solid #a7f3d0;
    border-radius: 6px;
    padding: 6px 9px;
    margin-bottom: 7px;
  }}
  .find-grave-title {{
    font-size: 9.5px;
    font-weight: 800;
    color: #065f46;
    margin-bottom: 1px;
  }}
  .find-grave-desc {{
    font-size: 8.5px;
    color: #064e3b;
    line-height: 1.35;
  }}

  .step-row {{
    display: flex;
    align-items: center;
    gap: 7px;
    background: #ffffff;
    padding: 5px 8px;
    border-radius: 6px;
    margin-bottom: 5px;
    border: 1px solid #f1f5f9;
  }}
  .step-num {{
    width: 18px;
    height: 18px;
    background: #059669;
    color: #ffffff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 9.5px;
    font-weight: 900;
    flex-shrink: 0;
  }}
  .step-text {{
    font-size: 9px;
    font-weight: 700;
    color: #1e293b;
  }}
  .step-sub {{
    font-size: 8px;
    color: #64748b;
    margin-left: 3px;
    font-weight: normal;
  }}

  /* 内側中面：プラン詳細 */
  .p-inside-center {{
    background: #ffffff;
    border-right: 1px dashed #cbd5e1;
  }}
  .plan-card-in {{
    background: #f8fafc;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    padding: 7px 9px;
    margin-bottom: 6px;
  }}
  .plan-card-in.is-pop {{
    background: #f0fdf4;
    border: 2px solid #059669;
  }}
  .plan-card-in-head {{
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 3px;
  }}
  .plan-card-in-title {{
    font-size: 11px;
    font-weight: 800;
    color: #0f172a;
  }}
  .plan-card-in.is-pop .plan-card-in-title {{
    color: #065f46;
  }}
  .plan-card-in-price {{
    font-size: 15px;
    font-weight: 900;
    color: #0f172a;
  }}
  .plan-card-in.is-pop .plan-card-in-price {{
    font-size: 17.5px;
    color: #059669;
  }}
  .plan-list-items {{
    font-size: 8.5px;
    color: #475569;
    line-height: 1.4;
  }}
  .plan-list-items div {{
    margin-bottom: 1px;
  }}
  .plan-list-items strong {{
    color: #064e3b;
  }}
  .option-box-in {{
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 6px 8px;
    margin-top: 4px;
    margin-bottom: 4px;
  }}
  .option-box-title {{
    font-size: 9.5px;
    font-weight: 800;
    color: #1e293b;
    margin-bottom: 2px;
  }}
  .option-box-desc {{
    font-size: 8px;
    color: #64748b;
    line-height: 1.35;
  }}

  /* 内側右面：実例・声 */
  .p-inside-right {{
    background: #f8fafc;
  }}
  .example-photos-row {{
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 5px;
    margin-bottom: 6px;
  }}
  .example-photo-box {{
    background: #ffffff;
    border-radius: 6px;
    overflow: hidden;
    border: 1px solid #e2e8f0;
  }}
  .example-photo-box img {{
    width: 100%;
    height: 72px;
    object-fit: cover;
    display: block;
  }}
  .example-photo-lbl {{
    font-size: 8px;
    text-align: center;
    padding: 2px 0;
    color: #475569;
    background: #ffffff;
  }}
  .example-photo-box.is-after .example-photo-lbl {{
    background: #ecfdf5;
    color: #065f46;
    font-weight: 700;
  }}
  .voice-bubble {{
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 5px 8px;
    margin-bottom: 5px;
  }}
  .voice-bubble-title {{
    font-size: 9.5px;
    font-weight: 800;
    color: #92400e;
    margin-bottom: 1px;
    display: flex;
    justify-content: space-between;
  }}
  .voice-bubble-text {{
    font-size: 8.5px;
    color: #475569;
    line-height: 1.3;
  }}
  .support-contact-box {{
    background: #ffffff;
    border: 1.5px solid #059669;
    border-radius: 6px;
    padding: 6px 8px;
    margin-bottom: 5px;
    text-align: center;
  }}
  .support-contact-title {{
    font-size: 9.5px;
    font-weight: 800;
    color: #065f46;
  }}
  .support-contact-tel {{
    font-size: 14px;
    font-weight: 900;
    color: #059669;
    margin: 1px 0;
  }}
  .support-contact-time {{
    font-size: 8px;
    color: #64748b;
  }}
  .inside-footer-cta {{
    background: #059669;
    color: #ffffff;
    border-radius: 6px;
    padding: 7px 8px;
    text-align: center;
  }}
  .inside-footer-cta-title {{
    font-size: 11.5px;
    font-weight: 900;
  }}
  .inside-footer-cta-sub {{
    font-size: 8.5px;
    color: #d1fae5;
    margin-top: 1px;
  }}
</style>
</head>
<body>

  <!-- ============================================================= -->
  <!-- 1ページ目：外側3面（左：折り込み面 / 中：裏表紙 / 右：表紙） -->
  <!-- ============================================================= -->
  <div class="sheet-page">

    <!-- 面1（左）：折り込み面 -->
    <div class="panel p-outside-left">
      <div>
        <span class="flap-badge">ココロモウの約束</span>
        <div class="flap-h1">
          遠く離れていても、<br>
          ふるさとへの感謝を<br>
          真心を込めて繋ぐ。
        </div>
        <div class="flap-intro">
          「お墓参りに行けず申し訳ない」「お墓が荒れていないか心配」というご家族の想いに寄り添い、松山の地元石材パートナーとともに立ち上げました。
        </div>
      </div>

      <div class="flap-reason-card">
        <div class="flap-reason-title">🌸 単なる作業ではない「供養の心」</div>
        <div class="flap-reason-desc">雑草抜きや水洗いだけでなく、生花をお供えし線香を焚き、敬虔に合掌いたします。</div>
      </div>

      <div class="flap-reason-card">
        <div class="flap-reason-title">🏛️ 松山エリア専門の確かな技術</div>
        <div class="flap-reason-desc">石材技能士の知識を持つ地元職人が、墓石を傷めない専用水洗いと手作業除草で施工。</div>
      </div>

      <div class="flap-reason-card">
        <div class="flap-reason-title">📸 鮮明な高画質写真レポート</div>
        <div class="flap-reason-desc">作業前後の比較写真をWebでお届け。遠方のご家族全員で安心を共有できます。</div>
      </div>

      <div class="flap-reason-card">
        <div class="flap-reason-title">🤝 永代供養・墓じまいのご相談も</div>
        <div class="flap-reason-desc">宝塔寺旭ヶ丘霊園での永代供養や、将来の墓じまい・改葬までワンストップ対応。</div>
      </div>

      <div class="staff-msg-box">
        <div class="staff-msg-title">💬 地元技術スタッフより</div>
        <div class="staff-msg-text">
          「松山の気候風土とお墓を知り尽くした私たちが、ご家族の想いを大切にお墓へお届けします。」
        </div>
      </div>

      <div class="repeat-box">
        📅 年間定期管理（年2〜4回）なら全プラン10%OFF
      </div>

      <div style="text-align: center; font-size: 10px; font-weight: 800; color: #059669; padding-top: 5px; border-top: 1px solid #e2e8f0;">
        ▶ ページを開いて詳しいプランをご覧ください
      </div>
    </div>

    <!-- 面2（中）：裏表紙（提携窓口・Q&A・QR） -->
    <div class="panel p-outside-center">
      <div class="back-heading">
        <span>🌸</span>
        <span>提携窓口・会社概要</span>
      </div>

      <div class="back-vendor-info">
        <div style="font-size: 9px; font-weight: 800; color: #065f46; margin-bottom: 1px;">愛媛・松山エリア公認パートナー</div>
        <div class="back-vendor-name">株式会社 伊予メモリアルパートナーズ（ダミー）</div>
        <div class="back-vendor-addr">
          〒790-0056 愛媛県松山市土居田町<br>
          営業時間：9:00〜18:00（年中無休）
        </div>
        <div class="back-tel-row">
          📞 TEL: 089-997-XXXX
        </div>
      </div>

      <div class="back-area-list">
        <div class="back-area-title">📍 主な対応エリア・霊園一覧</div>
        対応地域：松山市全域・東温市・伊予市・松前町・砥部町<br>
        主な霊園：宝塔寺旭ヶ丘霊園、松山市営大明神霊園、客谷霊園、鷺谷霊園、市内各寺院・地域共同墓地
      </div>

      <div class="back-faq-sec">
        <div class="back-faq-title">よくあるご質問（抜粋）</div>
        <div class="back-faq-grid">
          <div class="back-faq-item">
            <strong>Q. 立ち会いは必要ですか？</strong><br>
            A. 一切不要です。作業前後の高画質写真をWebでお送りします。
          </div>
          <div class="back-faq-item">
            <strong>Q. 追加料金はかかりますか？</strong><br>
            A. かかりません。出張費・資材費込みの明朗会計です。
          </div>
          <div class="back-faq-item">
            <strong>Q. 宗派や宗教の指定は？</strong><br>
            A. 仏教各宗派、神道、キリスト教の作法に配慮いたします。
          </div>
          <div class="back-faq-item">
            <strong>Q. 寺院や山間部の墓地でも可能？</strong><br>
            A. はい。寺院・公営・民間・共同墓地に対応可能です。
          </div>
          <div class="back-faq-item">
            <strong>Q. 雨天の場合は？</strong><br>
            A. 丁寧な清掃のため、天候回復後に順延して実施します。
          </div>
          <div class="back-faq-item">
            <strong>Q. 墓石の破損が見つかったら？</strong><br>
            A. 写真付きで報告し、ご希望に応じて補修見積もりを案内します。
          </div>
        </div>
      </div>

      <div class="back-pay-info">
        💳 各種クレジットカード（VISA/Master/JCB/Amex）即時決済対応
      </div>

      <div class="back-qr-box">
        <img class="back-qr-img" src="{qr_b64}" alt="QRコード">
        <div>
          <div style="font-size: 11px; font-weight: 900; color: #064e3b;">スマホで24時間受付</div>
          <div style="font-size: 9.5px; font-weight: 800; color: #d97706;">簡単3分Webお申し込み</div>
          <div style="font-size: 8px; color: #64748b;">カメラをかざすだけで注文完了</div>
        </div>
      </div>
    </div>

    <!-- 面3（右）：表紙 -->
    <div class="panel p-outside-right">
      <div class="cover-brand-row">
        <div class="cover-brand-logo">
          <span>🌸</span>
          <span>ココロモウ</span>
        </div>
        <div class="cover-area-pill">愛媛・松山版</div>
      </div>

      <div class="cover-center">
        <div class="cover-sub-copy">お墓参り・お掃除代行サービス</div>
        <div class="cover-title">
          ふるさとのお墓を、<br>
          真心を込めて<br>
          ピカピカに。
        </div>
        <div class="cover-desc">
          松山の地元石材パートナーが、ご家族に代わって丁寧に清掃・合掌。鮮明な写真レポートをお届けします。
        </div>
      </div>

      <div class="cover-target-box">
        <div class="cover-target-title">こんな方にご利用いただいています</div>
        ・遠方在住で帰省が難しい方<br>
        ・足腰の不安でお参りの階段がつらい方<br>
        ・お盆や命日にお墓を綺麗にしておきたい方
      </div>

      <div class="cover-trust-row">
        <div class="cover-trust-item">① 明朗会計<br>追加費用なし</div>
        <div class="cover-trust-item">② 鮮明写真<br>Web完了報告</div>
        <div class="cover-trust-item">③ 生花・線香<br>真心の合掌込</div>
      </div>

      <div class="cover-photo-card">
        <div class="cover-photo-head">宝塔寺 旭ヶ丘霊園 実写施工例</div>
        <div class="cover-photo-grid">
          <div>
            <img src="{grave_before_b64}" alt="作業前">
            <div class="cover-photo-tag" style="background:#f1f5f9; color:#475569;">作業前</div>
          </div>
          <div>
            <img src="{grave_after_b64}" alt="作業後">
            <div class="cover-photo-tag" style="background:#ecfdf5; color:#065f46; font-weight:bold;">作業完了後 ✨</div>
          </div>
        </div>
      </div>

      <div style="font-size: 8.5px; color: #e2e8f0; text-align: center; padding-top: 3px;">
        松山市・中予エリア全域対応 / 初めての方もお気軽にご相談ください
      </div>
    </div>

  </div>

  <!-- ============================================================= -->
  <!-- 2ページ目：内側見開き3面（左：お悩み/流れ / 中：プラン / 右：実例/声） -->
  <!-- ============================================================= -->
  <div class="sheet-page">

    <!-- 面4（左）：お悩みと選ばれる安心・流れ -->
    <div class="panel p-inside-left">
      <div>
        <div class="sec-heading">こんなお悩み、ございませんか？</div>
        <div class="trouble-list">
          <div class="trouble-item"><span>✓</span> 遠方に住んでいてなかなか松山へ帰省できない</div>
          <div class="trouble-item"><span>✓</span> 高齢になり階段や山道の墓参りが体力的にきつい</div>
          <div class="trouble-item"><span>✓</span> お盆や命日にお墓が荒れていないか気がかり</div>
          <div class="trouble-item"><span>✓</span> 墓石のコケやしつこい水垢、雑草抜きが大変</div>
        </div>
      </div>

      <div class="trust-box">
        <div class="trust-title">🌸 松山密着だからできる安心対応</div>
        <div class="trust-desc">
          地元石材のプロが専用資材で墓石を傷めず手作業清掃。お花も松山市内の提携花店から新鮮な状態でお供えします。
        </div>
      </div>

      <div class="find-grave-box">
        <div class="find-grave-title">💡 お墓の場所が曖昧でも大丈夫</div>
        <div class="find-grave-desc">
          霊園名とお墓の特徴、施主名をお知らせいただければ、管理事務所と連携してスタッフがお墓をお探しします。
        </div>
      </div>

      <div>
        <div class="sec-heading">ご利用の流れ（簡単4ステップ）</div>
        <div class="steps-box">
          <div class="step-row">
            <div class="step-num">1</div>
            <div>
              <div class="step-text">Web・お電話で申込み</div>
              <div class="step-sub">霊園名と希望日を選ぶだけ（所要3分）</div>
            </div>
          </div>
          <div class="step-row">
            <div class="step-num">2</div>
            <div>
              <div class="step-text">事前決済（明朗会計）</div>
              <div class="step-sub">クレカ即時決済で追加費用なし</div>
            </div>
          </div>
          <div class="step-row">
            <div class="step-num">3</div>
            <div>
              <div class="step-text">現地清掃・真心の合掌</div>
              <div class="step-sub">職人が丁寧に施工・生花線香をお供え</div>
            </div>
          </div>
          <div class="step-row">
            <div class="step-num">4</div>
            <div>
              <div class="step-text">写真レポート納品</div>
              <div class="step-sub">スマホで仕上がり確認・親族へ共有可能</div>
            </div>
          </div>
        </div>
      </div>

      <div style="font-size: 8.5px; color: #64748b; text-align: center; padding-top: 4px; border-top: 1px solid #e2e8f0;">
        安心の事前決済・追加料金は一切いただきません
      </div>
    </div>

    <!-- 面5（中）：選べる3つのプラン詳細 -->
    <div class="panel p-inside-center">
      <div class="sec-heading">選べる3つの代行プラン（税込）</div>

      <!-- 基本プラン -->
      <div class="plan-card-in">
        <div class="plan-card-in-head">
          <span class="plan-card-in-title">基本お参りプラン</span>
          <span class="plan-card-in-price">¥8,800</span>
        </div>
        <div class="plan-list-items">
          <div>✓ 敷地内の落ち葉・雑草・ゴミ清掃</div>
          <div>✓ 墓石全体の水拭き清掃</div>
          <div>✓ お線香献香・真心の合掌</div>
          <div>✓ 完了写真レポート（メール納品）</div>
        </div>
      </div>

      <!-- 標準プラン（一番人気） -->
      <div class="plan-card-in is-pop">
        <div style="font-size: 8.5px; font-weight: 900; color: #d97706; margin-bottom: 1px;">★ 一番人気・おすすめ</div>
        <div class="plan-card-in-head">
          <span class="plan-card-in-title" style="font-size: 12px;">標準徹底お掃除プラン</span>
          <span class="plan-card-in-price">¥14,800</span>
        </div>
        <div class="plan-list-items">
          <div>✓ <strong>手作業徹底除草（根から除去）</strong></div>
          <div>✓ <strong>墓石・花立・香炉の専用水洗い</strong></div>
          <div>✓ <strong>頑固なコケ・水垢・汚れ落とし</strong></div>
          <div>✓ <strong>季節の生花1対（松山生花店直送）</strong></div>
          <div>✓ お線香献香・真心の合掌</div>
          <div>✓ 墓石健全度目地点検・詳細写真レポート</div>
        </div>
      </div>

      <!-- プレミアムプラン -->
      <div class="plan-card-in">
        <div class="plan-card-in-head">
          <span class="plan-card-in-title">プレミアム美装プラン</span>
          <span class="plan-card-in-price">¥29,800</span>
        </div>
        <div class="plan-list-items">
          <div>✓ 標準プランの全作業内容</div>
          <div>✓ 外柵・敷石の高圧洗浄機クリーニング</div>
          <div>✓ <strong>墓石撥水防汚コーティング施工</strong></div>
          <div>✓ <strong>防草砂（固まる土）施工</strong></div>
          <div>✓ 永代供養・改葬・墓じまい優先無料相談</div>
        </div>
      </div>

      <div class="option-box-in">
        <div class="option-box-title">🔧 個別オプション対応</div>
        <div class="option-box-desc">
          墓石文字の墨入れ（白・黒）／花立・線香皿のステンレス交換／樹木の剪定・伐採／墓じまい相談
        </div>
      </div>

      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 5px 7px; font-size: 8.5px; color: #065f46; font-weight: 700; text-align: center;">
        ※ お得な年間定期契約（年2〜4回）なら全プラン10%OFF
      </div>
    </div>

    <!-- 面6（右）：実例とお客さまの声 -->
    <div class="panel p-inside-right">
      <div class="sec-heading">施工実績とお客さまの声</div>

      <div class="example-photos-row">
        <div class="example-photo-box">
          <img src="{grave_before_b64}" alt="Before">
          <div class="example-photo-lbl">作業前 (手入れ前)</div>
        </div>
        <div class="example-photo-box is-after">
          <img src="{grave_after_b64}" alt="After">
          <div class="example-photo-lbl">作業完了 (献花・合掌) ✨</div>
        </div>
      </div>

      <div class="voice-bubble">
        <div class="voice-bubble-title">
          <span>「届いた写真を見て家族で涙が出ました」</span>
          <span style="color:#f59e0b;">★★★★★</span>
        </div>
        <div class="voice-bubble-text">
          東京在住で帰省できず心配でしたが、ピカピカになり生花が供えられた写真を見て本当に安心しました。（50代女性・宝塔寺旭ヶ丘霊園）
        </div>
      </div>

      <div class="voice-bubble">
        <div class="voice-bubble-title">
          <span>「目地の点検所見まで添えていただき感謝」</span>
          <span style="color:#f59e0b;">★★★★★</span>
        </div>
        <div class="voice-bubble-text">
          高齢で坂道がつらかったのですが、目地の状態まで写真付きで報告していただき助かりました。（60代男性・松山市）
        </div>
      </div>

      <div class="voice-bubble">
        <div class="voice-bubble-title">
          <span>「遠く離れていても親孝行ができました」</span>
          <span style="color:#f59e0b;">★★★★★</span>
        </div>
        <div class="voice-bubble-text">
          仕事でなかなか帰省できませんでしたが、親族からも大変喜ばれました。（40代男性・大明神霊園）
        </div>
      </div>

      <div class="support-contact-box">
        <div class="support-contact-title">お電話でのご相談・お見積りもお気軽に</div>
        <div class="support-contact-tel">📞 089-997-XXXX</div>
        <div class="support-contact-time">受付時間: 9:00〜18:00（年中無休）</div>
      </div>

      <div class="inside-footer-cta">
        <div class="inside-footer-cta-title">Web・お電話で簡単お申し込み</div>
        <div class="inside-footer-cta-sub">スマホから3分で完了 / クレジットカード決済対応</div>
      </div>
    </div>

  </div>

</body>
</html>
'''

with open("/tmp/kokoromou_poster.html", "w", encoding="utf-8") as f:
    f.write(poster_html)

with open("/tmp/kokoromou_leaflet.html", "w", encoding="utf-8") as f:
    f.write(leaflet_html)

chrome_path = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

# 1. ポスターPDF
subprocess.run([
    chrome_path,
    "--headless=new",
    "--disable-gpu",
    "--no-pdf-header-footer",
    "--print-to-pdf=public/pdf/kokoromou_poster_a4.pdf",
    "file:///tmp/kokoromou_poster.html"
], check=True)
print("Updated public/pdf/kokoromou_poster_a4.pdf")

# 2. リーフレットPDF
subprocess.run([
    chrome_path,
    "--headless=new",
    "--disable-gpu",
    "--no-pdf-header-footer",
    "--print-to-pdf=public/pdf/kokoromou_leaflet_trifold.pdf",
    "file:///tmp/kokoromou_leaflet.html"
], check=True)
print("Updated public/pdf/kokoromou_leaflet_trifold.pdf")
