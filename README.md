# DevToolBox

開発者の日常作業を効率化する、無料オンラインツール集です。すべての処理はブラウザ上で完結し、データがサーバーに送信されることはありません。

## 提供ツール

| ツール | 説明 |
|--------|------|
| JSON整形・検証 | JSONデータの整形・圧縮・構文検証 |
| 文字数カウンター | 文字数・行数・バイト数のリアルタイムカウント |
| Base64エンコード/デコード | テキストとBase64の相互変換 |
| URLエンコード/デコード | URL文字列のエンコード・デコード |
| Unixタイムスタンプ変換 | タイムスタンプと日時の相互変換 |

## プロジェクト構成

```
devtoolbox/
├── index.html              # トップページ
├── about.html              # サイトについて
├── privacy.html            # プライバシーポリシー
├── terms.html              # 利用規約
├── sitemap.xml             # サイトマップ
├── robots.txt              # クローラー設定
├── .nojekyll               # Jekyll無効化
├── _config.yml             # GitHub Pages設定
├── css/
│   └── style.css           # 共通スタイル
├── js/
│   ├── common.js           # 共通JavaScript
│   └── tools/              # ツール別JavaScript
├── tools/
│   ├── json-formatter/     # JSON整形ツール
│   ├── char-counter/       # 文字数カウンター
│   ├── base64/             # Base64変換
│   ├── url-encode/         # URLエンコード
│   └── timestamp/          # タイムスタンプ変換
└── README.md               # このファイル
```

## デプロイ手順（GitHub Pages）

### 1. GitHubリポジトリの作成

1. GitHub（https://github.com）にログイン
2. 右上の「+」ボタンから「New repository」を選択
3. リポジトリ名を入力（例: `devtoolbox`）
4. 「Public」を選択（GitHub Pagesは無料プランではPublicリポジトリのみ対応）
5. 「Create repository」をクリック

### 2. ファイルのプッシュ

```bash
# プロジェクトディレクトリに移動
cd devtoolbox

# Gitリポジトリを初期化
git init

# すべてのファイルをステージング
git add -A

# 初回コミット
git commit -m "Initial commit: DevToolBox site"

# リモートリポジトリを追加（URLは自分のリポジトリに置き換え）
git remote add origin https://github.com/USERNAME/devtoolbox.git

# mainブランチにプッシュ
git branch -M main
git push -u origin main
```

### 3. GitHub Pagesの有効化

1. GitHubのリポジトリページに移動
2. 「Settings」タブをクリック
3. 左メニューの「Pages」を選択
4. 「Source」で「Deploy from a branch」を選択
5. 「Branch」で「main」を選択し、フォルダは「/ (root)」を選択
6. 「Save」をクリック
7. 数分待つと、`https://USERNAME.github.io/devtoolbox/` でサイトが公開される

## カスタムドメイン設定手順

### 1. ドメインの取得

お好みのドメインレジストラ（お名前.com、ムームードメイン、Google Domainsなど）でドメインを取得します。

### 2. DNS設定

ドメインレジストラのDNS設定画面で、以下のレコードを追加します。

**Aレコード（Apexドメインの場合）:**

```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

**CNAMEレコード（サブドメインの場合、例: www）:**

```
www CNAME USERNAME.github.io
```

### 3. GitHub側の設定

1. リポジトリの「Settings」→「Pages」を開く
2. 「Custom domain」に取得したドメインを入力
3. 「Save」をクリック
4. 「Enforce HTTPS」にチェックを入れる（DNS伝播後に有効化可能）

### 4. サイト内URLの更新

カスタムドメインを設定した場合、以下のファイル内のベースURLを更新してください。

- `sitemap.xml` - 全URLの `https://yuhi-sa.github.io/devtoolbox/` を新ドメインに置換
- `robots.txt` - Sitemapの URL を更新
- 各HTMLファイルの `<link rel="canonical">` と `<meta property="og:url">` を更新

## 広告設定手順

### フェーズ1: Adsterra / PropellerAds（初期段階）

AdSenseの審査に通過するまでの初期収益化として、Adsterra または PropellerAds を利用します。

#### Adsterra の設定

1. https://adsterra.com/ でパブリッシャーアカウントを作成
2. ダッシュボードで「Websites」→「Add website」でサイトURLを登録
3. 審査通過後、「Ad codes」から広告コードを取得
4. HTMLファイル内の広告枠（`<div class="ad-slot">` コメント部分）にコードを挿入

#### PropellerAds の設定

