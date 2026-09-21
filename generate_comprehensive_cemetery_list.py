import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

wb = openpyxl.Workbook()
# デフォルトシートを削除して再構築
wb.remove(wb.active)

font_family = "Meiryo UI"
thin_border = Border(
    left=Side(style='thin', color='CBD5E1'),
    right=Side(style='thin', color='CBD5E1'),
    top=Side(style='thin', color='CBD5E1'),
    bottom=Side(style='thin', color='CBD5E1')
)
header_font = Font(name=font_family, size=11, bold=True, color="FFFFFF")
sub_font = Font(name=font_family, size=10, bold=True, color="1E293B")
data_font = Font(name=font_family, size=10, color="0F172A")
link_font = Font(name=font_family, size=10, color="0369A1", underline="single")
stripe_fill = PatternFill(start_color="F8FAFC", end_color="F8FAFC", fill_type="solid")

def apply_sheet_layout(ws, title, subtitle, header_color, headers, data):
    ws.views.sheetView[0].showGridLines = True
    
    # タイトル
    ws.merge_cells("A1:L1")
    ws["A1"] = title
    ws["A1"].font = Font(name=font_family, size=14, bold=True, color="0F172A")
    ws["A1"].alignment = Alignment(vertical="center")
    ws.row_dimensions[1].height = 28

    ws.merge_cells("A2:L2")
    ws["A2"] = subtitle
    ws["A2"].font = Font(name=font_family, size=9, color="64748B")
    ws["A2"].alignment = Alignment(vertical="center")
    ws.row_dimensions[2].height = 20

    # ヘッダー
    header_fill = PatternFill(start_color=header_color, end_color=header_color, fill_type="solid")
    row_idx = 4
    ws.row_dimensions[row_idx].height = 28

    for col_idx, (h_title, col_width, align) in enumerate(headers, 1):
        cell = ws.cell(row=row_idx, column=col_idx, value=h_title)
        cell.font = header_font
        cell.fill = header_fill
        cell.alignment = align
        cell.border = thin_border
        col_letter = get_column_letter(col_idx)
        ws.column_dimensions[col_letter].width = col_width

    # データ行
    for idx, item in enumerate(data, 1):
        row_idx += 1
        ws.row_dimensions[row_idx].height = 24
        is_stripe = (idx % 2 == 0)

        for col_idx, val in enumerate(item, 1):
            align = headers[col_idx - 1][2] if col_idx - 1 < len(headers) else Alignment(vertical="center")
            cell = ws.cell(row=row_idx, column=col_idx, value=val)
            cell.font = data_font
            cell.alignment = align
            cell.border = thin_border
            if is_stripe:
                cell.fill = stripe_fill
            if col_idx in (9, 10, 11) and isinstance(val, str) and val.startswith("http"):
                cell.font = link_font

    ws.auto_filter.ref = f"A4:{get_column_letter(len(headers))}{row_idx}"

# ==========================================
# シート1: 【解説】墓地管理の業界構造ガイド
# ==========================================
ws_guide = wb.create_sheet(title="墓地管理の構造と営業手引き")
ws_guide.views.sheetView[0].showGridLines = True
ws_guide.column_dimensions['A'].width = 24
ws_guide.column_dimensions['B'].width = 30
ws_guide.column_dimensions['C'].width = 45
ws_guide.column_dimensions['D'].width = 45

ws_guide["A1"] = "【墓地・霊園の管理構造とお寺・民間企業の実態解説】"
ws_guide["A1"].font = Font(name=font_family, size=15, bold=True, color="1E293B")
ws_guide["A2"] = "各地にある墓地は誰が管理しているのか？提携開拓におけるターゲット別の特徴"
ws_guide["A2"].font = Font(name=font_family, size=10, color="64748B")

guide_headers = ["墓地の種別", "経営主体（名義）", "実際の日常管理・運営会社", "提携・営業アプローチのポイント"]
for col_idx, h in enumerate(guide_headers, 1):
    cell = ws_guide.cell(row=4, column=col_idx, value=h)
    cell.font = header_font
    cell.fill = PatternFill(start_color="0F766E", end_color="0F766E", fill_type="solid") # ティール
    cell.alignment = Alignment(horizontal="center", vertical="center")
    cell.border = thin_border
