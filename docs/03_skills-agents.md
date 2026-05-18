> 📅 **Day 2 — Step 1/2**

# Step 3：Skills & Agents を自分で作る

---

## 🎯 このステップのゴール

- `SKILL.md`（スキル）と `.agent.md`（エージェント）の構造を理解する
- 既存のエージェントファイルを読んで、何をしているか説明できる
- **自分で新しいエージェントを 1 つ作れる**

---

## 3-1：Skills と Agents — 2 種類のカスタマイズ

Copilot Chat には 2 つのカスタマイズ方法があります。

| | **Skills**（`SKILL.md`） | **Agents**（`.agent.md`） |
|--|------------------------|--------------------------|
| 配置場所 | `.github/skills/<名前>/` | `.github/agents/` |
| 呼び出し方 | チャットで `#スキル名` | チャットで `@エージェント名` |
| ツール実行 | ❌（AI への指示のみ） | ✅ `tools:` で指定 |
| 他エージェントを呼ぶ | ❌ | ✅ `tools: [agent]` |
| 用途 | 単発の指示テンプレート | 複数処理を自律的に連鎖 |

> 💡 このプロジェクトでは、複数の処理（調査→執筆→レビュー）をつなぐために **Agents** を使っています。

---

## 3-2：SKILL.md の構造（まず形式を理解する）

スキルはシンプルな 2 パート構成です。

```markdown
---
name: スキル名
description: "USE FOR: ... DO NOT USE FOR: ..."
argument-hint: "呼び出し時にユーザーへ表示するヒント"
---

# 本文（AI への指示）

ここに手順・制約・出力フォーマットを Markdown で書く
```

### ✏️ 練習 A：Security Glossary スキルを作る

セキュリティ用語を日本語で解説する簡単なスキルを作ってみましょう。

```bash
# フォルダとファイルを作成
mkdir -p .github/skills/security-glossary
code .github/skills/security-glossary/SKILL.md
```

以下を参考に自分で書いてみてください（コピーせず、理解しながら書く）：

```markdown
---
name: security-glossary
description: "セキュリティ用語を日本語でわかりやすく解説する。USE FOR: 用語の意味を知りたい、セキュリティ概念を説明したい。"
argument-hint: "解説してほしいセキュリティ用語を入力してください（例: ランサムウェア、CVSS、ゼロデイ）"
---

# セキュリティ用語解説スキル

ユーザーが入力した用語を以下の形式で日本語解説してください。

## 解説フォーマット

### 【用語名】

**一言でいうと**
（1〜2 文で端的に）

**詳しく説明すると**
（3〜5 文で背景・仕組みを説明）

**具体的な例**
（実際の攻撃例やインシデント例）

**対策**
- 対策 1
- 対策 2
```

書けたら Copilot Chat で `#security-glossary` と入力して呼び出してみましょう。

---

## 3-3：`.agent.md` の構造（エージェント形式を理解する）

エージェントはスキルより多くのことができます。

```markdown
---
name: "エージェントの表示名"
description: "USE FOR: ... DO NOT USE FOR: ..."
tools: [read, edit, execute, agent, web, search, todo]
user-invocable: true
argument-hint: "呼び出し時のヒント"
---

## 制約
- DO NOT ...（やってはいけないこと）
- ONLY ...（必ずやること）

## 作業フロー

### Step 1: ...
### Step 2: ...
```

### `tools` に指定できる値

| ツール | できること |
|--------|-----------|
| `read` | ファイルを読む |
| `edit` | ファイルを書く・作る |
| `execute` | ターミナルコマンドを実行 |
| `agent` | 他のエージェントを呼び出す ← サブエージェントの核心 |
| `web` | Web ページにアクセス |
| `search` | ファイル・コードを検索 |
| `todo` | 進捗リストで作業を管理 |

---

## 3-4：既存エージェントを読んで理解する

このリポジトリには 4 つのエージェントがあります。VS Code で開いて読んでみましょう。

```bash
ls .github/agents/
# security-news-generator.agent.md  ← オーケストレーター
# security-researcher.agent.md      ← URL 調査
# security-writer.agent.md          ← 記事執筆
# security-reviewer.agent.md        ← 品質レビュー
```

