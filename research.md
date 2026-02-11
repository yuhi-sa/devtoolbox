# GitHub Pages 広告収益サイト リサーチレポート

## 1. GitHub Pages の制約

### 技術的制約
- **静的ファイルのみ**: HTML, CSS, JavaScript のみ。サーバーサイド処理（PHP, Python, Node.js等）は不可
- **リポジトリサイズ**: 推奨上限 1GB、個別ファイルは 100MB 以下
- **公開サイトサイズ**: 最大 1GB
- **帯域制限**: ソフトリミット 100GB/月（1日10人程度のアクセスであれば問題なし）
- **ビルド制限**: 1時間あたり最大10回
- **カスタムドメイン**: 対応（HTTPS も自動対応）
- **CORS ヘッダー**: カスタム設定不可

### 広告掲載に関するポリシー
- GitHub は「広告の利用を一般的には禁止していない」と明言している
- ただし、GitHub Pages は「オンラインビジネス運営」「eコマース」「商用取引の促進を主目的とするサイト」での利用は禁止
- 許可されている収益化: 寄付ボタン、クラウドファンディングリンク
- **結論**: ツール提供が主目的で、広告は副次的な要素として配置する形であれば、ポリシー上のリスクは低い。ただし、サイトが「広告収益を主目的」と見なされるとポリシー違反の可能性がある

### リスク軽減策
- カスタムドメインを取得して運用する（github.io サブドメインではなく独自ドメイン）
- サイトの主目的を「有用なツール/コンテンツの提供」として明確にする
- 広告は控えめに配置し、コンテンツの価値を前面に出す

---

## 2. 広告配信方法

### Google AdSense
- **GitHub Pages での利用**: 技術的には可能（JavaScript タグを埋め込むだけ）
- **審査基準（2025-2026年版）**:
  - 15〜25本のオリジナルコンテンツ（800〜1500語以上）
  - 必須ページ: About、Contact、Privacy Policy、Disclaimer、Terms of Service
  - HTTPS 対応（GitHub Pages は自動対応）
  - カスタムドメイン推奨（.com, .net 等で信頼スコア向上）
  - ドメイン年齢: 最低2〜4週間、理想は3〜6ヶ月
  - オーガニックトラフィックがあると有利
- **課題**: ツール系サイトは「テキストコンテンツ量」の基準を満たしにくい。各ツールページに十分な説明・使い方ガイドを併設する必要がある

### 代替広告ネットワーク（低トラフィック対応）

| ネットワーク | 最低トラフィック | 最低支払額 | 特徴 |
|---|---|---|---|
| **PropellerAds** | なし | $5 (PayPal) | プッシュ通知、ポップアンダー等。週次支払い |
| **Adsterra** | なし | $5 | 多様な広告フォーマット。新規サイトに優しい |
| **Ezoic** | なし（エントリープラン） | $20 | AI による広告最適化。技術サポートあり |
| **Media.net** | 低い | $100 | Yahoo/Bing ネットワーク。コンテキスト広告が強い |
| **Carbon Ads** | 開発者向けサイト | - | 開発者・デザイナー向け。非侵入的な広告 |

### 推奨戦略
1. **初期段階**: Adsterra または PropellerAds（審査なし・即開始可能）
2. **トラフィック安定後**: Google AdSense に申請（カスタムドメイン + 十分なコンテンツが前提）
3. **開発者向けサイトの場合**: Carbon Ads も検討（デザインがクリーンで UX を損なわない）

---

## 3. 有望なサイトジャンル分析

### 候補比較

| ジャンル | SEO 難易度 | 実装難易度 | リピート率 | 広告との相性 | 総合評価 |
|---|---|---|---|---|---|
| オンラインツール系 | 中（ニッチなら低） | 中 | 高 | 高 | ★★★★★ |
| チートシート・リファレンス | 中〜高 | 低 | 中 | 中 | ★★★☆☆ |
| 計算機・コンバーター系 | 低〜中 | 低 | 高 | 高 | ★★★★☆ |
| ライフハック・How-to系 | 高 | 低 | 低 | 中 | ★★☆☆☆ |

