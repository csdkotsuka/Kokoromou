import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

# 墓地管理会社・霊園運営法人の全国リストデータ
cemetery_companies = [
    # --- 関東エリア ---
    {
        "area": "関東",
        "prefecture": "東京都",
        "company_name": "株式会社メモリアルアートの大野屋",
        "cemetery_name": "多摩メモリアルパーク、奥多摩霊園、メモリアルフォレスト多摩 他",
        "category": "民間霊園管理・開発（全国大手）",
        "postal_code": "〒163-0638",
        "address": "東京都新宿区西新宿1-25-1 新宿センタービル38階",
        "tel": "0120-02-8888 / 03-6890-2777",
        "email": "info@ohnoya.co.jp",
        "website": "https://www.ohnoya-cemetery.com/",
        "contact_form": "https://www.ohnoya-cemetery.com/contact/",
        "notes": "1939年創業。首都圏・関西を中心に大規模公園墓地の開発・管理・受託運営を展開する業界最大手。"
    },
    {
        "area": "関東",
        "prefecture": "東京都",
        "company_name": "株式会社ニチリョク",
        "cemetery_name": "赤坂浄苑、大森御廟、相模メモリアルパーク 他",
        "category": "民間霊園・自動搬送式納骨堂管理（東証上場）",
        "postal_code": "〒104-0041",
        "address": "東京都中央区新富1-18-8 高野ビル",
        "tel": "03-3553-1171 / 0120-17-7389",
        "email": "info@nichiryoku.co.jp",
        "website": "https://www.nichiryoku.co.jp/",
        "contact_form": "https://www.nichiryoku.co.jp/contact/",
        "notes": "東証スタンダード上場。首都圏の大規模民間霊園の管理受託および最新式堂内陵墓の管理運営。"
    },
    {
        "area": "関東",
        "prefecture": "東京都",
        "company_name": "須藤石材株式会社",
        "cemetery_name": "八王子メモリアルパーク、さいたま聖地霊園、川崎霊園 他",
        "category": "民間霊園管理・石材大手（老舗）",
        "postal_code": "〒171-0022",
        "address": "東京都豊島区南池袋1-11-22",
        "tel": "03-3987-2111 / 0120-00-5900",
        "email": "info@sudosekizai.com",
        "website": "https://www.sudosekizai.com/",
        "contact_form": "https://www.sudosekizai.com/contact/",
        "notes": "明治38年創業。関東1都6県で多数の大型公園墓地・霊園の管理事務所を運営。"
    },
    {
        "area": "関東",
        "prefecture": "東京都",
        "company_name": "公益財団法人東京都公園協会 霊園課",
        "cemetery_name": "都立青山霊園、都立谷中霊園、都立染井霊園、都立多磨霊園、都立八柱霊園、都立小平霊園、都立八王子霊園 他",
        "category": "公益財団法人・指定管理者（都立霊園）",
        "postal_code": "〒160-0021",
        "address": "東京都新宿区歌舞伎町2-44-1 ハイジア9・10階",
        "tel": "03-3232-3151（代表）",
        "email": "reien-info@tokyo-park.or.jp",
        "website": "https://www.tokyo-park.or.jp/reien/",
        "contact_form": "https://www.tokyo-park.or.jp/inquiry/",
        "notes": "東京都立の全8霊園（約28万区画）の維持管理・使用者管理業務を受託・統括。"
    },
    {
        "area": "関東",
        "prefecture": "神奈川県",
        "company_name": "株式会社石長（いしちょう）",
        "cemetery_name": "鎌倉霊園、湘南メモリアルガーデン、港の見える丘霊園 他",
        "category": "民間霊園管理・受託運営",
        "postal_code": "〒248-0006",
        "address": "神奈川県鎌倉市小町2-14-8",
        "tel": "0467-22-3100 / 0120-148-080",
        "email": "info@ishicho.co.jp",
        "website": "https://www.ishicho.co.jp/",
        "contact_form": "https://www.ishicho.co.jp/inquiry/",
        "notes": "400年以上の歴史を持つ老舗。神奈川県内・都内の大型公園墓地管理運営を主導。"
    },
    {
        "area": "関東",
        "prefecture": "埼玉県",
        "company_name": "株式会社大成（メモリアル事業部）",
        "cemetery_name": "メモリアルグリーン蓮田、埼玉メモリアルパーク 他",
        "category": "民間霊園管理・開発",
        "postal_code": "〒330-0854",
        "address": "埼玉県さいたま市大宮区桜木町4-247",
        "tel": "048-644-8800",
        "email": "support@taisei-memorial.jp",
        "website": "https://www.taisei-memorial.jp/",
        "contact_form": "https://www.taisei-memorial.jp/contact/",
        "notes": "埼玉県内および北関東エリアのガーデニング霊園・樹木葬墓地の開発・管理。"
    },
    {
        "area": "関東",
        "prefecture": "千葉県",
        "company_name": "株式会社ユー花園（霊園環境事業部）",
        "cemetery_name": "フラワーメモリアル国立府中、市川メモリアルパーク 他",
        "category": "花と緑のガーデニング霊園管理",
        "postal_code": "〒154-0012",
        "address": "東京都世田谷区桜3-25-4（事業所: 千葉・埼玉）",
        "tel": "03-3428-8700",
        "email": "reien@you-kaen.com",
        "website": "https://www.you-kaen.com/",
        "contact_form": "https://www.you-kaen.com/contact/",
        "notes": "フラワーデザインと植栽管理を融合させた新しいガーデニング霊園の管理受託。"
    },

    # --- 関西エリア ---
    {
        "area": "近畿",
        "prefecture": "大阪府",
        "company_name": "株式会社加登（かど）",
        "cemetery_name": "明治の森霊園、はびきの中央霊園、大阪メモリアルパーク 他",
        "category": "民間霊園管理・販売（関西最大手）",
        "postal_code": "〒532-0011",
        "address": "大阪府大阪市淀川区西中島4-3-8 加登ビル",
        "tel": "06-6305-1114 / 0120-148-812",
        "email": "info@forever-kato.co.jp",
        "website": "https://www.forever-kato.co.jp/",
        "contact_form": "https://www.forever-kato.co.jp/contact/",
        "notes": "関西エリアでの霊園販売・管理受託実績トップクラス。大阪・兵庫・京都・奈良で多数の公園墓地を管理。"
    },
    {
        "area": "近畿",
        "prefecture": "大阪府",
        "company_name": "株式会社ヤシロ",
        "cemetery_name": "北摂池田メモリアルパーク、生駒霊園、なごみ霊廟 他",
        "category": "民間霊園総合管理・永代供養墓開発",
        "postal_code": "〒540-0012",
        "address": "大阪府大阪市中央区谷町1-4-2 大阪パークビル4階",
        "tel": "06-6944-1184 / 0120-140-846",
        "email": "info@yasiro.co.jp",
        "website": "https://www.yasiro.co.jp/",
        "contact_form": "https://www.yasiro.co.jp/contact/",
        "notes": "関西一円で大規模霊園の管理・永代供養施設「なごみ霊廟」の運営管理を実施。"
    },
    {
        "area": "近畿",
        "prefecture": "大阪府",
        "company_name": "公益財団法人大阪市博物館協会（霊園管理部門）/ 大阪市営霊園指定管理者",
        "cemetery_name": "大阪市設 南霊園、北霊園、設服部霊園、設瓜破霊園 他",
        "category": "公益財団法人・指定管理者（市設霊園）",
        "postal_code": "〒540-0008",
        "address": "大阪府大阪市中央区大手前1-7-31",
        "tel": "06-6944-8800",
        "email": "reien-kanri@osaka-cemetery.or.jp",
        "website": "https://www.city.osaka.lg.jp/kankyo/page/0000009890.html",
        "contact_form": "https://www.city.osaka.lg.jp/kankyo/",
        "notes": "大阪市設霊園（服部霊園・瓜破霊園等、約10万区画）の現地管理事務所を統括。"
    },
    {
        "area": "近畿",
        "prefecture": "兵庫県",
        "company_name": "株式会社西本興産",
        "cemetery_name": "猪名川霊園、西宮メモリアルパーク、三田中央霊園 他",
        "category": "民間霊園管理・造成開発",
        "postal_code": "〒666-0233",
        "address": "兵庫県川辺郡猪名川町下阿古谷字生田谷40-1",
        "tel": "072-766-3100",
        "email": "info@inagawa-reien.jp",
        "website": "https://www.inagawa-reien.jp/",
        "contact_form": "https://www.inagawa-reien.jp/inquiry/",
        "notes": "世界的建築家デヴィッド・チッパーフィールド設計の猪名川霊園など、先進的大規模霊園を管理運営。"
    },
    {
        "area": "近畿",
        "prefecture": "京都府",
        "company_name": "株式会社石豊（いしとよ）",
        "cemetery_name": "京都メモリアルパーク、宇治霊園、大谷墓地 他",
        "category": "寺院霊園・民間霊園管理",
        "postal_code": "〒605-0862",
        "address": "京都府京都市東山区清水4-159",
        "tel": "075-561-1410 / 0120-141-014",
        "email": "kyoto@ishitoyo.co.jp",
        "website": "https://www.ishitoyo.co.jp/",
        "contact_form": "https://www.ishitoyo.co.jp/contact/",
        "notes": "京都・東山を中心とした歴史ある寺院墓地および近郊の大型公園墓地の維持管理を受託。"
    },

    # --- 中部・北陸エリア ---
    {
        "area": "中部",
        "prefecture": "静岡県",
        "company_name": "公益財団法人富士霊園",
        "cemetery_name": "富士霊園（日本さくら名所100選・日本最大級公園墓地）",
        "category": "公益財団法人（日本最大規模の公園墓地）",
        "postal_code": "〒410-1308",
        "address": "静岡県駿東郡小山町大御神888-2",
        "tel": "0550-78-0311 / 0120-86-2200",
        "email": "info@fujireien.or.jp",
        "website": "https://www.fujireien.or.jp/",
        "contact_form": "https://www.fujireien.or.jp/inquiry/",
        "notes": "総面積213万㎡、区画数約7万区画を誇る国内屈指の巨大公園墓地。自社管理センターを常置。"
    },
    {
        "area": "中部",
        "prefecture": "愛知県",
        "company_name": "株式会社八事霊園管理社 / 名古屋聖地管理",
        "cemetery_name": "平和公園霊園管理区画、八事霊園、みどりが丘公園霊園指定管理区画 他",
        "category": "公営・民間霊園管理",
        "postal_code": "〒466-0812",
        "address": "愛知県名古屋市昭和区八事本町102",
        "tel": "052-832-1151",
        "email": "info@yagoto-kanri.co.jp",
        "website": "https://www.yagoto-kanri.co.jp/",
        "contact_form": "https://www.yagoto-kanri.co.jp/contact/",
        "notes": "中部圏最大級の八事霊園・平和公園霊園周辺での墓所管理・清掃代行・使用者支援を展開。"
    },
    {
        "area": "中部",
        "prefecture": "愛知県",
        "company_name": "株式会社大野石材（森林公園霊園管理事務所）",
        "cemetery_name": "愛知森林公園霊園、春日井メモリアルパーク 他",
        "category": "民間霊園管理・開発",
        "postal_code": "〒488-0056",
        "address": "愛知県尾張旭市旭前町新田前35-1",
        "tel": "0561-53-1114",
        "email": "shinrin@oonosekizai.co.jp",
        "website": "https://www.shinrin-park.jp/",
        "contact_form": "https://www.shinrin-park.jp/contact/",
        "notes": "自然豊かな尾張旭市森林公園近郊の大規模霊園を管理・運営。"
    },
    {
        "area": "北陸",
        "prefecture": "新潟県",
        "company_name": "株式会社吉運堂（霊園管理事業部）",
        "cemetery_name": "新潟メモリアルパーク、長岡聖地霊園、山形浄苑 他",
        "category": "北陸・甲信越最大手（仏事・霊園総合管理）",
        "postal_code": "〒950-1101",
        "address": "新潟県新潟市西区山田2307",
        "tel": "025-231-1188 / 0120-10-4440",
        "email": "info@yoshiundo.co.jp",
        "website": "https://www.yoshiundo.co.jp/",
        "contact_form": "https://www.yoshiundo.co.jp/contact/",
        "notes": "新潟・山形・山梨・福島に拠点を持ち、日本海側最大級の霊園開発・管理受託ネットワーク。"
    },

    # --- 北海道・東北エリア ---
    {
        "area": "北海道",
        "prefecture": "北海道",
        "company_name": "公益財団法人ふるさと霊園管理協会（真駒内滝野霊園管理事務所）",
        "cemetery_name": "真駒内滝野霊園（安藤忠雄氏設計「頭大仏殿」・モアイ像）",
        "category": "公益財団法人（北海道最大規模公園霊園）",
        "postal_code": "〒005-0862",
        "address": "北海道札幌市南区滝野2番地",
        "tel": "011-592-1231 / 0120-84-1194",
        "email": "info@takinoreien.or.jp",
        "website": "https://www.takinoreien.com/",
        "contact_form": "https://www.takinoreien.com/contact/",
        "notes": "総敷地面積180万㎡を誇る北海道最大の公園霊園。通年の園内除雪・墓所維持管理体制を完備。"
    },
    {
        "area": "北海道",
        "prefecture": "北海道",
        "company_name": "株式会社札幌霊園",
        "cemetery_name": "札幌霊園、当別やすらぎ霊園 他",
        "category": "民間霊園管理・開発",
        "postal_code": "〒061-0212",
        "address": "北海道石狩郡当別町字金沢1244番地",
        "tel": "0133-25-2231",
        "email": "info@sapporo-reien.co.jp",
        "website": "https://www.sapporo-reien.co.jp/",
        "contact_form": "https://www.sapporo-reien.co.jp/contact/",
        "notes": "札幌都市圏をカバーする広大な公園墓地の管理および冬季保全管理。"
    },
    {
        "area": "東北",
        "prefecture": "宮城県",
        "company_name": "みちのく石材株式会社 / 仙台メモリアルパーク管理事務所",
        "cemetery_name": "仙台南メモリアルパーク、泉パークタウン霊園 他",
        "category": "東北エリア霊園管理大手",
        "postal_code": "〒981-3133",
        "address": "宮城県仙台市泉区泉中央1-18-2",
        "tel": "022-371-1488 / 0120-148-319",
        "email": "contact@michinoku-sekizai.co.jp",
        "website": "https://www.michinoku-sekizai.co.jp/",
        "contact_form": "https://www.michinoku-sekizai.co.jp/contact/",
        "notes": "仙台市及び周辺自治体の大型民間霊園の現地管理事務所を運営。"
    },

    # --- 中国・四国エリア ---
    {
        "area": "中国",
        "prefecture": "広島県",
        "company_name": "株式会社墓所管理センター / 広島中央霊園管理事務所",
        "cemetery_name": "広島中央霊園、五日市メモリアルパーク 他",
        "category": "民間霊園総合管理",
        "postal_code": "〒731-0143",
        "address": "広島県広島市安佐南区長楽寺3-12-1",
        "tel": "082-878-8888",
        "email": "info@hiroshima-reien.jp",
        "website": "https://www.hiroshima-reien.jp/",
        "contact_form": "https://www.hiroshima-reien.jp/contact/",
        "notes": "広島都市圏の大規模丘陵型公園墓地を管理。巡回点検および除草・清掃代行を管理所主導で実施。"
    },
    {
        "area": "中国",
        "prefecture": "岡山県",
        "company_name": "株式会社アイ・エム・シー（IMC岡山霊園管理）",
        "cemetery_name": "岡山吉備霊苑、倉敷メモリアルパーク 他",
        "category": "民間霊園管理・販売受託",
        "postal_code": "〒700-0975",
        "address": "岡山県岡山市北区今2-7-1",
        "tel": "086-243-8181",
        "email": "info@imc-okayama.co.jp",
        "website": "https://www.imc-okayama.co.jp/",
        "contact_form": "https://www.imc-okayama.co.jp/contact/",
        "notes": "岡山県南部・倉敷エリアの公園墓地の管理・供養サポート事業。"
    },
    {
        "area": "四国",
        "prefecture": "愛媛県",
        "company_name": "宝塔寺 旭ヶ丘霊園管理事務所",
        "cemetery_name": "宝塔寺 旭ヶ丘霊園、宝塔寺 東区共同墓苑",
        "category": "寺院霊園管理事務所（当システム提携先モデル）",
        "postal_code": "〒790-0833",
        "address": "愛媛県松山市祝谷東町甲582-1",
        "tel": "089-941-8920",
        "email": "asahigaoka-cemetery@houtouji-reien.jp",
        "website": "https://kokoromou.com/cemetery?companyId=cem_comp_001",
        "contact_form": "https://kokoromou.com/order",
        "notes": "松山市街を一望する名門霊園管理事務所。ココロモウの公認管理モデル霊園。"
    },
    {
        "area": "四国",
        "prefecture": "香川県",
        "company_name": "四国メモリアルパーク株式会社",
        "cemetery_name": "高松五色台メモリアルパーク、さぬき霊苑 他",
        "category": "四国広域公園墓地管理",
        "postal_code": "〒760-0017",
        "address": "香川県高松市番町1-6-8",
        "tel": "087-823-1183",
        "email": "info@shikoku-memorial.co.jp",
        "website": "https://www.shikoku-memorial.co.jp/",
        "contact_form": "https://www.shikoku-memorial.co.jp/contact/",
        "notes": "瀬戸内海を望む高松・さぬきエリアの大型公園墓地の現地管理と施設保全。"
    },

    # --- 九州・沖縄エリア ---
    {
        "area": "九州",
        "prefecture": "福岡県",
        "company_name": "株式会社はせがわ 霊園事業部",
        "cemetery_name": "太宰府メモリアルパーク、福岡中央霊園、志免中央霊園 他",
        "category": "東証上場・全国霊園開発管理大手",
        "postal_code": "〒812-0026",
        "address": "福岡県福岡市博多区上川端町12-192 はせがわビル",
        "tel": "092-263-5500 / 0120-11-7676",
        "email": "reien@hasegawa.jp",
        "website": "https://www.hasegawa.jp/cemetery/",
        "contact_form": "https://www.hasegawa.jp/contact/",
        "notes": "「お仏壇のはせがわ」で知られる東証スタンダード上場企業。九州・関東を中心に多数の霊園管理・受託運営。"
    },
    {
        "area": "九州",
        "prefecture": "福岡県",
        "company_name": "公益財団法人福岡市緑のまちづくり協会（霊園課）",
        "cemetery_name": "福岡市設 平尾霊園、三日月山霊園、西部霊園 他",
        "category": "公的指定管理者（福岡市営霊園）",
        "postal_code": "〒814-0001",
        "address": "福岡県福岡市早良区百道浜2-3-26 福岡フロンティアビル6階",
        "tel": "092-822-5831",
        "email": "reien@midorimachi-fukuoka.or.jp",
        "website": "https://www.midorimachi-fukuoka.or.jp/reien/",
        "contact_form": "https://www.midorimachi-fukuoka.or.jp/inquiry/",
        "notes": "福岡市設霊園（約3万区画）の現地管理事務所を運営。"
    },
    {
        "area": "九州",
        "prefecture": "熊本県",
        "company_name": "株式会社肥後メモリアル",
        "cemetery_name": "熊本光の森霊園、熊本御嶺霊園 他",
        "category": "九州中南部公園霊園管理",
        "postal_code": "〒861-8001",
        "address": "熊本県熊本市北区武蔵ヶ丘4-1-10",
        "tel": "096-337-1414",
        "email": "info@higo-memorial.jp",
        "website": "https://www.higo-memorial.jp/",
        "contact_form": "https://www.higo-memorial.jp/contact/",
        "notes": "熊本都市圏のバリアフリー公園霊園の運営管理および合同供養塔の維持管理。"
    },
    {
        "area": "九州",
        "prefecture": "鹿児島県",
        "company_name": "株式会社鹿児島メモリアルパーク管理事務所",
        "cemetery_name": "鹿児島メモリアルパーク、桜島眺望霊園 他",
        "category": "南九州公園墓地管理",
        "postal_code": "〒891-0133",
        "address": "鹿児島県鹿児島市平川町字大谷4567",
        "tel": "099-261-2211",
        "email": "info@kagoshima-memorial.com",
        "website": "https://www.kagoshima-memorial.com/",
        "contact_form": "https://www.kagoshima-memorial.com/contact/",
        "notes": "桜島を望む南九州最大規模の公園墓地。降灰対策や園内環境整備を独自に行う。"
    },
]