1. https://propellerads.com/ でパブリッシャーアカウントを作成
2. 「Sites」→「Add new site」でサイトを登録
3. 提供される検証コードをサイトに設置して所有権を確認
4. 広告フォーマット（バナー、インタースティシャルなど）を選択
5. 広告コードを取得し、HTMLの広告枠に挿入

### フェーズ2: Google AdSense（本格運用）

サイトにコンテンツが充実し、一定のアクセスが得られるようになったらAdSenseに申請します。

#### AdSense申請の準備

- 独自ドメインの使用を推奨（GitHub Pagesのデフォルトドメインでも申請可能だが通過率が下がる）
- プライバシーポリシー、利用規約ページが設置されていること（設置済み）
- サイトに独自の価値あるコンテンツがあること
- ナビゲーションが整理されていること

#### AdSense の設定手順

1. https://adsense.google.com/ でアカウントを作成
2. サイトURLを登録
3. 提供されるAdSenseコードを `<head>` タグ内に設置
4. 審査を申請（通常1〜2週間）
5. 審査通過後、広告ユニットを作成
6. 広告コードをHTMLの広告枠に設置
7. 以前のAdsterra/PropellerAdsのコードを削除（AdSenseと併用可能な場合もあるが、ポリシー確認が必要）

## Google Search Console 登録手順

### 1. Search Consoleにアクセス

1. https://search.google.com/search-console/ にアクセス
2. Googleアカウントでログイン

### 2. プロパティの追加

1. 「プロパティを追加」をクリック
2. 「URLプレフィックス」を選択
3. サイトのURL（`https://USERNAME.github.io/devtoolbox/`）を入力
4. 「続行」をクリック

### 3. 所有権の確認

以下のいずれかの方法で所有権を確認します。

**方法A: HTMLファイル（推奨）**
1. 提供されるHTMLファイルをダウンロード
2. プロジェクトのルートディレクトリに配置
3. GitHubにプッシュ
4. Search Consoleで「確認」をクリック

**方法B: HTMLタグ**
1. 提供される `<meta>` タグをコピー
2. `index.html` の `<head>` 内に追加
3. GitHubにプッシュ
4. Search Consoleで「確認」をクリック

### 4. サイトマップの送信

1. 左メニューの「サイトマップ」を選択
2. サイトマップのURL（`sitemap.xml`）を入力
3. 「送信」をクリック
4. ステータスが「成功」になることを確認

### 5. インデックス登録のリクエスト

1. 上部の検索バーに各ページのURLを入力
2. 「インデックス登録をリクエスト」をクリック
3. 主要ページ（トップ、各ツールページ）について実施

## SEO改善チェックリスト

### 基本設定

- [x] 全ページに `<title>` タグを設定
- [x] 全ページに `<meta name="description">` を設定
- [x] 全ページに `<link rel="canonical">` を設定
- [x] 全ページにOGPタグを設定（og:title, og:description, og:type, og:url, og:site_name, og:locale）
- [x] 全ページに `lang="ja"` を設定
- [x] 全ページに viewport メタタグを設定
- [x] sitemap.xml を作成
- [x] robots.txt を作成
- [x] ツールページに構造化データ（JSON-LD）を設定
- [x] トップページに WebSite 構造化データを設定

### コンテンツSEO

- [x] 各ツールページに使い方の説明を記載
- [x] 各ツールページに関連知識のセクションを追加
- [x] 各ツールページにFAQセクションを追加
- [x] パンくずリストをツールページに設置
- [x] 関連ツールへの内部リンクを設置

### テクニカルSEO

- [x] .nojekyll ファイルを設置（GitHub Pages用）
- [x] レスポンシブデザイン対応
- [x] セマンティックHTML（header, main, footer, nav, article）を使用
- [ ] favicon を設定
- [ ] OGP画像（og:image）を設定
- [ ] Google Search Console に登録
- [ ] サイトマップを Search Console に送信

### パフォーマンス

- [ ] 画像の最適化（WebP形式の使用検討）
- [ ] CSSの圧縮
- [ ] JavaScriptの圧縮
- [ ] Google PageSpeed Insights でスコア確認

### 継続的改善

- [ ] Google Analytics または代替ツール（Plausible、Umami等）の導入
- [ ] Search Console のパフォーマンスレポートを定期確認
- [ ] 検索キーワードに基づくコンテンツ改善
- [ ] 新しいツールの追加によるコンテンツ拡充
- [ ] 外部サイトからの被リンク獲得（技術ブログ、SNSでの紹介など）
