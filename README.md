# 🛡️ セキュリティニュース自動化 × GitHub Copilot 学習キット

> **社内学習向け** ｜ ローカルで動くセキュリティニュース記事自動化システムを構築しながら、GitHub / GitHub Copilot を実践的に学ぶハンズオン教材です。

---

## 🎯 この学習キットで身につくこと

| ステップ | テーマ | 習得スキル |
|---------|--------|-----------|
| Step 1 | GitHub 環境構築 | リポジトリ作成・SSH パスワードレス設定 |
| Step 2 | Copilot で文書作成 | README・仕様書・定義書の AI 生成 |
| Step 3 | Skills & Agents | `/` コマンドでカスタム AI を作る |
| Step 4 | 記事自動生成 | URL 入力 → HTML 記事を自動生成 |
| Step 5 | Git ワークフロー | add / commit / push の実践 |
| Step 6 | 発展：テンプレート | 記事構成・デザインのテンプレート化 |

---

## 📁 リポジトリ構成

```
security-news-outmation-demo/
├── README.md                         ← 本ファイル（学習キット概要）
├── .github/
│   ├── copilot-instructions.md       ← Copilot へのリポジトリ全体指示
│   └── skills/
│       ├── news-article-generator/
│       │   └── SKILL.md             ← ニュース記事生成スキル
│       └── article-reviewer/
│           └── SKILL.md             ← 記事レビュースキル
├── docs/
│   ├── 00_learning-overview.md      ← 学習全体マップ（まずここから）
│   ├── 01_github-setup.md           ← GitHub・SSH 設定手順
│   ├── 02_copilot-documents.md      ← Copilot で文書作成
│   ├── 03_skills-agents.md          ← Skills・Agents の作り方
│   ├── 04_article-generation.md     ← 記事自動生成の実装
│   ├── 05_git-workflow.md           ← Git add・commit・push
│   └── 06_advanced-templates.md    ← 発展：テンプレート活用
├── templates/
│   ├── article-template.html        ← 記事 HTML テンプレート
│   └── styles/
│       └── article.css             ← スタイルシート
├── scripts/
│   └── generate-article.js         ← 記事生成スクリプト（Node.js）
└── examples/
    └── sample-article.html         ← 完成サンプル記事
```

---

## 🚀 学習の始め方

### 前提条件

- VS Code がインストール済み
- GitHub アカウントを持っている
- Node.js 18 以上がインストール済み（`node -v` で確認）
- VS Code 拡張機能「GitHub Copilot」「GitHub Copilot Chat」がインストール済み

### ステップ 0：このリポジトリをクローン

```bash
git clone https://github.com/<your-org>/security-news-outmation-demo.git
cd security-news-outmation-demo
```

### ステップ 1：学習マップを読む

👉 [docs/00_learning-overview.md](docs/00_learning-overview.md) から始めてください。

各 doc ファイルを順番に読み、手を動かしながら進めましょう。

---

## 💡 学習のポイント

- **読むだけでなく手を動かす** ことが重要です
- Copilot Chat で「これって何？」と聞きながら進めましょう
- わからないことは `/explain` コマンドで Copilot に説明させましょう
- 完成したら自分でカスタマイズして発展させてみましょう

---

## 🏗️ このプロジェクトについて

このリポジトリ自体が **学習の成果物** です。  
セキュリティニュースの URL を入力すると、きれいな HTML 記事を自動生成するシステムを  
GitHub Copilot を使いながら構築していきます。

---

*学習でわからないことは、VS Code の Copilot Chat（`Ctrl+Shift+I`）で気軽に聞いてみてください。*