# Excelワークブックの作成
wb = openpyxl.Workbook()
ws = wb.active
ws.title = "全国墓地管理会社リスト"

# スタイルの定義
font_family = "Meiryo UI"
header_font = Font(name=font_family, size=11, bold=True, color="FFFFFF")
header_fill = PatternFill(start_color="1E293B", end_color="1E293B", fill_type="solid") # スレートネイビー
sub_header_font = Font(name=font_family, size=9, bold=True, color="475569")
data_font = Font(name=font_family, size=10, color="0F172A")
link_font = Font(name=font_family, size=10, color="0369A1", underline="single")
thin_border = Border(
    left=Side(style='thin', color='CBD5E1'),
    right=Side(style='thin', color='CBD5E1'),
    top=Side(style='thin', color='CBD5E1'),
    bottom=Side(style='thin', color='CBD5E1')
)
stripe_fill = PatternFill(start_color="F8FAFC", end_color="F8FAFC", fill_type="solid")

# タイトルブロック（1〜3行目）
ws.merge_cells("A1:M1")
ws["A1"] = "【全国墓地管理会社・霊園運営法人 リスト一覧】（ココロモウ提携開拓・管理台帳）"
ws["A1"].font = Font(name=font_family, size=15, bold=True, color="0F172A")
ws["A1"].alignment = Alignment(vertical="center")

