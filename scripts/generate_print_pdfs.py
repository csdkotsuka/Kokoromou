import base64
import os
import subprocess

# 1. 画像のBase64エンコード
def get_base64_image(path):
    with open(path, "rb") as f:
        return f"data:image/jpeg;base64,{base64.b64encode(f.read()).decode('utf-8')}"

grave_before_b64 = get_base64_image("public/images/grave_before.jpg")
grave_after_b64 = get_base64_image("public/images/grave_after.jpg")

# QRコード SVG
qr_svg = '''<svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
  <rect width="100" height="100" fill="#ffffff"/>
  <!-- 角のファインダパターン -->
  <rect x="5" y="5" width="28" height="28" fill="#047857" rx="3"/>
  <rect x="9" y="9" width="20" height="20" fill="#ffffff" rx="2"/>
  <rect x="13" y="13" width="12" height="12" fill="#047857" rx="1"/>

  <rect x="67" y="5" width="28" height="28" fill="#047857" rx="3"/>
  <rect x="71" y="9" width="20" height="20" fill="#ffffff" rx="2"/>
  <rect x="75" y="13" width="12" height="12" fill="#047857" rx="1"/>

  <rect x="5" y="67" width="28" height="28" fill="#047857" rx="3"/>
  <rect x="9" y="71" width="20" height="20" fill="#ffffff" rx="2"/>
  <rect x="13" y="75" width="12" height="12" fill="#047857" rx="1"/>

  <!-- ダミーQRドットパターン -->
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

common_head = '''
<meta charset="utf-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700;900&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Noto Sans JP', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    color: #1c1917;
    background-color: #ffffff;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