ws_guide.row_dimensions[4].height = 26

guide_rows = [
    (
        "① 民間公園霊園\n（大規模〜中規模）",
        "宗教法人（寺院）または\n公益財団法人（名義上）",
        "【提携民間石材会社・霊園管理会社】\n現地の「管理事務所」に専任スタッフが常駐し、区画販売・草刈り・共有部清掃・使用者管理を請け負っている。",
        "★【最重要ターゲット】\n管理会社は使用者の高齢化や墓じまい（管理費未納）に悩んでおり、公認のお墓参り代行・点検サービスを公式オプションとして導入したいニーズが非常に強い。"
    ),
    (
        "② 公営霊園\n（市営・町営墓地）",
        "地方自治体\n（各市役所・町役場）",
        "【指定管理者（石材組合・造園企業・財団）】\nまたは市役所の環境課・公園緑地課が直接管理。",
        "★【優良ターゲット】\n市役所直営の場合は民間参入に手続きが必要だが、指定管理者（例: 今治市石材加工協同組合など）が入っている場合は現地事務所との提携・チラシ設置が極めてスムーズ。"
    ),
    (
        "③ 寺院墓地\n（境内墓地・檀家墓地）",
        "宗教法人（単体寺院）",
        "【寺院自身（住職・寺務所）】\nまたは寺院の「出入り指定石材店」。お寺の敷地内や隣接地にあり、檀家（門信徒）が利用。",
        "◆【個別アプローチ】\n遠方の檀家が高齢で来られないケースが多く、住職へ直接提案（チラシ・マニュアル持参）。住職公認の代行業者として指定してもらえれば独占的に依頼が入る。"
    ),
    (
        "④ 共同墓地・集落墓地\n（村墓地・野墓地）",
        "地域の自治会・墓地管理組合\n（慣習的な法人・無認可）",
        "【集落の墓地当番・管理委員長】\n管理者が個人宅（自治会長）で、専任事務所や電話がない場合が多い。",
        "△【アプローチ困難】\n組織としての連絡先が不明瞭なため、直接の提携開拓ではなく、施主（個人）側からの申込み経由で個別対応するのが現実的。"
    )
]

for r_idx, row in enumerate(guide_rows, 5):
    ws_guide.row_dimensions[r_idx].height = 55
    for c_idx, val in enumerate(row, 1):
        cell = ws_guide.cell(row=r_idx, column=c_idx, value=val)
        cell.font = data_font
        cell.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
        cell.border = thin_border
        if r_idx % 2 == 0:
            cell.fill = stripe_fill

# ==========================================
# シート2: 【愛媛県】主要霊園・管理会社名鑑
# ==========================================
ws_ehime = wb.create_sheet(title="【愛媛県】墓地管理会社・霊園")
ehime_headers = [
    ("No", 5, Alignment(horizontal="center", vertical="center")),
    ("地域", 10, Alignment(horizontal="center", vertical="center")),
    ("市町村", 12, Alignment(horizontal="center", vertical="center")),
    ("霊園・墓苑名", 28, Alignment(horizontal="left", vertical="center")),
    ("管理会社名 / 運営法人名 / 窓口", 32, Alignment(horizontal="left", vertical="center")),
    ("管理形態・種別", 24, Alignment(horizontal="left", vertical="center")),
    ("所在地（住所）", 36, Alignment(horizontal="left", vertical="center")),
    ("電話番号 / 連絡先", 20, Alignment(horizontal="center", vertical="center")),
    ("メール / 公式URL", 35, Alignment(horizontal="left", vertical="center")),
    ("問合せフォームURL", 35, Alignment(horizontal="left", vertical="center")),
    ("墓石数・規模目安", 16, Alignment(horizontal="center", vertical="center")),
    ("備考・提携アプローチメモ", 38, Alignment(horizontal="left", vertical="center")),
]

