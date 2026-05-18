> 📅 **Day 3 — Step 2/2**

# Step 6（発展）：テンプレートで記事をカスタマイズする

---

## 🎯 このステップのゴール

- 記事の構成テンプレートを保存・切り替えできる
- CSS スタイルテンプレートを読み込んで記事のデザインを変更できる
- Copilot Skill からテンプレートを指定して実行できる

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