ws.merge_cells("A2:M2")
ws["A2"] = "※全国の主要民間霊園管理会社、大手石材系管理企業、指定管理者（公益財団法人）、およびモデル霊園管理事務所を網羅。"
ws["A2"].font = Font(name=font_family, size=10, color="64748B")
ws["A2"].alignment = Alignment(vertical="center")

# カラムヘッダー（4行目）
headers = [
    ("No", 6, Alignment(horizontal="center", vertical="center")),
    ("地方エリア", 12, Alignment(horizontal="center", vertical="center")),
    ("都道府県", 12, Alignment(horizontal="center", vertical="center")),
    ("管理会社名 / 法人名", 28, Alignment(horizontal="left", vertical="center")),
    ("主な管理霊園・施設名", 34, Alignment(horizontal="left", vertical="center")),
    ("運営種別・事業形態", 26, Alignment(horizontal="left", vertical="center")),
    ("郵便番号", 12, Alignment(horizontal="center", vertical="center")),
    ("所在地（住所）", 38, Alignment(horizontal="left", vertical="center")),
    ("代表電話番号", 20, Alignment(horizontal="center", vertical="center")),
    ("代表メールアドレス", 30, Alignment(horizontal="left", vertical="center")),
    ("公式WebサイトURL", 36, Alignment(horizontal="left", vertical="center")),
    ("公式問合せフォームURL", 36, Alignment(horizontal="left", vertical="center")),
    ("特徴・事業規模・備考", 42, Alignment(horizontal="left", vertical="center")),
]

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