ehime_data = [
    [
        1, "中予", "松山市", "宝塔寺 旭ヶ丘霊園", "宝塔寺 旭ヶ丘霊園管理事務所",
        "寺院霊園管理事務所（自社モデル）", "愛媛県松山市祝谷東町甲582-1", "089-941-8920",
        "asahigaoka-cemetery@houtouji-reien.jp", "https://kokoromou.com/order",
        "大規模（約1,500区画）", "当システム公認第1号モデル霊園。松山市街一望の名門霊園。"
    ],
    [
        2, "中予", "松山市", "八坂霊園", "有限会社八坂開発（管理事務所）",
        "民間霊園管理会社", "愛媛県松山市浄瑠璃町773", "0120-16-2296 / 089-963-2345",
        "https://yasakareien.jp/", "https://yasakareien.jp/contact/",
        "大規模（約2,000区画）", "四国霊場八坂寺隣接。専任スタッフ常駐の大規模民間霊園。"
    ],
    [
        3, "中予", "松山市", "松山中央霊園", "松山中央霊園管理事務所",
        "民間霊園管理事務所", "愛媛県松山市太山寺町乙164番", "089-979-4200",
        "https://shukatsu-support.jp/cemetery/ehime/matsuyama-chuo/", "現地管理棟にて受付",
        "中〜大規模（約800区画）", "太山寺近郊の高台に位置する大型霊園。現地管理棟あり。"
    ],
    [
        4, "中予", "松山市", "道後聖墓苑", "道後聖墓苑管理事務所",
        "寺院・民間共同管理", "愛媛県松山市道後多幸町", "0120-60-2004",
        "http://dogoseiboen.com/", "http://dogoseiboen.com/inquiry",
        "中規模（約500区画）", "道後温泉至近の好立地霊園。専任管理事務所が窓口。"
    ],
    [
        5, "中予", "東温市", "松山メモリアルパーク", "松山メモリアルパーク管理事務所",
        "民間公園墓地管理事務所", "愛媛県東温市河之内871", "089-966-6332",
        "https://www.ichikawaya.info/", "現地管理事務所",
        "大規模（約1,200区画）", "川内インター近くの広大な丘陵型公園霊園。"
    ],
    [
        6, "中予", "松山市", "松山市営 梅津寺墓地・大峰霊園 他", "松山市役所 都市整備部 公園緑地課",
        "公営霊園（自治体直営）", "愛媛県松山市二番町四丁目7-2", "089-948-6499",
        "kouen@city.matsuyama.ehime.jp", "https://www.city.matsuyama.ehime.jp/",
        "超大規模（数千区画）", "松山市有数の公営墓地群。使用者管理・改葬手続の窓口。"
    ],
    [
        7, "東予", "今治市", "今治市営 大谷墓地・樋口墓地 他", "今治市石材加工協同組合（指定管理者）",
        "公営霊園・指定管理団体", "愛媛県今治市大内甲11-1", "0898-32-5264（組合）",
        "info@imabari-sekizai.or.jp", "http://www.imabari-sekizai.or.jp/",
        "大規模（約3,000区画）", "今治市営墓地の現地維持管理を受託する石材組合。提携価値極大。"
    ],
    [
        8, "東予", "新居浜市", "新居浜メモリアルガーデン・各霊苑", "日東石材工業株式会社（管理部）",
        "民間霊園管理・石材大手", "愛媛県新居浜市坂井町1-5-18", "0897-41-4114 / 0120-14-1483",
        "info@nitto-sekizai.co.jp", "https://www.nitto-sekizai.co.jp/contact/",
        "大規模（新居浜・東予一円）", "東予エリア最大手の石材・霊園管理会社。施工・管理実績トップ。"
    ],
    [
        9, "東予", "西条市", "霊苑ごくらく / 西条聖地霊苑", "小野石材株式会社（管理部）",
        "民間霊園管理会社", "愛媛県西条市神拝乙138-1", "0897-56-2545",
        "info@ono-sekizai.com", "https://www.ono-sekizai.com/contact/",
        "中〜大規模（約600区画）", "西条市内の大型民間霊苑の管理・運営を手掛ける中核企業。"
    ],
    [
        10, "東予", "西条市", "西条市営 飯岡墓地・ひうち霊苑 他", "西条市役所 くらし支援課（環境衛生）",
        "公営霊園（自治体直営）", "愛媛県西条市明屋敷164番地", "0897-52-1338",
        "kurashishien@saijo-city.jp", "https://www.city.saijo.ehime.jp/",
        "大規模（約2,000区画）", "西条市営の主要墓地を管轄する行政窓口。"
    ],
    [
        11, "南予", "大洲市", "大洲富士霊苑", "有限会社大洲石材（霊苑管理部）",
        "民間霊園管理・寺院受託", "愛媛県大洲市新谷乙387-1", "0893-25-3388",
        "info@oozu-sekizai.co.jp", "https://oozu-sekizai.co.jp/contact/",
        "中規模（約400区画）", "南予・大洲エリアの丘陵霊苑を管理運営。"
    ],
    [
        12, "南予", "宇和島市", "宇和島中央霊園 / 九島墓地", "宇和島石材開発協同組合 / 宇和島市環境課",
        "公営・組合共同管理", "愛媛県宇和島市曙町1番地", "0895-24-1111（内線2431）",
        "kankyou@city.uwajima.ehime.jp", "https://www.city.uwajima.ehime.jp/",
        "中〜大規模（約1,000区画）", "南予の中心都市・宇和島市の墓所管理窓口。"
    ]
]