### 確認してほしいポイント

**`security-news-generator.agent.md` を開いて：**
- `tools:` に `agent` が含まれているか確認する（これがサブエージェント呼び出しの鍵）
- `DO NOT` 制約で「Git コミットを実行しないこと」が書いてあるか確認する
- Step 1〜6 の流れを追ってみる

**`security-researcher.agent.md` を開いて：**
- `tools:` に `execute` がない理由を考える（調査だけ → 実行不要）
- 出力フォーマットが構造化されている理由を考える（→ writer が使いやすいように）

**`security-reviewer.agent.md` を開いて：**
- `user-invocable: true` の意味を確認する（単体でも呼べる）
- レビュー判定の 3 段階（✅/⚠️/❌）を確認する

---

## 3-5：✏️ 練習 B：自分でサブエージェントを作る

### お題：「社内共有メッセージ生成エージェント」

記事が完成したら、Slack や Teams に貼れる社内共有文を生成するエージェントを作ってみましょう。

```bash
code .github/agents/security-notifier.agent.md
```

**参考にする構造：** `security-reviewer.agent.md` を見ながら、以下を自分で埋めてください。

```markdown
---
name: "Security Notifier"
description: "生成されたセキュリティ記事の社内共有メッセージを作成する。USE FOR: ..."
tools: [read]
user-invocable: true
---

## 制約
- DO NOT ...
- ONLY ...

## 入力

security-news-generator から以下の情報を受け取る：
- 記事タイトル
- 緊急度
- 一言要約
- 推奨アクション（高優先のみ）
- ファイルパス

## 出力フォーマット

### Slack 向け

（ここを自分で設計してみてください）

### メール向け件名

（ここも自分で設計してみてください）
```

> 💡 **Copilot に頼む方法**: `.github/agents/security-reviewer.agent.md` を開いた状態で  
> Copilot Chat に「これを参考に Security Notifier エージェントを作って」と頼んでみましょう。

---

## 3-6：オーケストレーターに新しいエージェントを組み込む（発展）

`security-news-generator.agent.md` を編集して、Step 6（完了報告）の前に  
`Security Notifier` を呼び出すように修正してみましょう。

```markdown
### Step 5.5: `Security Notifier` に共有メッセージ生成を依頼（追加）

`Security Notifier` サブエージェントを呼び出し、社内共有用のメッセージを生成させる。
生成されたメッセージを完了報告に含める。
```

---

## ✅ チェックリスト

- [ ] Skills（`SKILL.md`）と Agents（`.agent.md`）の違いを説明できる
- [ ] `security-glossary/SKILL.md` を自分で書いて `#security-glossary` で呼び出した
- [ ] 既存の 4 つのエージェントファイルを読んで、各役割を理解した
- [ ] `security-notifier.agent.md` を自分で作った
- [ ] （発展）オーケストレーターにノーティファイアーを組み込んだ

---

## ➡️ 次のステップ

👉 [04_article-generation.md](04_article-generation.md) に進んでください

---

## 🎯 このステップのゴール

- `.github/skills/` に SKILL.md を配置して `/` コマンドで呼び出せる
- ユーザーに質問して URL を入力させる対話型スキルを作る
- スキルが正しく動作することを確認する

---

## 3-1：Skills とは何か？

**Skill（スキル）** は、VS Code + GitHub Copilot Chat で使えるカスタム AI 指示ファイルです。

```
プロジェクトルート/
└── .github/
    └── skills/
        └── news-article-generator/   ← スキル名（フォルダ名）
            └── SKILL.md              ← Markdown 1 ファイルだけ
```

このファイルを置くだけで、Copilot Chat の `#` メニューから呼び出せるようになります。

> 💡 **スキルの使いどころ**: プロジェクト固有の作業（記事生成・コードレビュー・テスト生成など）を  
> チームで共通の手順で Copilot に実行させたいときに便利です。

---

## 3-2：SKILL.md の基本構造

```markdown
---
name: スキル名（英数字・ハイフン）
description: "Copilot が自動選択するときの説明文（日本語OK）"
argument-hint: "呼び出し時にユーザーへ表示するヒント"
---

# 本文（AIへの指示）

ここに Copilot への指示を Markdown で書く
```