### 各ジャンルの詳細分析

#### A. オンラインツール系（推奨度: 最高）
- **強み**: 実用性が高くブックマーク・リピート利用されやすい。JavaScriptのみで完結する機能が多い。ロングテールキーワードが豊富
- **弱み**: 競合ツール（例: JSON Formatter は多数存在）との差別化が必要
- **具体例**: 文字数カウンター、JSON整形、Base64エンコード/デコード、QRコード生成、色コード変換、正規表現テスター、Unix タイムスタンプ変換
- **SEO面**: 「[ツール名] オンライン 無料」のような検索意図が明確なクエリで流入しやすい

#### B. 計算機・コンバーター系（推奨度: 高）
- **強み**: 検索意図が明確。Omni Calculator は月間1,800万訪問者を獲得している実績
- **弱み**: 単体ツールでは滞在時間が短い
- **具体例**: 単位変換、ローン計算、BMI計算、日付計算、進数変換

#### C. チートシート・リファレンス（推奨度: 中）
- **強み**: コンテンツ量を稼ぎやすく AdSense 審査に有利
- **弱み**: 公式ドキュメントや MDN、Stack Overflow との競合が激しい

#### D. ライフハック・How-to系（推奨度: 低）
- **強み**: テーマが広い
- **弱み**: 静的サイトでは差別化が困難。大手メディアとの競合が激しい。GitHub Pages のポリシーとの整合性が微妙

---

## 4. SEO 戦略

### ロングテールキーワード戦略
- 全検索クエリの 91.8% はロングテールキーワード
- ロングテールキーワードの平均コンバージョン率は 36%
- 競争が少なく、小規模サイトでも上位表示を狙いやすい

### キーワード例（オンラインツール系）
- 「JSON 整形 オンライン 無料」
- 「Unix タイムスタンプ 変換 ツール」
- 「Base64 エンコード デコード オンライン」
- 「正規表現 テスト オンライン」
- 「文字数 カウント スペース含む」
- 「QRコード 生成 無料 高画質」
- 「カラーコード 変換 RGB HEX」
- 「diff ツール オンライン テキスト比較」

### 日本語 vs 英語

| 観点 | 日本語 | 英語 |
|---|---|---|
| 競合の激しさ | 低〜中 | 高 |
| 検索ボリューム | 中（日本市場） | 大（グローバル） |
| AdSense CPC | 中 | 高 |
| コンテンツ作成コスト | 低（母語の場合） | 中 |
| 1日10人達成の難易度 | 低い | 中程度 |

**推奨**: **日本語を主軸にする**
- 理由1: 日本語の開発者向けツールは英語圏に比べて競合が少ない
- 理由2: 日本語ロングテールキーワードは競合が 30-40% 低い傾向
- 理由3: 1日10人という目標は日本語市場でも十分達成可能
- 理由4: コンテンツ作成の効率が高い（母語の場合）
- 将来的に英語版を追加してトラフィックを拡大する余地も残せる

### SEO 実装チェックリスト
- [ ] 各ページに固有の title タグ（60文字以内）
- [ ] meta description（120文字以内、日本語）
- [ ] 構造化データ（JSON-LD: WebApplication, HowTo 等）
- [ ] sitemap.xml の生成
- [ ] robots.txt の設置
- [ ] OGP タグ（SNS 共有対応）
- [ ] canonical URL の設定
- [ ] モバイルファーストのレスポンシブデザイン
- [ ] Core Web Vitals の最適化（静的サイトなので有利）
- [ ] Google Search Console への登録
- [ ] ページ間の内部リンク構造

---

## 5. 最終推薦: サイトコンセプト

### 推薦ジャンル: 日本語の開発者向けオンラインツール集

### サイト名案
- 「DevToolBox」（開発者ツールボックス）
- 「WebToolKit」
- 「コードツール」