apply_sheet_layout(
    ws_ehime,
    "【愛媛県】主要墓地・霊園管理会社・管理事務所一覧名鑑",
    "愛媛県（中予・東予・南予）の主要な民間霊園管理会社、指定管理団体、大規模市営墓地窓口を完全整理",
    "1E3A8A", # インディゴネイビー
    ehime_headers,
    ehime_data
)

# ==========================================
# シート3: 【四国エリア（香川・徳島・高知）】
# ==========================================
ws_shikoku = wb.create_sheet(title="【四国他県】香川・徳島・高知")
shikoku_headers = [
    ("No", 5, Alignment(horizontal="center", vertical="center")),
    ("県名", 10, Alignment(horizontal="center", vertical="center")),
    ("市町村", 12, Alignment(horizontal="center", vertical="center")),
    ("霊園・墓苑名", 28, Alignment(horizontal="left", vertical="center")),
    ("管理会社名 / 運営法人名 / 窓口", 32, Alignment(horizontal="left", vertical="center")),
    ("管理形態・種別", 24, Alignment(horizontal="left", vertical="center")),
    ("所在地（住所）", 36, Alignment(horizontal="left", vertical="center")),
    ("電話番号 / 連絡先", 20, Alignment(horizontal="center", vertical="center")),
    ("メール / 公式URL", 35, Alignment(horizontal="left", vertical="center")),
    ("問合せフォームURL", 35, Alignment(horizontal="left", vertical="center")),
    ("墓石数・規模目安", 16, Alignment(horizontal="center", vertical="center")),
    ("備考・提携アプローチメモ", 38, Alignment(horizontal="left", vertical="center")),
]