| パート | 説明 |
|--------|------|
| `name` | `#` で呼び出すときの名前 |
| `description` | Copilot がスキルを自動選択する判断基準 |
| `argument-hint` | スキル呼び出し時にユーザーへ表示されるヒント |
| 本文 | AI への指示（手順・形式・制約など） |

---

## 3-3：既存のスキルを確認する

このリポジトリにはすでに 2 つのスキルが入っています：

```bash
ls .github/skills/
# news-article-generator/
# article-reviewer/
```

VS Code で `.github/skills/news-article-generator/SKILL.md` を開いてみましょう。

---

## 3-4：スキルを呼び出してみる

1. VS Code で Copilot Chat を開く（`Ctrl+Shift+I`）
2. チャット欄に `#` を入力
3. `news-article-generator` が候補に表示される
4. 選択して Enter
5. スキルが起動し、URL の入力を促される

### 実際に試す

```
# Copilot Chat のチャット欄に入力：
#news-article-generator

# Copilot が質問してくる：
# 「記事を生成したいセキュリティニュースの URL を入力してください」

# URL を貼り付ける（例）：
https://www.ipa.go.jp/security/vuln/20260101.html
```

---

## 3-5：自分でスキルを作ってみる（ハンズオン）

では実際に **新しいスキル** を自分で作ってみましょう。

### お題：「セキュリティ用語を日本語で解説するスキル」

```bash
# スキルフォルダを作成
mkdir -p .github/skills/security-glossary
```

VS Code で `.github/skills/security-glossary/SKILL.md` を新規作成して、以下を参考に書いてみてください：

```markdown
---
name: security-glossary
description: "セキュリティ用語を日本語でわかりやすく解説する"
argument-hint: "解説してほしいセキュリティ用語を入力してください（例：ランサムウェア、SQLインジェクション）"
---

# セキュリティ用語解説スキル

ユーザーが入力したセキュリティ用語を、以下の形式で日本語解説してください。

## 質問フロー

ユーザーに以下を聞いてください：

1. 解説してほしいセキュリティ用語（必須）
2. 想定読者のレベル（選択肢：入門者 / IT担当者 / セキュリティ専門家）

## 出力形式

### 【用語名】

**一言でいうと**  
（1〜2 文で端的に）

**詳しく説明すると**  
（3〜5 文で背景・仕組みを説明）

**具体的な例**  
（実際のインシデント例や攻撃シナリオ）

**対策**  
- 対策 1
- 対策 2
- 対策 3
```

---

## 3-6：ユーザー入力を受け取る 2 つの方法

### 方法 1：`argument-hint` でヒントを表示

```yaml
argument-hint: "解析したいURLを入力してください"
```

スキル呼び出し時に、チャット欄の下にヒントが表示されます。

### 方法 2：本文で質問指示を書く

```markdown
## 質問フロー

以下の情報をユーザーに聞いてから処理を開始してください：

1. **URL**（必須）: 記事を生成したいセキュリティニュースの URL
2. **出力先ファイル名**（省略可、デフォルト: `output/article.html`）
3. **記事のトーン**（選択肢: 技術者向け / 一般向け）
```

> 💡 **ポイント**: 「聞いてから処理」と書くことで、  
> Copilot がチャット内でユーザーに質問する UI を自動生成してくれます。

---

## 3-7：Copilot Instructions（リポジトリ全体の指示）

`.github/copilot-instructions.md` は、このリポジトリ全体に対する Copilot の振る舞いを定義するファイルです。

このリポジトリの `copilot-instructions.md` を開いて内容を確認してみましょう。

---

## ✅ チェックリスト

- [ ] `.github/skills/news-article-generator/SKILL.md` の内容を読んだ
- [ ] `#news-article-generator` でスキルを呼び出せた
- [ ] 自分で新しいスキル（`security-glossary`）を作った
- [ ] `argument-hint` の動きを確認した

---

## ➡️ 次のステップ

👉 [04_article-generation.md](04_article-generation.md) に進んでください
