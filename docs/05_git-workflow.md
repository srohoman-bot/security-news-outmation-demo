> 📅 **Day 3 — Step 1/2**

# Step 5：Git ワークフロー — add / commit / push

---

## 🎯 このステップのゴール

- `git add`・`git commit`・`git push` の流れを理解する
- 意味のあるコミットメッセージを書けるようになる
- GitHub 上でプッシュした内容を確認できる

---

## 5-1：Git の基本概念（3 つのエリア）

```
[作業フォルダ]  →  git add  →  [ステージングエリア]  →  git commit  →  [ローカルリポジトリ]
                                                                              │
                                                                         git push
                                                                              │
                                                                              ▼
                                                                    [GitHub（リモート）]
```

| エリア | 説明 |
|--------|------|
| 作業フォルダ | 実際にファイルを編集する場所 |
| ステージングエリア | コミットする変更を「仮置き」する場所 |
| ローカルリポジトリ | コミット履歴が保存される場所（PC 内） |
| GitHub（リモート） | チームで共有するリポジトリ |

---

## 5-2：現在の状態を確認する

```bash
# 変更されたファイルの一覧を表示
git status
```

出力の見方：

```
On branch main

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)

        modified:   scripts/generate-article.js   ← 変更あり（赤）

Untracked files:
  (use "git add <file>..." to include in what will be committed)

        output/sample-article.html                ← 新規ファイル（赤）
```

---

## 5-3：git add — 変更をステージに追加

```bash
# 特定のファイルを追加
git add scripts/generate-article.js

# 複数ファイルを追加
git add scripts/generate-article.js output/sample-article.html

# 変更されたファイルをすべて追加（新規ファイルは含まない）
git add -u

# 全ての変更・新規ファイルを追加（よく使う）
git add .

# 追加結果を確認
git status
```

> ⚠️ `git add .` は全ファイルを追加します。  
> **機密情報（パスワード・APIキー）が含まれるファイルを誤って追加しないよう注意**してください。  
> `.gitignore` で除外設定することが重要です。

---

## 5-4：.gitignore を設定する

コミットしてはいけないファイルを `.gitignore` に記載します：

```bash
# .gitignore ファイルを作成
cat << 'EOF' > .gitignore
# Node.js
node_modules/
npm-debug.log*

# 生成された記事（テスト用）
output/*.html

# 環境変数・秘密情報
.env
.env.local
*.key
*.pem

# OS・エディタ
.DS_Store
Thumbs.db
.vscode/settings.json
EOF
```

<details>
<summary>▼ PowerShell の場合（ヒアドキュメントは使えないため）</summary>

```powershell
@"
# Node.js
node_modules/
npm-debug.log*

# 生成された記事（テスト用）
output/*.html

# 環境変数・秘密情報
.env
.env.local
*.key
*.pem

# OS・エディタ
.DS_Store
Thumbs.db
.vscode/settings.json
"@ | Set-Content .gitignore
```

</details>

---

## 5-5：git commit — ステージをコミットする

```bash
# コミットメッセージを付けてコミット
git commit -m "feat: セキュリティニュース記事生成スクリプトを追加"

# コミット履歴を確認
git log --oneline
```

### 良いコミットメッセージの書き方

```
<種別>: <変更内容の要約>（50文字以内）

種別の例：
  feat:   新機能の追加
  fix:    バグ修正
  docs:   ドキュメントのみの変更
  style:  コードの意味に影響しない変更（フォーマットなど）
  refactor: リファクタリング（機能変更なし）
  chore:  ビルドプロセスや補助ツールの変更
```

**良い例：**
```bash
git commit -m "feat: URL入力から HTML記事を自動生成する機能を追加"
git commit -m "docs: README にセットアップ手順を追記"
git commit -m "fix: 日本語URLが文字化けするバグを修正"
```

**悪い例：**
```bash
git commit -m "修正"          # 何を修正したか不明
git commit -m "update"        # 変更内容が不明
git commit -m "あれこれ直した"  # 具体性がない
```

---

## 5-6：git push — GitHub に送信する

```bash
# メインブランチにプッシュ
git push origin main

# 初回プッシュ（ブランチが存在しない場合）
git push -u origin main
```

> 💡 SSH でクローンしていれば、パスワード入力なしにプッシュできます。

---

## 5-7：実践：今の状態をプッシュしてみる

このステップで行った変更をまとめてプッシュしましょう：

```bash
# 現在の状態を確認
git status

# 全変更をステージに追加
git add .

# コミット
git commit -m "feat: セキュリティニュース学習キット初期構築"

# GitHub にプッシュ
git push origin main
```

---

## 5-8：GitHub で確認する

1. ブラウザで GitHub のリポジトリページを開く
2. **Commits** タブをクリック
3. 先ほどのコミットが表示されていれば成功

---

## 5-9：よく使う Git コマンド早見表

```bash
# 状態確認
git status              # 変更ファイルの確認
git log --oneline       # コミット履歴（短縮）
git diff                # 変更差分を表示

# 変更を元に戻す
git restore <file>      # 作業フォルダの変更を取り消す
git restore --staged <file>  # ステージから取り除く

# リモートと同期
git pull origin main    # GitHub から最新を取得
git fetch               # 取得だけ（マージしない）

# ブランチ
git branch              # ブランチ一覧
git checkout -b feature/new-template  # 新しいブランチを作成して切り替え
git checkout main       # main ブランチに戻る
```

---

## 5-10：Copilot でコミットメッセージを生成する

VS Code の Source Control パネル（`Ctrl+Shift+G`）で、  
コミットメッセージ欄の「✨」アイコンをクリックすると、  
Copilot がコミットメッセージを自動生成してくれます。

---

## ✅ チェックリスト

- [ ] `git status` で変更ファイルを確認した
- [ ] `.gitignore` を作成した
- [ ] `git add .` でステージに追加した
- [ ] わかりやすいメッセージで `git commit` した
- [ ] `git push origin main` で GitHub にプッシュした
- [ ] GitHub のブラウザでコミットを確認した

---

## ➡️ 次のステップ

👉 [06_advanced-templates.md](06_advanced-templates.md) に進んでください