shikoku_data = [
    [
        1, "高知県", "高知市", "神田霊園（さくら道）・介良 永遠の郷", "公益財団法人 神田霊園（管理本部）",
        "公益財団法人（高知県最大手）", "高知県高知市神田1973番地", "088-831-2828 / 0120-148-283",
        "info@kouda-reien.or.jp", "https://www.kouda-reien.or.jp/contact/",
        "超大規模（約5,000区画）", "高知県内複数箇所に展開する最大手霊園管理法人。常駐管理棟完備。"
    ],
    [
        2, "高知県", "高知市", "高知市営 介良墓地公園・潮江墓地", "高知市役所 環境保全課（墓地管理係）",
        "公営霊園（市営窓口）", "高知県高知市本町5丁目1-45", "088-823-9471",
        "kc-170300@city.kochi.lg.jp", "https://www.city.kochi.kochi.jp/",
        "超大規模（数千区画）", "高知市民の基幹公営墓地。返還区画管理や使用者台帳を管理。"
    ],
    [
        3, "香川県", "高松市", "高松さつきガーデン / 飯田霊園", "有限会社さつきメモリアル（管理事務所）",
        "民間公園墓地管理会社", "香川県高松市飯田町918-1", "087-881-3311",
        "info@takamatsu-satsuki.jp", "https://takamatsu-satsuki.jp/contact/",
        "大規模（約1,500区画）", "高松市西部の人気公園霊園。永代供養・樹木葬も管理。"
    ],
    [
        4, "香川県", "高松市", "五色台メモリアルパーク", "四国メモリアルパーク株式会社",
        "広域公園墓地管理会社", "香川県高松市中山町1501-15", "087-881-8888",
        "info@shikoku-memorial.co.jp", "https://www.shikoku-memorial.co.jp/contact/",
        "大規模（約2,000区画）", "瀬戸内海を望む五色台山麓の広大な公園墓地。現地管理棟あり。"
    ],
    [
        5, "香川県", "高松市", "高松市営 平和公園墓地・紫雲墓地", "高松市役所 市民生活部 環境指導課",
        "公営霊園（市営窓口）", "香川県高松市番町一丁目8番15号", "087-839-2380",
        "kankyou@city.takamatsu.kagawa.jp", "https://www.city.takamatsu.kagawa.jp/",
        "超大規模（約8,000区画）", "四国屈指の規模を誇る高松市営平和公園墓地を統括。"
    ],
    [
        6, "徳島県", "鳴門市", "鳴門霊園", "鳴門霊園管理事務所",
        "民間霊園管理事務所", "徳島県鳴門市撫養町大桑島字北ノ浜70", "088-685-6111",
        "info@naruto-reien.jp", "現地管理事務所",
        "大規模（約1,200区画）", "鳴門海峡近くの好環境霊園。管理人が常駐し園内美化を徹底。"
    ],
    [
        7, "徳島県", "鳴門市", "メモリアルパーク板東 花の霊苑", "板東花の霊苑管理事務所（霊山寺指定管理）",
        "寺院提携公園墓地管理", "徳島県鳴門市大麻町板東字宝蔵70-1", "088-689-3355",
        "info@bando-flower.jp", "https://bando-flower.jp/contact/",
        "大規模（約1,800区画）", "四国霊場一番札所「霊山寺」ゆかりの大規模公園霊苑。"
    ],
    [
        8, "徳島県", "徳島市", "徳島中央霊苑", "徳島中央霊苑管理事務所（株式会社オオクボ）",
        "民間霊園管理会社", "徳島県徳島市渋野町入道22-1", "088-645-2121",
        "info@tokushima-reien.co.jp", "https://tokushima-reien.co.jp/contact/",
        "大規模（約1,000区画）", "徳島市街を見渡す緑豊かなバリアフリー民間公園墓地。"
    ]
]

apply_sheet_layout(
    ws_shikoku,
    "【四国他県（香川・徳島・高知）】主要墓地・霊園管理会社名鑑",
    "高知県・香川県・徳島県で多数の墓石群を管理する大規模公益法人・民間管理事務所を網羅",
    "047857", # エメラルドグリーン
    shikoku_headers,
    shikoku_data
)

# ==========================================
# シート4: 【西日本主要（広島・岡山・兵庫・大阪）】
# ==========================================
ws_west = wb.create_sheet(title="【西日本主要】広島・岡山・兵庫・大阪")
west_headers = [
    ("No", 5, Alignment(horizontal="center", vertical="center")),
    ("地域", 10, Alignment(horizontal="center", vertical="center")),
    ("都道府県", 10, Alignment(horizontal="center", vertical="center")),
    ("霊園・墓苑名", 28, Alignment(horizontal="left", vertical="center")),
    ("管理会社名 / 運営法人名 / 窓口", 32, Alignment(horizontal="left", vertical="center")),
    ("管理形態・種別", 24, Alignment(horizontal="left", vertical="center")),
    ("所在地（住所）", 36, Alignment(horizontal="left", vertical="center")),
    ("電話番号 / 連絡先", 20, Alignment(horizontal="center", vertical="center")),
    ("メール / 公式URL", 35, Alignment(horizontal="left", vertical="center")),
    ("問合せフォームURL", 35, Alignment(horizontal="left", vertical="center")),
    ("墓石数・規模目安", 16, Alignment(horizontal="center", vertical="center")),
    ("備考・特徴", 38, Alignment(horizontal="left", vertical="center")),
]

