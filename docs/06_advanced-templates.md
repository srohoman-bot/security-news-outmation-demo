> 📅 **Day 3 — Step 2/2**

# Step 6（発展）：YJK ブランドスタイルで記事をカスタマイズする

---

## 🎯 このステップのゴール

- 生成 HTML に YJK のブランド CSS が適用されていることを確認できる
- Copilot Chat で YJK スタイルをカスタマイズできる

---

## 6-1：YJK ブランドスタイルとは

このシステムの HTML 記事には **YJK 社の記事 CSS** が埋め込まれています。  
`/YJK-Project/Blog-autmotion/scripts/article.css` をベースにしており、以下が特徴です：

| 要素 | スタイル |
|------|---------|
| フォント | Hiragino Kaku Gothic ProN / Noto Sans JP |
| ベースカラー | `#0078d4`（Microsoft ブルー） |
| H1 | 下線：`3px solid #0078d4` |
| H2 | 左ボーダー：`5px solid #0078d4` |
| H3 | 文字色：`#0078d4` |
| テーブルヘッダー | 背景 `#0078d4`、白文字 |
| 引用 | 背景 `#f0f7ff`、左ボーダー `#0078d4` |
| 緊急度バッジ | 🔴 `#d13438` / 🟠 `#ff8c00` / 🟡 `#ffb900` / 🟢 `#107c10` |

---

## 6-2：スタイルを確認する

`output/` に生成された HTML ファイルを VS Code の Simple Browser で開いて確認してください。

- `Ctrl+Shift+P` → `Simple Browser: Show` → ファイルパスを入力

YJK ブルー（`#0078d4`）の見出し・テーブルが表示されていれば正常です。

---

## 6-3：YJK スタイルを Copilot で再現するプロンプト

**新しい環境やエージェントを作るとき**は、以下のプロンプトで YJK スタイルを再現できます。

Copilot Chat に貼り付けて送信：

```
セキュリティ記事用の HTML を生成するとき、以下の YJK ブランド CSS を
<style> タグにインラインで埋め込んで。

body {
  font-family: "Hiragino Kaku Gothic ProN", "Noto Sans JP", sans-serif;
  font-size: 16px; line-height: 1.8; color: #333;
  max-width: 860px; margin: 0 auto; padding: 2rem 1.5rem; background: #fff;
}
h1 { font-size: 1.8rem; border-bottom: 3px solid #0078d4; padding-bottom: 0.4em; }
h2 { font-size: 1.4rem; border-left: 5px solid #0078d4; padding-left: 0.6em; margin-top: 2em; }
h3 { font-size: 1.15rem; color: #0078d4; }
table { width: 100%; border-collapse: collapse; }
th { background: #0078d4; color: #fff; padding: 0.6em 1em; text-align: left; }
td { padding: 0.6em 1em; border: 1px solid #ddd; }
tr:nth-child(even) td { background: #f5f9ff; }
blockquote { background: #f0f7ff; border-left: 4px solid #0078d4; padding: 0.8em 1.2em; }
.badge-critical { background: #d13438; color: #fff; padding: 0.2em 0.7em; border-radius: 3px; }
.badge-high     { background: #ff8c00; color: #fff; padding: 0.2em 0.7em; border-radius: 3px; }
.badge-medium   { background: #ffb900; color: #fff; padding: 0.2em 0.7em; border-radius: 3px; }
.badge-low      { background: #107c10; color: #fff; padding: 0.2em 0.7em; border-radius: 3px; }
```

---

## 6-4：スタイルをカスタマイズする

アクセントカラーや背景を変えたいときは Copilot Chat に依頼：

```
security-writer.agent.md の YJK CSS を変更して。
アクセントカラーを #0078d4 から #107c10（グリーン）に変えて。
```

または会社のブランドカラーに合わせて：

```
security-writer.agent.md の CSS のアクセントカラーを
#（16進数カラーコード） に変更して。
見出し・テーブルヘッダー・左ボーダーすべて統一して。
```

---

## ✅ チェックリスト

- [ ] 生成 HTML に YJK ブルー（`#0078d4`）が反映されている
- [ ] 緊急度バッジの色が正しく表示されている
- [ ] フォントが Noto Sans JP で表示されている

---

## 🎉 Day 3・全課程お疲れさまでした！

> **3 日間で学んだこと**
> - SSH パスワードレス接続と GitHub リポジトリ管理
> - Copilot Chat で README・仕様書を生成
> - `/create-skill` と `/create-agent` で AI ワークフローを構築
> - Skills & Agents だけでセキュリティ記事を自動生成
> - YJK ブランド CSS で記事のデザインを統一
> - git add / commit / push で GitHub に公開

---

## 6-1：テンプレートの考え方

記事生成システムのテンプレートは 2 層構造です：

```
[構成テンプレート]           [スタイルテンプレート]
templates/                  templates/styles/
├── article-template.html   ├── article.css       ← デフォルト
├── technical-report.html   ├── dark-theme.css    ← ダークテーマ
└── executive-summary.html  └── minimal.css       ← シンプル
```

| 種類 | 役割 | 変更内容 |
|------|------|---------|
| 構成テンプレート | 記事のセクション構成を定義 | 項目の有無・順序・見出し文言 |
| スタイルテンプレート | 見た目・デザインを定義 | 色・フォント・レイアウト |

