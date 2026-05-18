> 📅 **Day 2 — Step 1/2**

# Step 3：Skills & Agents を作る

---

## 🎯 このステップのゴール

- `/create-skill` と `/create-agent` でこのプロジェクトの Skill・Agent を作れる

---

## 構成

```
.github/
├── skills/news-article-generator/SKILL.md  ← 指揮者（#で呼び出す）
└── agents/
    ├── security-researcher.agent.md         ← URL調査
    ├── security-writer.agent.md             ← 記事執筆
    └── security-reviewer.agent.md           ← 品質レビュー
```

---

## 作り方：`/create-skill` と `/create-agent`

VS Code Copilot Chat（エージェントモード）で以下の流れで作成します。

### Skill（指揮者）を作る

1. Copilot Chat を開く（`Ctrl+Shift+I`）
`/create-skill` と入力して
2. 以下を貼り付けて送信：

```
セキュリティニュースのURLを受け取り、
Researcher→Writer→Reviewer の順にエージェントを呼び出して
日本語HTML記事を自動生成するスキルを作って。
ユーザーに聞くのはURL と対象読者（standard/technical/executive）の2つだけ。
GitコミットはしないことをDO NOTに書いて。
.github/skills/news-article-generator/SKILL.md に保存。
```

---

### Agent（ワーカー）を 3 つ作る

同じ Copilot Chat で順番に実行します。

**① Researcher**
→ `/create-agent`
```
セキュリティニュースのURLを調査して、タイトル・要約・CVE・CVSS・
緊急度・推奨アクションを構造化して返すエージェントを作って。
tools は web, search, read のみ。
.github/agents/security-researcher.agent.md に保存。
```

**② Writer**
→ `/create-agent`
```
Researcherの調査結果を受け取り、standard/technical/executive の
対象読者に合わせた日本語セキュリティ記事を執筆するエージェントを作って。
tools は read, edit のみ。
.github/agents/security-writer.agent.md に保存。
```


**③ Reviewer**
→ `/create-agent`
```
セキュリティ記事の正確性・アクションの具体性・読者適合性をレビューして
✅公開可 / ⚠️軽微な修正推奨 / ❌要修正 の3段階で判定するエージェントを作って。
tools は read, search のみ。
.github/agents/security-reviewer.agent.md に保存。
```

---

## 呼び出し方

```
Copilot Chat で /news-article-generator と入力
→ URLと対象読者を入力するだけで全自動
```

---

## ✅ チェックリスト

- [ ] SKILL.md が `.github/skills/news-article-generator/` に生成された
- [ ] 3 つの `.agent.md` が `.github/agents/` に生成された

---

## ➡️ 次のステップ

👉 [04_article-generation.md](04_article-generation.md) に進んでください