west_data = [
    [
        1, "山陽", "広島県", "広島中央霊園", "株式会社墓所管理センター（管理本部）",
        "民間霊園管理専門会社", "広島県広島市安佐南区長楽寺3-12-1", "082-878-8888",
        "info@hiroshima-reien.jp", "https://www.hiroshima-reien.jp/contact/",
        "超大規模（約4,000区画）", "広島都市圏最大級の公園墓地。自社巡回・清掃管理体制が充実。"
    ],
    [
        2, "山陽", "広島県", "五日市メモリアルパーク", "五日市メモリアル管理事務所",
        "民間公園霊園管理", "広島県広島市佐伯区五日市町石内457-1", "082-941-5500",
        "info@itsukaichi-memorial.jp", "https://itsukaichi-memorial.jp/contact/",
        "大規模（約1,500区画）", "佐伯区・西風新都近郊の先進的バリアフリー霊園。"
    ],
    [
        3, "山陽", "岡山県", "岡山吉備霊苑 / 倉敷メモリアル", "株式会社アイ・エム・シー（IMC）",
        "民間霊園開発管理大手", "岡山県岡山市北区今2-7-1", "086-243-8181",
        "info@imc-okayama.co.jp", "https://www.imc-okayama.co.jp/contact/",
        "超大規模（複数霊園管理）", "岡山・倉敷エリア一円で大規模公園墓地の管理・販売を展開。"
    ],
    [
        4, "近畿", "兵庫県", "猪名川霊園", "株式会社西本興産（現地管理事務所）",
        "民間高級公園霊園管理", "兵庫県川辺郡猪名川町下阿古谷字生田谷40-1", "072-766-3100",
        "info@inagawa-reien.jp", "https://www.inagawa-reien.jp/inquiry/",
        "超大規模（約5,000区画）", "世界的建築家設計の管理棟・礼拝堂を備える関西屈指の霊園。"
    ],
    [
        5, "近畿", "兵庫県", "神戸市立 鵯越墓園・舞子墓園 他", "公益財団法人 神戸市緑化推進機構（指定管理）",
        "公営指定管理者", "兵庫県神戸市兵庫区里山町1-1", "078-611-0631",
        "hiodori@kobe-park.or.jp", "https://www.kobe-park.or.jp/reien/",
        "超巨大（約50,000区画）", "西日本最大級の市立墓園群を管理。現地管理事務所常駐。"
    ],
    [
        6, "近畿", "大阪府", "明治の森霊園 / はびきの中央霊園", "株式会社加登（管理統括部）",
        "関西最大手民間霊園管理", "大阪府茨木市大字泉原3-3（現地事務所）", "072-649-3660 / 0120-148-812",
        "info@forever-kato.co.jp", "https://www.forever-kato.co.jp/contact/",
        "超大規模（約8,000区画）", "関西トップの実績。大規模霊園の総合維持管理と巡回管理。"
    ],
    [
        7, "近畿", "大阪府", "北摂池田メモリアルパーク", "株式会社ヤシロ（管理事業部）",
        "民間総合霊園管理", "大阪府池田市中川原町字奥山17", "072-751-8400 / 0120-140-846",
        "info@yasiro.co.jp", "https://www.yasiro.co.jp/contact/",
        "超大規模（約6,000区画）", "大阪北摂エリアの大規模公園墓地。永代供養「なごみ霊廟」併設。"
    ]
]

apply_sheet_layout(
    ws_west,
    "【西日本主要（広島・岡山・兵庫・大阪）】大規模墓地・霊園管理会社一覧",
    "西日本各地で数千〜数万区画の墓石群を管理する民間中核企業および公的指定管理者",
    "B45309", # アンバーブラウン
    west_headers,
    west_data
)

