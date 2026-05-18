> 📅 **Day 2 — Step 2/2**

# Step 4：セキュリティニュース記事を自動生成する

---

## 🎯 このステップのゴール

- `#news-article-generator` スキルで URL を入力して HTML 記事を生成できる
- 生成された記事が `output/` フォルダに保存される

---

## 4-1：システムの全体像

```
#news-article-generator を呼び出す
    ↓
Researcher が URL を調査
    ↓
Writer が日本語 HTML を output/ に直接保存
    ↓
Reviewer が品質チェック
    ↓
output/<ファイル名>.html が完成
```

Node.js もターミナルも不要。Copilot が全部やってくれます。

---

## 4-2：スキルを呼び出して記事を生成する

1. Copilot Chat を開く（`Ctrl+Shift+I`）
2. `#news-article-generator` と入力して Enter
3. セキュリティニュースの URL を貼り付ける
4. 対象読者を選ぶ（standard / technical / executive）
5. Skill が自動で Researcher → Writer → Reviewer を呼び出す
6. 完了報告が届いたら `output/` フォルダに HTML が生成されている

**試す URL の例（公開情報）：**
```
https://www.ipa.go.jp/security/vuln/index.html
https://www.jpcert.or.jp/at/
https://www.cisa.gov/known-exploited-vulnerabilities-catalog
```

---

## 4-3：生成された記事を確認する

VS Code の Simple Browser で開く：
- `Ctrl+Shift+P` → `Simple Browser: Show` → `output/*.html` のパスを入力

または Copilot Chat に頼む：

```
output/ フォルダの HTML ファイルをブラウザで開いて
```

---

## 4-4：生成記事の構成

| セクション | 内容 |
|-----------|------|
| タイトルバー | 記事タイトル・緊急度・生成日時 |
| 概要 | 日本語要約（3〜5 文） |
| 重要ポイント | 箇条書き（3〜5 項目） |
| 影響を受けるシステム | 対象 OS・ソフトウェア・バージョン |
| 推奨アクション | 優先度付き対策手順 |
| 参考リンク | 元記事 URL |

---

## ✅ チェックリスト

- [ ] `#news-article-generator` でスキルを呼び出せた
- [ ] URL を入力して HTML 記事が `output/` に保存された
- [ ] ブラウザで生成記事が表示された

---

## 🎉 Day 2 お疲れさまでした！

> **Day 2 で学んだこと**
> - `/create-skill` / `/create-agent` で Skill・Agent を作った
> - `#news-article-generator` でスキルを呼び出して記事生成が動いた
> - Node.js もターミナルも使わず、Copilot だけで HTML 記事が完成した

> **Day 3 の予告**
> 作った成果物を **git add / commit / push** で GitHub にアップロードします。

👉 [05_git-workflow.md](05_git-workflow.md)（Day 3 開始）に進んでください
---

## ✅ チェックリスト

- [ ] Copilot Chat に頼んで `npm install` が完了した
- [ ] `/news-article-generator` でスキルを呼び出せた
- [ ] URL を入力して HTML 記事が `output/` に保存された
- [ ] ブラウザで生成記事が表示された

---

## 🎉 Day 2 お疲れさまでした！

> **Day 2 で学んだこと**
> - `/create-skill` / `/create-agent` で Skill・Agent を作った
> - `/news-article-generator` でスキルを呼び出して記事生成が動いた

> **Day 3 の予告**
> 作った成果物を **git add / commit / push** で GitHub にアップロードします。

👉 [05_git-workflow.md](05_git-workflow.md)（Day 3 開始）に進んでください