</style>
'''

# ==========================================
# 1. A4縦 ポスター HTML (210mm x 297mm)
# ==========================================
poster_html = f'''<!DOCTYPE html>
<html>
<head>
{common_head}
<style>
  @page {{
    size: A4 portrait;
    margin: 0;
  }}
  .page {{
    width: 210mm;
    height: 297mm;
    position: relative;
    padding: 12mm 14mm;
    background: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
  }}
  .header {{
    background: linear-gradient(135deg, #059669 0%, #0d9488 50%, #0284c7 100%);
    border-radius: 16px;
    padding: 18px 24px;
    color: white;
    box-shadow: 0 4px 14px rgba(5, 150, 105, 0.2);
  }}
  .top-bar {{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }}
  .logo-box {{
    display: flex;
    align-items: center;
    gap: 10px;
  }}
  .logo-icon {{
    width: 38px;
    height: 38px;
    background: white;
    color: #059669;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    font-weight: 900;
  }}
  .brand-title {{
    font-size: 24px;
    font-weight: 900;
    letter-spacing: -0.5px;
    line-height: 1.1;
  }}
  .brand-sub {{
    font-size: 11px;
    color: #ccfbf1;
    letter-spacing: 0.5px;
  }}
  .badge-matsuyama {{
    background: #f59e0b;
    color: #1c1917;
    font-weight: 900;
    font-size: 13px;
    padding: 5px 14px;
    border-radius: 9999px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.15);
  }}
  .catch-pill {{
    display: inline-block;
    background: rgba(255, 255, 255, 0.22);
    padding: 4px 14px;
    border-radius: 9999px;
    font-size: 12px;
    font-weight: 700;
    margin-bottom: 8px;
    border: 1px solid rgba(255,255,255,0.3);
  }}
  .main-heading {{
    font-size: 26px;
    font-weight: 900;
    line-height: 1.3;
    text-shadow: 0 2px 4px rgba(0,0,0,0.15);
  }}
  .highlight-text {{
    color: #fef08a;
  }}

  .visual-section {{
    background: linear-gradient(180deg, #ecfdf5 0%, #fffbeb 100%);
    border: 1.5px solid #a7f3d0;
    border-radius: 18px;
    padding: 16px;
  }}
  .visual-label-bar {{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }}
  .visual-badge {{
    background: white;
    color: #065f46;
    border: 1px solid #6ee7b7;
    font-size: 12px;
    font-weight: 800;
    padding: 3px 12px;
    border-radius: 9999px;
  }}
  .visual-subbadge {{
    background: #fef3c7;
    color: #92400e;
    font-size: 12px;
    font-weight: 900;
    padding: 3px 10px;
    border-radius: 9999px;
  }}
  .photo-grid {{
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }}
  .photo-card {{
    background: white;
    border-radius: 12px;
    overflow: hidden;
    position: relative;
    border: 1px solid #e7e5e4;
  }}
  .photo-card.after {{
    border: 2.5px solid #10b981;
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
  }}
  .photo-card img {{
    width: 100%;
    height: 175px;
    object-fit: cover;
    display: block;
  }}
  .tag-before {{
    position: absolute;
    top: 8px;
    left: 8px;
    background: rgba(28, 25, 23, 0.85);
    color: white;
    font-size: 11px;
    font-weight: 800;
    padding: 3px 8px;
    border-radius: 6px;
  }}
  .tag-after {{
    position: absolute;
    top: 8px;
    left: 8px;
    background: #059669;
    color: white;
    font-size: 11px;
    font-weight: 800;
    padding: 3px 8px;
    border-radius: 6px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.2);
  }}
  .photo-desc {{
    padding: 8px 10px;
    font-size: 10.5px;
    color: #57534e;
    background: #fafaf9;
    line-height: 1.35;
  }}
  .photo-desc.after-desc {{
    background: #ecfdf5;
    color: #064e3b;
    font-weight: 700;
  }}

  .features-grid {{
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 12px;
  }}
  .feature-box {{
    padding: 12px;
    border-radius: 14px;
    text-align: center;
  }}
  .feat-blue {{ background: #f0f9ff; border: 1.5px solid #bae6fd; }}
  .feat-green {{ background: #ecfdf5; border: 1.5px solid #a7f3d0; }}
  .feat-amber {{ background: #fffbeb; border: 1.5px solid #fde68a; }}
  
  .feat-title {{
    font-size: 13px;
    font-weight: 900;
    margin-bottom: 3px;
    display: block;
  }}
  .feat-blue .feat-title {{ color: #0369a1; }}
  .feat-green .feat-title {{ color: #065f46; }}
  .feat-amber .feat-title {{ color: #92400e; }}
  .feat-desc {{
    font-size: 10.5px;
    color: #57534e;
    line-height: 1.3;
  }}

  .plans-section {{
    background: #fafaf9;
    border: 1.5px solid #e7e5e4;
    border-radius: 16px;
    padding: 14px 16px;
  }}
  .plans-header {{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }}
  .plans-title {{
    font-size: 15px;
    font-weight: 900;
    color: #1c1917;
  }}
  .plans-pill {{
    background: #d1fae5;
    color: #065f46;
    font-size: 11px;
    font-weight: 800;
    padding: 2px 8px;
    border-radius: 6px;
  }}
  .plans-grid {{
    display: grid;
    grid-template-columns: 1fr 1.15fr 1fr;
    gap: 10px;
  }}
  .plan-card {{
    background: white;
    border: 1px solid #d6d3d1;
    border-radius: 12px;
    padding: 10px;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }}
  .plan-card.pop {{
    background: linear-gradient(180deg, #fffbeb 0%, #ffffff 100%);
    border: 2px solid #f59e0b;
    box-shadow: 0 4px 10px rgba(245, 158, 11, 0.15);
    position: relative;
  }}
  .pop-tag {{
    position: absolute;
    top: -9px;
    left: 50%;
    transform: translateX(-50%);
    background: #f59e0b;
    color: #1c1917;
    font-size: 10px;
    font-weight: 900;
    padding: 1px 8px;
    border-radius: 9999px;
    white-space: nowrap;
  }}
  .plan-name {{
    font-size: 12px;
    font-weight: 800;
    color: #292524;
    margin-bottom: 2px;
  }}
  .plan-card.pop .plan-name {{
    color: #78350f;
    margin-top: 4px;
  }}
  .plan-price {{
    font-size: 18px;
    font-weight: 900;
    color: #1c1917;
  }}
  .plan-card.pop .plan-price {{
    font-size: 21px;
    color: #065f46;
  }}
  .plan-info {{
    font-size: 9.5px;
    color: #78716c;
    margin-top: 4px;
    line-height: 1.3;
  }}
  .plan-card.pop .plan-info {{
    color: #1c1917;
    font-weight: 700;
  }}

  .footer-cta {{
    background: linear-gradient(90deg, #ecfdf5 0%, #f0fdf4 50%, #fffbeb 100%);
    border: 2px solid #6ee7b7;
    border-radius: 16px;
    padding: 14px 18px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 4px 12px rgba(5, 150, 105, 0.1);
  }}
  .cta-left {{
    flex: 1;
  }}
  .cta-vendor {{
    font-size: 13px;
    font-weight: 900;
    color: #064e3b;
    margin-bottom: 2px;
  }}
  .cta-address {{
    font-size: 10.5px;
    color: #57534e;
    margin-bottom: 6px;
  }}
  .cta-phone-box {{
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: white;
    border: 1.5px solid #34d399;
    padding: 4px 12px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 900;
    color: #065f46;
  }}
  .cta-right {{
    display: flex;
    align-items: center;
    gap: 12px;
    background: white;
    border: 2px solid #10b981;
    padding: 8px 12px;
    border-radius: 14px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  }}
  .qr-box {{
    width: 60px;
    height: 60px;
    flex-shrink: 0;
  }}
  .qr-info {{
    text-align: left;
  }}
  .qr-main {{
    font-size: 13px;
    font-weight: 900;
    color: #064e3b;
    display: block;
    line-height: 1.2;
  }}
  .qr-sub {{
    font-size: 11px;
    font-weight: 800;
    color: #d97706;
    display: block;
    margin-top: 2px;
  }}
  .qr-note {{
    font-size: 9px;
    color: #78716c;
  }}
</style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div class="top-bar">
        <div class="logo-box">
          <div class="logo-icon">🌸</div>
          <div>
            <div class="brand-title">ココロモウ</div>
            <div class="brand-sub">お墓参り・お掃除代行プラットフォーム</div>
          </div>
        </div>
        <div class="badge-matsuyama">愛媛・松山市内 霊園対応</div>
      </div>

      <div style="text-align: center; margin-top: 6px;">
        <div class="catch-pill">✨「忙しくて帰省できない」「高齢でお墓参りが大変」なあなたへ</div>
        <div class="main-heading">
          ふるさとのお墓を、真心を込めてピカピカに。<br>
          <span class="highlight-text">お墓参り・お掃除代行サービス</span>
        </div>
      </div>
    </div>

    <div class="visual-section">
      <div class="visual-label-bar">
        <span class="visual-badge">✓ 【施工実績】宝塔寺 旭ヶ丘霊園 モデル施工例</span>
        <span class="visual-subbadge">見違えるほどの仕上がり！</span>
      </div>

      <div class="photo-grid">
        <div class="photo-card">
          <div class="tag-before">作業前 (Before)</div>
          <img src="{grave_before_b64}" alt="作業前">
          <div class="photo-desc">苔・水垢の付着、敷地内に散乱した落ち葉や枯れ草</div>
        </div>
        <div class="photo-card after">
          <div class="tag-after">作業完了 (After) ✨</div>
          <img src="{grave_after_b64}" alt="作業後">
          <div class="photo-desc after-desc">全面除草・専用水洗い・季節の生花とお線香</div>
        </div>
      </div>
    </div>

    <div class="features-grid">
      <div class="feature-box feat-blue">
        <span class="feat-title">📸 鮮明な写真レポート</span>
        <span class="feat-desc">清掃前後の高画質写真をスマホで即座に確認できます</span>
      </div>
      <div class="feature-box feat-green">
        <span class="feat-title">🏛️ 地元の確かなプロ</span>
        <span class="feat-desc">松山「お墓のトータルエージェント」提携店が真心施工</span>
      </div>
      <div class="feature-box feat-amber">
        <span class="feat-title">💳 安心の明朗会計</span>
        <span class="feat-desc">カード即時決済・お見積もり後の追加料金一切なし</span>
      </div>
    </div>

    <div class="plans-section">
      <div class="plans-header">
        <div>
          <span class="plans-pill">明朗会計（税込）</span>
          <span class="plans-title" style="margin-left: 6px;">選べる3つの代行プラン</span>
        </div>
        <span style="font-size: 11px; color: #78716c;">お墓の状態に合わせて選べます</span>
      </div>

      <div class="plans-grid">
        <div class="plan-card">
          <div>
            <div class="plan-name">基本お参りプラン</div>
            <div class="plan-price">¥8,800</div>
          </div>
          <div class="plan-info">落ち葉拾い・水拭き・お線香・完了写真</div>
        </div>

        <div class="plan-card pop">
          <div class="pop-tag">★ 一番人気</div>
          <div>
            <div class="plan-name">標準徹底お掃除プラン</div>
            <div class="plan-price">¥14,800</div>
          </div>
          <div class="plan-info">全面手作業除草・水洗い・生花1対とお線香・詳細写真</div>
        </div>

        <div class="plan-card">
          <div>
            <div class="plan-name">プレミアム美装プラン</div>
            <div class="plan-price">¥29,800</div>
          </div>
          <div class="plan-info">高圧洗浄・撥水コーティング・防草施工・永代供養相談</div>
        </div>
      </div>
    </div>

    <div class="footer-cta">
      <div class="cta-left">
        <div class="cta-vendor">提携窓口: 株式会社トータルエージェント・パートナーズ</div>
        <div class="cta-address">愛媛県松山市土居田町 / 宝塔寺旭ヶ丘霊園ほか市内霊園全域</div>
        <div class="cta-phone-box">
          <span>📞 089-997-XXXX</span>
          <span style="font-size: 10px; color: #57534e; font-weight: normal;">お電話相談受付中</span>
        </div>
      </div>

      <div class="cta-right">
        <img class="qr-box" src="{qr_b64}" alt="QR Code">
        <div class="qr-info">
          <span class="qr-main">スマホで24時間受付</span>
          <span class="qr-sub">簡単Webお申し込み</span>
          <span class="qr-note">カメラで読み取るだけ</span>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
'''

# ==========================================
# 2. A4横 三つ折りリーフレット (297mm x 210mm) - 両面2ページ
# ==========================================
leaflet_html = f'''<!DOCTYPE html>
<html>
<head>
{common_head}
<style>
  @page {{
    size: A4 landscape;
    margin: 0;
  }}
  .sheet {{
    width: 297mm;
    height: 210mm;
    position: relative;
    padding: 10mm 10mm;
    background: #ffffff;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 7mm;
    page-break-after: always;
    overflow: hidden;
  }}
  .sheet:last-child {{
    page-break-after: auto;
  }}

  .panel {{
    border-radius: 14px;
    padding: 14px 16px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    position: relative;
    overflow: hidden;
  }}

  .outside-flap {{
    background: linear-gradient(180deg, #fffbeb 0%, #ffffff 50%, #ecfdf5 100%);
    border: 1.5px solid #fde68a;
  }}
  .pill-amber {{
    background: #fef3c7;
    color: #92400e;
    font-size: 10px;
    font-weight: 800;
    padding: 2px 10px;
    border-radius: 9999px;
    display: inline-block;
  }}
  .flap-title {{
    font-size: 17px;
    font-weight: 900;
    line-height: 1.35;
    margin: 8px 0 6px 0;
    color: #1c1917;
  }}
  .flap-text {{
    font-size: 10.5px;
    color: #57534e;
    line-height: 1.5;
    background: white;
    padding: 10px;
    border-radius: 10px;
    border: 1px solid #f5f5f4;
    margin-bottom: 10px;
  }}
  .box-point {{
    background: white;
    border: 1px solid #a7f3d0;
    border-radius: 10px;
    padding: 8px 10px;
    margin-bottom: 8px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.03);
  }}
  .box-point-title {{
    font-size: 11px;
    font-weight: 800;
    color: #065f46;
    margin-bottom: 2px;
  }}
  .box-point-desc {{
    font-size: 9.5px;
    color: #57534e;
    line-height: 1.4;
  }}

  .outside-back {{
    background: linear-gradient(180deg, #f0f9ff 0%, #ffffff 60%, #fafaf9 100%);
    border: 1.5px solid #bae6fd;
  }}
  .back-vendor-box {{
    background: white;
    border: 1.5px solid #a7f3d0;
    border-radius: 12px;
    padding: 12px;
    margin: 8px 0 10px 0;
    box-shadow: 0 2px 6px rgba(0,0,0,0.04);
  }}
  .back-vendor-name {{
    font-size: 13px;
    font-weight: 900;
    color: #1c1917;
    margin: 4px 0 2px 0;
  }}
  .back-vendor-address {{
    font-size: 10px;
    color: #57534e;
    line-height: 1.4;
  }}
  .back-phone-btn {{
    background: #ecfdf5;
    border: 1.5px solid #34d399;
    color: #065f46;
    font-size: 13px;
    font-weight: 900;
    padding: 6px 12px;
    border-radius: 8px;
    margin-top: 6px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }}
  .cemeteries-list {{
    background: white;
    border: 1px solid #e7e5e4;
    border-radius: 10px;
    padding: 10px;
    font-size: 10px;
    color: #44403c;
    line-height: 1.5;
  }}
  .qr-back-area {{
    background: white;
    border: 1.5px solid #34d399;
    border-radius: 12px;
    padding: 8px;
    text-align: center;
    margin-top: 8px;
  }}

  .outside-cover {{
    background: linear-gradient(135deg, #059669 0%, #0d9488 45%, #0284c7 100%);
    color: white;
    box-shadow: 0 4px 14px rgba(5, 150, 105, 0.25);
  }}
  .cover-top {{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }}
  .cover-heading-area {{
    text-align: center;
    margin: 10px 0;
  }}
  .cover-catch-pill {{
    display: inline-block;
    background: rgba(0,0,0,0.18);
    color: #fef08a;
    font-size: 10px;
    font-weight: 800;
    padding: 3px 10px;
    border-radius: 9999px;
    margin-bottom: 6px;
  }}
  .cover-title {{
    font-size: 20px;
    font-weight: 900;
    line-height: 1.3;
    text-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }}
  .cover-photo-box {{
    background: rgba(255, 255, 255, 0.96);
    border-radius: 12px;
    padding: 10px;
    color: #1c1917;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }}
  .cover-photo-grid {{
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-top: 4px;
  }}
  .cover-photo-grid img {{
    width: 100%;
    height: 76px;
    object-fit: cover;
    border-radius: 6px;
    display: block;
  }}

  .inside-left {{
    background: #ffffff;
    border: 1.5px solid #e7e5e4;
  }}
  .trouble-box {{
    background: #fffbeb;
    border: 1.5px solid #fde68a;
    border-radius: 10px;
    padding: 10px 12px;
    margin: 6px 0 10px 0;
  }}
  .trouble-item {{
    font-size: 10px;
    color: #78350f;
    line-height: 1.5;
    display: flex;
    align-items: flex-start;
    gap: 4px;
  }}
  .step-row {{
    display: flex;
    align-items: center;
    gap: 8px;
    background: #f5f5f4;
    padding: 6px 10px;
    border-radius: 8px;
    margin-bottom: 6px;
    font-size: 10px;
  }}
  .step-num {{
    width: 18px;
    height: 18px;
    background: #059669;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    font-weight: 900;
    flex-shrink: 0;
  }}

  .inside-center {{
    background: linear-gradient(180deg, #ecfdf5 0%, #ffffff 50%, #f0fdf4 100%);
    border: 2px solid #6ee7b7;
  }}
  .plan-card-leaf {{
    background: white;
    border: 1px solid #d6d3d1;
    border-radius: 10px;
    padding: 8px 10px;
    margin-bottom: 8px;
  }}
  .plan-card-leaf.pop {{
    background: linear-gradient(180deg, #fffbeb 0%, #ffffff 100%);
    border: 2px solid #f59e0b;
    box-shadow: 0 2px 6px rgba(245, 158, 11, 0.15);
  }}

  .inside-right {{
    background: #ffffff;
    border: 1.5px solid #e7e5e4;
  }}
  .voice-box {{
    background: linear-gradient(180deg, #fffbeb 0%, #ffffff 100%);
    border: 1.5px solid #fde68a;
    border-radius: 10px;
    padding: 8px 10px;
    margin-top: 6px;
  }}
  .voice-title {{
    font-size: 10.5px;
    font-weight: 800;
    color: #78350f;
    margin-bottom: 2px;
  }}
  .voice-desc {{
    font-size: 9px;
    color: #57534e;
    line-height: 1.35;
  }}
</style>
</head>
<body>
  <!-- 1ページ目：外側3面 -->
  <div class="sheet">
    <div class="panel outside-flap">
      <div>
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span class="pill-amber">ココロモウの想い</span>
          <span style="font-size:9px; color:#a8a29e;">折り込み面</span>
        </div>

        <div class="flap-title">
          遠く離れていても、<br>
          <span style="color:#059669;">ふるさとへの感謝</span>を繋ぎたい。
        </div>

        <div class="flap-text">
          「お墓参りに行けず申し訳ない」「荒れていないか心配」というご家族の想いに応えるため、松山の地元石材パートナーとともに立ち上げました。
        </div>

        <div class="box-point">
          <div class="box-point-title">🤝 単なる清掃ではなく「供養の心」</div>
          <div class="box-point-desc">雑草抜きや水洗いだけでなく、お線香を焚き、生花をお供えし、ご家族に代わって真心を込めて手を合わせます。</div>
        </div>

        <div class="box-point" style="border-color:#bae6fd;">
          <div class="box-point-title" style="color:#0284c7;">🌸 永代供養・墓じまいのご相談も</div>
          <div class="box-point-desc">宝塔寺旭ヶ丘霊園での永代供養や、将来の墓じまい・改葬のご相談もワンストップでお受けいたします。</div>
        </div>
      </div>

      <div style="text-align:center; font-size:10px; font-weight:bold; color:#059669; padding-top:6px; border-top:1px solid #e7e5e4;">
        ▶ ページを開いて詳しいプランをご覧ください
      </div>
    </div>

    <div class="panel outside-back">
      <div>
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div style="display:flex; align-items:center; gap:6px;">
            <div style="width:20px; height:20px; border-radius:50%; background:#059669; color:white; display:flex; align-items:center; justify-content:center; font-size:11px;">🌸</div>
            <span style="font-size:12px; font-weight:800; color:#1c1917;">ココロモウ 提携窓口</span>
          </div>
          <span style="font-size:9px; color:#a8a29e;">裏表紙</span>
        </div>

        <div class="back-vendor-box">
          <span style="background:#d1fae5; color:#065f46; font-size:9.5px; font-weight:800; padding:2px 8px; border-radius:9999px;">愛媛・松山エリア パートナー</span>
          <div class="back-vendor-name">株式会社トータルエージェント・パートナーズ</div>
          <div class="back-vendor-address">
            〒790-0056 愛媛県松山市土居田町<br>
            対応エリア：松山市全域・東温市・伊予市・松前町・砥部町
          </div>
          <div class="back-phone-btn">
            <span>📞 TEL: 089-997-XXXX</span>
          </div>
        </div>

        <div class="cemeteries-list">
          <div style="font-weight:800; color:#065f46; margin-bottom:2px;">【主な対応霊園】</div>
          <div>・宝塔寺 旭ヶ丘霊園（朝日ヶ丘）</div>
          <div>・松山市営霊園（梅津寺・大明神ほか）</div>
          <div>・松山市内各寺院墓地・共同墓地</div>
        </div>
      </div>

      <div class="qr-back-area">
        <img src="{qr_b64}" style="width:50px; height:50px; display:block; margin:0 auto;" alt="QR">
        <div style="font-size:11px; font-weight:900; color:#065f46; margin-top:2px;">Webサイトはこちら</div>
        <div style="font-size:9px; color:#78716c;">24時間いつでも簡単お申し込み</div>
      </div>
    </div>

    <div class="panel outside-cover">
      <div>
        <div class="cover-top">
          <div style="display:flex; align-items:center; gap:6px; background:rgba(255,255,255,0.2); padding:3px 10px; border-radius:9999px;">
            <span style="font-size:13px;">🌸</span>
            <span style="font-size:12px; font-weight:900;">ココロモウ</span>
          </div>
          <span style="background:#f59e0b; color:#1c1917; font-size:10px; font-weight:900; padding:2px 10px; border-radius:9999px;">愛媛・松山版</span>
        </div>

        <div class="cover-heading-area">
          <div class="cover-catch-pill">お墓参り・お掃除代行サービス</div>
          <div class="cover-title">
            ふるさとのお墓を、<br>
            真心を込めて<br>
            <span style="color:#fef08a; text-decoration:underline;">ピカピカに。</span>
          </div>
        </div>

        <div style="font-size:10px; line-height:1.4; text-align:center; color:#f0fdf4; margin-bottom:10px;">
          松山の地元専門パートナーがご家族に代わって丁寧に清掃・合掌。鮮明な写真レポートをお届けします。
        </div>
      </div>

      <div class="cover-photo-box">
        <div style="font-size:9px; font-weight:800; color:#065f46; text-align:center;">宝塔寺 旭ヶ丘霊園 実写モデル施工例</div>
        <div class="cover-photo-grid">
          <div>
            <img src="{grave_before_b64}" alt="Before">
            <div style="font-size:8px; text-align:center; background:#44403c; color:white; padding:2px 0; border-radius:0 0 4px 4px;">作業前</div>
          </div>
          <div>
            <img src="{grave_after_b64}" alt="After">
            <div style="font-size:8px; text-align:center; background:#059669; color:white; font-weight:bold; padding:2px 0; border-radius:0 0 4px 4px;">作業完了後 ✨</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 2ページ目：内側3面（見開きワイド） -->
  <div class="sheet">
    <div class="panel inside-left">
      <div>
        <div style="display:inline-block; background:#fef3c7; color:#92400e; font-size:10px; font-weight:800; padding:2px 10px; border-radius:9999px;">お墓のお困りごと</div>
        <div style="font-size:13px; font-weight:900; margin:6px 0; color:#1c1917;">こんなお悩み、ございませんか？</div>

        <div class="trouble-box">
          <div class="trouble-item"><span>✓</span> 遠方に住んでいてなかなか松山へ帰省できない</div>
          <div class="trouble-item"><span>✓</span> 高齢になり階段や坂道のある墓参りがつらい</div>
          <div class="trouble-item"><span>✓</span> お盆や命日にお墓が荒れていないか心配</div>
        </div>

        <div style="font-size:12px; font-weight:900; color:#065f46; margin-bottom:6px; border-bottom:1.5px solid #a7f3d0; padding-bottom:3px;">
          ご利用の流れ（簡単4ステップ）
        </div>

        <div class="step-row">
          <div class="step-num">1</div>
          <div><strong>Web・お電話でお申し込み</strong><div style="font-size:8.5px; color:#78716c;">霊園名・区画をご指定</div></div>
        </div>
        <div class="step-row">
          <div class="step-num">2</div>
          <div><strong>事前決済（明朗会計）</strong><div style="font-size:8.5px; color:#78716c;">クレジットカード決済対応</div></div>
        </div>
        <div class="step-row">
          <div class="step-num">3</div>
          <div><strong>現地清掃・真心の合掌</strong><div style="font-size:8.5px; color:#78716c;">地元職人が丁寧に施工</div></div>
        </div>
        <div class="step-row">
          <div class="step-num">4</div>
          <div><strong>鮮明な写真レポート</strong><div style="font-size:8.5px; color:#78716c;">スマホで仕上がりを確認</div></div>
        </div>
      </div>

      <div style="font-size:8.5px; color:#a8a29e; text-align:center;">ココロモウ お墓参り代行プラットフォーム</div>
    </div>

    <div class="panel inside-center">
      <div>
        <div style="text-align:center; margin-bottom:6px;">
          <span style="background:#059669; color:white; font-size:10px; font-weight:800; padding:2px 10px; border-radius:9999px;">明朗会計・追加料金なし</span>
          <div style="font-size:14px; font-weight:900; margin-top:3px; color:#1c1917;">選べる3つの代行プラン</div>
        </div>

        <div class="plan-card-leaf">
          <div style="display:flex; justify-content:space-between; align-items:baseline;">
            <span style="font-size:11px; font-weight:800; color:#1c1917;">基本お参りプラン</span>
            <span style="font-size:14px; font-weight:900; color:#1c1917;">¥8,800</span>
          </div>
          <div style="font-size:9px; color:#78716c; margin-top:2px;">落ち葉拾い・墓石水拭き・お線香合掌・完了写真</div>
        </div>

        <div class="plan-card-leaf pop">
          <div style="display:flex; justify-content:space-between; align-items:baseline;">
            <div style="display:flex; align-items:center; gap:4px;">
              <span style="background:#f59e0b; color:#1c1917; font-size:8px; font-weight:900; padding:1px 5px; border-radius:4px;">一番人気</span>
              <span style="font-size:11px; font-weight:900; color:#78350f;">標準徹底お掃除プラン</span>
            </div>
            <span style="font-size:17px; font-weight:900; color:#065f46;">¥14,800</span>
          </div>
          <div style="font-size:9.5px; font-weight:700; color:#064e3b; margin-top:2px;">全面手作業除草・水洗い・生花1対とお線香・詳細写真</div>
        </div>

        <div class="plan-card-leaf">
          <div style="display:flex; justify-content:space-between; align-items:baseline;">
            <span style="font-size:11px; font-weight:800; color:#1c1917;">プレミアム美装プラン</span>
            <span style="font-size:14px; font-weight:900; color:#1c1917;">¥29,800</span>
          </div>
          <div style="font-size:9px; color:#78716c; margin-top:2px;">高圧洗浄・墓石撥水コーティング・防草施工・永代供養相談</div>
        </div>
      </div>

      <div style="background:white; border:1px solid #a7f3d0; border-radius:8px; padding:6px; text-align:center; font-size:9px; color:#065f46;">
        ※ 墓地の広さ（1坪以上）や追加のご要望にも柔軟に対応いたします
      </div>
    </div>

    <div class="panel inside-right">
      <div>
        <div style="font-size:13px; font-weight:900; color:#1c1917; margin-bottom:6px;">⭐ 施工実例とお客さまの声</div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px; margin-bottom:8px;">
          <div style="border:1px solid #e7e5e4; border-radius:8px; overflow:hidden;">
            <img src="{grave_before_b64}" style="width:100%; height:55px; object-fit:cover; display:block;" alt="Before">
            <div style="font-size:8px; text-align:center; background:#f5f5f4; color:#57534e; padding:1px 0;">作業前</div>
          </div>
          <div style="border:1.5px solid #10b981; border-radius:8px; overflow:hidden;">
            <img src="{grave_after_b64}" style="width:100%; height:55px; object-fit:cover; display:block;" alt="After">
            <div style="font-size:8px; text-align:center; background:#ecfdf5; color:#065f46; font-weight:bold; padding:1px 0;">作業完了後 ✨</div>
          </div>
        </div>

        <div class="voice-box">
          <div class="voice-title">😊「届いた写真を見て家族で感動」</div>
          <div class="voice-desc">東京在住で帰省できず心配でしたが、ピカピカになりお花が供えられた写真に涙が出ました。（50代女性・宝塔寺旭ヶ丘霊園）</div>
        </div>

        <div class="voice-box" style="margin-top:6px;">
          <div class="voice-title">😊「点検所見まで親切丁寧」</div>
          <div class="voice-desc">足腰が悪く墓参りが難しかったのですが、目地の劣化点検まで添えていただき安心でした。（60代男性）</div>
        </div>
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid #e7e5e4; padding-top:6px;">
        <span style="font-size:9px; color:#78716c;">Web・お電話で受付中</span>
        <span style="background:#d1fae5; color:#065f46; font-size:9.5px; font-weight:800; padding:2px 8px; border-radius:9999px;">年中無休受付</span>
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

print("HTML templates saved successfully")

chrome_path = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

cmd_poster = [
    chrome_path,
    "--headless=new",
    "--disable-gpu",
    "--no-pdf-header-footer",
    "--print-to-pdf=public/pdf/kokoromou_poster_a4.pdf",
    "file:///tmp/kokoromou_poster.html"
]
subprocess.run(cmd_poster, check=True)
print("Generated public/pdf/kokoromou_poster_a4.pdf")

cmd_leaflet = [
    chrome_path,
    "--headless=new",
    "--disable-gpu",
    "--no-pdf-header-footer",
    "--print-to-pdf=public/pdf/kokoromou_leaflet_trifold.pdf",
    "file:///tmp/kokoromou_leaflet.html"
]
subprocess.run(cmd_leaflet, check=True)
print("Generated public/pdf/kokoromou_leaflet_trifold.pdf")
