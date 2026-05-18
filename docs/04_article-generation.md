> 📅 **Day 2 — Step 2/2**

# Step 4：セキュリティニュース記事を自動生成する

---

## 🎯 このステップのゴール

- `scripts/generate-article.js` を使って URL から HTML 記事を生成できる
- Copilot Skill 経由でインタラクティブに実行できる
- 生成された記事が `output/` フォルダに保存される

---

## 4-1：システムの全体像

```
[ユーザー]
    │
    │ Copilot Chat で #news-article-generator を呼び出す
    ▼
[Copilot Skill]
    │
    │ URL を入力させる（対話型）
    ▼
[generate-article.js]
    │
    │ URL の HTML を取得・解析
    │ タイトル・本文・日付を抽出
    ▼
[Copilot が内容を日本語要約]
    │
    │ テンプレートに当てはめて HTML 生成
    ▼
[output/記事名.html]    ← 完成した記事
```

---

## 4-2：依存パッケージをインストール

ターミナルで以下を実行します：

```bash
cd security-news-outmation-demo

# package.json を初期化（すでにある場合はスキップ）
npm init -y

# HTML 解析ライブラリをインストール
npm install cheerio node-fetch
```

---

## 4-3：スクリプトの構成を確認する

`scripts/generate-article.js` を VS Code で開いてみましょう。

このスクリプトは以下の流れで動作します：

```javascript
// 1. URL からページを取得
// 2. HTML から本文・タイトルを抽出
// 3. テンプレートに流し込んで HTML ファイルを生成
// 4. output/ フォルダに保存
```

---

## 4-4：スクリプトを実行してみる

```bash
# output フォルダを作成
mkdir -p output

# スクリプトを対話形式で実行
node scripts/generate-article.js
```

**プロンプトへの回答例：**

```
? 記事を生成したいセキュリティニュースのURLを入力してください:
  https://www.ipa.go.jp/security/vuln/2026/jvndb-2026-000001.html

? 記事のスタイルを選んでください (矢印キーで選択):
  ❯ 技術者向け（詳細な説明あり）
    一般向け（わかりやすい説明）
    エグゼクティブ向け（要点のみ）

? 出力ファイル名を入力してください (デフォルト: article):
  ipa-vuln-20260101
```

---

## 4-5：エージェント経由で実行する（推奨）

スクリプトを直接実行する代わりに、Copilot Chat のエージェント経由で実行できます。  
エージェントは調査→執筆→レビューまでを自動で連鎖させてくれます。

1. Copilot Chat を開く（`Ctrl+Shift+I`）
2. `@Security News Generator` と入力して Enter
3. セキュリティニュースの URL を貼り付ける
4. 対象読者（standard / technical / executive）を選ぶ
5. 調査 → 執筆 → レビューが自動で進み、完了報告が届く
6. 表示されたコマンドを自分で実行して Git コミット・プッシュ

---

## 4-6：生成された記事を確認する

```bash
# 生成されたファイルを確認
ls output/

# ブラウザで開く（Linux）
xdg-open output/ipa-vuln-20260101.html

# または VS Code の Simple Browser で開く
# Ctrl+Shift+P → "Simple Browser: Show" → output/*.html のパス
```

---

## 4-7：生成記事の構成

生成された HTML 記事には以下が含まれます：

| セクション | 内容 |
|-----------|------|
| ヘッダー | タイトル・取得日時・ソース URL |
| 要約 | Copilot が生成した日本語要約（3〜5 文） |
| 重要ポイント | 箇条書き（3〜5 項目） |
| 影響を受けるシステム | 対象 OS・ソフトウェア |
| 推奨アクション | 具体的な対策手順 |
| 参考リンク | 元記事・関連情報のリンク |

---

## 4-8：Copilot を使ってスクリプトを改善する

スクリプトに機能を追加してみましょう。Copilot Chat に頼んでみてください：

```
generate-article.js を開いた状態で Copilot Chat に入力：

「このスクリプトに以下の機能を追加してください：
1. 生成した記事の一覧を index.html として自動更新する
2. 重複 URL のチェック（同じ URL を 2 回生成しない）
3. 生成時刻をファイル名に含める（例: 20260515_153022_article.html）」
```

---

## ✅ チェックリスト

- [ ] `npm install` で依存パッケージをインストールした
- [ ] `node scripts/generate-article.js` でスクリプトが起動した
- [ ] URL を入力して HTML 記事が生成された
- [ ] `output/` フォルダに記事ファイルが保存された
- [ ] ブラウザで生成記事が表示された

---

## ❓ よくあるトラブル

### `fetch is not defined` エラー

Node.js のバージョンが古い可能性があります：

```bash
node --version  # 18 以上が必要
```

### URL へのアクセスエラー

プロキシ環境下の場合：

```bash
# プロキシ設定を確認
echo $HTTP_PROXY
echo $HTTPS_PROXY
```

---

---

## 🎉 Day 2 お疲れさまでした！

> **Day 2 で学んだこと**
> - `.github/skills/` に SKILL.md を配置してカスタムスキルを作った
> - `#news-article-generator` でスキルを呼び出した
> - URL を入力して HTML 記事を生成した

> **Day 3 の予告**
> 作った成果物を **git add / commit / push** で GitHub にアップロードし、
> テンプレートやデザインをカスタマイズして完成させます。

👉 [05_git-workflow.md](05_git-workflow.md)（Day 3 開始）に進んでください