### コンセプト
**「開発者の日常作業を効率化する、シンプルで高速な Web ツール集」**

### 推奨する初期ツール群（優先度順）

1. **JSON 整形・検証ツール** - 開発者の日常的なニーズ。検索ボリュームが安定
2. **文字数カウンター** - 汎用性が高い。開発者以外も利用
3. **Base64 エンコード/デコード** - API 開発時に頻繁に使用
4. **URL エンコード/デコード** - Web 開発の必須ツール
5. **Unix タイムスタンプ変換** - ログ解析等で需要あり
6. **正規表現テスター** - リアルタイムマッチング表示
7. **diff（テキスト比較）ツール** - コードレビュー等で利用
8. **QRコード生成** - 幅広い利用者層
9. **色コード変換（HEX/RGB/HSL）** - フロントエンド開発者向け
10. **ハッシュ生成（MD5, SHA-256等）** - セキュリティ・開発用途

### サイト構成案

```
/
├── index.html           # トップページ（ツール一覧）
├── tools/
│   ├── json-formatter/  # JSON整形ツール
│   ├── char-counter/    # 文字数カウンター
│   ├── base64/          # Base64変換
│   ├── url-encode/      # URLエンコード
│   ├── timestamp/       # タイムスタンプ変換
│   ├── regex-tester/    # 正規表現テスター
│   ├── diff/            # テキスト比較
│   ├── qr-code/         # QRコード生成
│   ├── color-converter/ # 色コード変換
│   └── hash-generator/  # ハッシュ生成
├── about.html           # サイトについて
├── privacy.html         # プライバシーポリシー
├── terms.html           # 利用規約
├── sitemap.xml
└── robots.txt
```

### 収益化ロードマップ

| フェーズ | 期間 | アクション |
|---|---|---|
| Phase 1 | 月1-2 | 3-5個のツールを公開。SEO 基盤整備。Google Search Console 登録 |
| Phase 2 | 月3-4 | ツールを10個に拡大。Adsterra または PropellerAds で広告開始 |
| Phase 3 | 月5-6 | カスタムドメイン取得。コンテンツ（使い方ガイド等）充実 |
| Phase 4 | 月7+ | Google AdSense 申請。トラフィック分析に基づくツール追加 |

### 成功のポイント
1. **ツールの品質を最優先**: 高速・シンプル・使いやすいツールが最大の SEO 資産
2. **各ツールに説明コンテンツを併設**: 使い方、関連知識、ユースケースを記載し、テキスト量を確保
3. **段階的にツールを追加**: 一度に全部作らず、1つずつ品質を高めながら追加
4. **ユーザーデータは一切保存しない**: プライバシーを重視し、全処理をクライアントサイドで完結
5. **パフォーマンス最適化**: 静的サイトの優位性を活かし、Core Web Vitals で高スコアを目指す

---

## 参考情報源

- [GitHub Pages limits - GitHub Docs](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)
- [GitHub Terms for Additional Products and Features](https://docs.github.com/en/site-policy/github-terms/github-terms-for-additional-products-and-features)
- [GitHub Pages commercial use discussion](https://github.com/orgs/community/discussions/74742)
- [GitHub community discussion on advertising](https://github.com/orgs/community/discussions/22016)
- [AdSense Approval Guide 2025-2026](https://webtimizesolutions.com/blogs/google-adsense-approval-guide-2026-complete-genuine-updated-information/)
- [AdSense Alternatives for Publishers](https://www.publift.com/blog/adsense-alternatives)
- [Best AdSense Niches 2025](https://serpzilla.com/blog/10-best-google-adsense-niches-2025-a-practical-guide-for-website-owners/)
- [Long-Tail Keywords Guide - Semrush](https://www.semrush.com/blog/how-to-choose-long-tail-keywords/)
- [GitHub Pages advertising discussion](https://finityweb.com/can-you-advertise-with-github-pages-and-what-are-the-alternatives/)