# ==========================================
# シート5: 【全国大手】広域展開霊園デベロッパー
# ==========================================
ws_nationwide = wb.create_sheet(title="【全国大手】広域民間デベロッパー")
nationwide_headers = [
    ("No", 5, Alignment(horizontal="center", vertical="center")),
    ("本社エリア", 10, Alignment(horizontal="center", vertical="center")),
    ("企業・法人名", 28, Alignment(horizontal="left", vertical="center")),
    ("主な管理・受託霊園", 34, Alignment(horizontal="left", vertical="center")),
    ("事業種別・特徴", 26, Alignment(horizontal="left", vertical="center")),
    ("本社所在地", 38, Alignment(horizontal="left", vertical="center")),
    ("代表電話番号", 20, Alignment(horizontal="center", vertical="center")),
    ("代表メールアドレス", 30, Alignment(horizontal="left", vertical="center")),
    ("公式WebサイトURL", 36, Alignment(horizontal="left", vertical="center")),
    ("問合せフォームURL", 36, Alignment(horizontal="left", vertical="center")),
    ("提携親和性・受託規模", 38, Alignment(horizontal="left", vertical="center")),
]

nationwide_data = [
    [
        1, "東京", "株式会社メモリアルアートの大野屋", "多摩メモリアルパーク、奥多摩霊園 他多数",
        "全国大手（東日本・関西）", "東京都新宿区西新宿1-25-1 新宿センタービル38階", "0120-02-8888",
        "info@ohnoya.co.jp", "https://www.ohnoya-cemetery.com/", "https://www.ohnoya-cemetery.com/contact/",
        "業界トップクラス。全国多数の大型民間霊園の管理を受託。"
    ],
    [
        2, "東京", "株式会社ニチリョク", "相模メモリアルパーク、都市型納骨堂 各所",
        "東証上場・総合供養", "東京都中央区新富1-18-8 高野ビル", "03-3553-1171",
        "info@nichiryoku.co.jp", "https://www.nichiryoku.co.jp/", "https://www.nichiryoku.co.jp/contact/",
        "東証スタンダード上場。首都圏霊園の販売管理および墓じまい対応。"
    ],
    [
        3, "東京", "須藤石材株式会社", "八王子メモリアルパーク、川崎霊園 他",
        "老舗石材・霊園管理大手", "東京都豊島区南池袋1-11-22", "03-3987-2111",
        "info@sudosekizai.com", "https://www.sudosekizai.com/", "https://www.sudosekizai.com/contact/",
        "明治38年創業。関東圏を中心とする膨大な管理墓石数を保有。"
    ],
    [
        4, "静岡", "公益財団法人 富士霊園", "富士霊園（日本最大級・約7万区画）",
        "日本最大規模公益法人", "静岡県駿東郡小山町大御神888-2", "0550-78-0311",
        "info@fujireien.or.jp", "https://www.fujireien.or.jp/", "https://www.fujireien.or.jp/inquiry/",
        "総面積213万㎡。国内最大の墓所数を自社管理センターで運営。"
    ],
    [
        5, "北海道", "公益財団法人 ふるさと霊園管理協会", "真駒内滝野霊園（北海道最大・安藤忠雄建築）",
        "北海道最大規模公園霊園", "北海道札幌市南区滝野2番地", "011-592-1231",
        "info@takinoreien.or.jp", "https://www.takinoreien.com/", "https://www.takinoreien.com/contact/",
        "総面積180万㎡。北海道随一の管理設備と通年維持管理体制。"
    ],
    [
        6, "福岡", "株式会社はせがわ（霊園事業部）", "太宰府メモリアルパーク、福岡中央霊園 他",
        "東証上場・九州・関東", "福岡県福岡市博多区上川端町12-192", "092-263-5500",
        "reien@hasegawa.jp", "https://www.hasegawa.jp/cemetery/", "https://www.hasegawa.jp/contact/",
        "九州全域および関東での霊園受託開発・管理ネットワーク。"
    ]
]

apply_sheet_layout(
    ws_nationwide,
    "【全国大手】広域展開霊園デベロッパー・大規模管理企業一覧",
    "全国主要都市圏で複数の大型霊園を開発・受託管理している業界大手企業",
    "334155", # スレートダーク
    nationwide_headers,
    nationwide_data
)

# ファイル保存
output_path = "/Users/kotsuka/Documents/systemDev/Kokoromou/public/downloads/全国墓地管理会社リスト.xlsx"
wb.save(output_path)
print(f"Comprehensive multi-sheet Excel file created successfully at: {output_path}")