---

## 6-2：デフォルトテンプレートを確認する

`templates/article-template.html` を VS Code で開いてみましょう。

テンプレートには以下のプレースホルダーが含まれています：

```html
{{ARTICLE_TITLE}}       ← 記事タイトル
{{GENERATED_DATE}}      ← 生成日時
{{SOURCE_URL}}          ← 元記事のURL
{{SUMMARY}}             ← 日本語要約
{{KEY_POINTS}}          ← 重要ポイント（HTMLリスト）
{{AFFECTED_SYSTEMS}}    ← 影響を受けるシステム
{{RECOMMENDED_ACTIONS}} ← 推奨アクション
{{REFERENCES}}          ← 参考リンク
```

---

## 6-3：新しい構成テンプレートを作る

Copilot Chat に頼んで「エグゼクティブサマリー向け」テンプレートを作ってもらいましょう：

```
Copilot Chat に入力：

「セキュリティニュースの記事を経営層向けに要約する
HTML テンプレートを作ってください。

含める内容：
1. インシデント名（大きく表示）
2. 緊急度（高/中/低 のバッジ）
3. 一言要約（2〜3 文）
4. 経営への影響（ビジネスリスクの観点から）
5. 必要なアクション（承認が必要なものだけ）
6. 参照元

ファイル名: templates/executive-summary.html」
```

---

## 6-4：ダークテーマスタイルを作る

`templates/styles/` フォルダに新しい CSS を追加しましょう。

Copilot Chat に頼む方法：

```
「templates/styles/article.css を参考に、
ダークテーマバージョンの CSS を作ってください。

要件：
- 背景色: #1a1a2e
- テキスト色: #e0e0e0
- アクセントカラー: #4ecdc4（ティール）
- コードブロック: #2d2d2d 背景
- モダンでプロフェッショナルな見た目

ファイル名: templates/styles/dark-theme.css」
```

---

## 6-5：テンプレートを選択できるようにスキルを更新する

`.github/skills/news-article-generator/SKILL.md` を更新して、  
テンプレートの選択もスキルで聞けるようにしましょう。

既存のスキルに以下の質問を追加：

```markdown
## 質問フロー（更新版）

以下の情報を順番に聞いてください：

1. **URL**（必須）: 記事を生成したいセキュリティニュースの URL
2. **記事テンプレート**（選択）:
   - `standard` — 標準テンプレート（デフォルト）
   - `technical` — 技術者向け詳細レポート
   - `executive` — エグゼクティブサマリー
3. **デザインテーマ**（選択）:
   - `default` — デフォルト（白背景）
   - `dark` — ダークテーマ
   - `minimal` — シンプルミニマル
4. **出力ファイル名**（省略可）
```

---

## 6-6：テンプレート切り替え機能をスクリプトに追加する

Copilot に頼んでスクリプトを拡張しましょう：

```
generate-article.js を開いた状態で Copilot Chat に入力：

「このスクリプトに --template と --style オプションを追加してください。

例:
  node generate-article.js --template executive --style dark

処理内容：
- templates/<template>-template.html を読み込む
- templates/styles/<style>.css の内容を HTML に埋め込む
- デフォルト値: template=standard, style=default」
```

---

## 6-7：テンプレートをバージョン管理する

テンプレートの変更もコミットして履歴を残しましょう：

```bash
# 新しいテンプレートを追加
git add templates/
git commit -m "feat: エグゼクティブサマリーとダークテーマテンプレートを追加"

# スキルの更新
git add .github/skills/news-article-generator/SKILL.md
git commit -m "feat: テンプレート選択オプションをスキルに追加"

# GitHub にプッシュ
git push origin main
```

---

## 6-8：発展アイデア

余裕がある方はさらに挑戦してみましょう：

### アイデア 1：複数記事のまとめページ
```
output/ フォルダの記事を一覧表示する index.html を自動生成する
```

### アイデア 2：記事の自動分類
```
記事の内容から「マルウェア」「脆弱性」「データ漏洩」などのカテゴリを
Copilot に判定させて、カテゴリ別にフォルダ分けする
```

### アイデア 3：Slack・Teams への通知
```
記事生成後に Webhook で Teams に通知を送る機能を追加する
```

### アイデア 4：定期実行（cron）
```
GitHub Actions で毎朝 9 時に特定サイトをチェックして記事を自動生成する
```

---

## ✅ 最終チェックリスト

**Step 1〜6 の総まとめ**

- [ ] SSH パスワードレスで GitHub に接続できている
- [ ] Copilot Chat で README や仕様書を生成した
- [ ] `.github/skills/` に独自スキルを作成した
- [ ] スキルをチャットから呼び出して URL を入力した
- [ ] HTML 記事が `output/` フォルダに生成された
- [ ] `git add` / `commit` / `push` で GitHub に反映した
- [ ] テンプレートを追加してデザインを変更した

---

## 🎉 おめでとうございます！

全ステップを完了しました。  
このリポジトリ自体が、あなたが GitHub Copilot を使いながら作った成果物です。

今後は：
- スキルをチームに共有する
- テンプレートを増やして記事の種類を増やす
- GitHub Actions で自動化をさらに進める

ことに挑戦してみてください。