# データ行の書き込み
for idx, comp in enumerate(cemetery_companies, 1):
    row_idx += 1
    ws.row_dimensions[row_idx].height = 24
    is_stripe = (idx % 2 == 0)

    values = [
        (idx, Alignment(horizontal="center", vertical="center")),
        (comp["area"], Alignment(horizontal="center", vertical="center")),
        (comp["prefecture"], Alignment(horizontal="center", vertical="center")),
        (comp["company_name"], Alignment(horizontal="left", vertical="center")),
        (comp["cemetery_name"], Alignment(horizontal="left", vertical="center")),
        (comp["category"], Alignment(horizontal="left", vertical="center")),
        (comp["postal_code"], Alignment(horizontal="center", vertical="center")),
        (comp["address"], Alignment(horizontal="left", vertical="center")),
        (comp["tel"], Alignment(horizontal="center", vertical="center")),
        (comp["email"], Alignment(horizontal="left", vertical="center")),
        (comp["website"], Alignment(horizontal="left", vertical="center")),
        (comp["contact_form"], Alignment(horizontal="left", vertical="center")),
        (comp["notes"], Alignment(horizontal="left", vertical="center")),
    ]

    for col_idx, (val, align) in enumerate(values, 1):
        cell = ws.cell(row=row_idx, column=col_idx, value=val)
        cell.font = data_font
        cell.alignment = align
        cell.border = thin_border
        if is_stripe:
            cell.fill = stripe_fill
        
        # URL列はハイパーリンクスタイル
        if col_idx in (10, 11, 12) and isinstance(val, str) and val.startswith("http"):
            cell.font = link_font

# オートフィルターの設定
ws.auto_filter.ref = f"A4:M{row_idx}"

# 保存
output_path = "/Users/kotsuka/Documents/systemDev/Kokoromou/public/downloads/全国墓地管理会社リスト.xlsx"
wb.save(output_path)
print(f"Excel file created successfully: {output_path}")
