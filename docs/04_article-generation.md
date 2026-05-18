> 📅 **Day 2 — Step 2/2**

# Step 4：セキュリティニュース記事を自動生成する

---

## 🎯 このステップのゴール

- Copilot Chat に頼んで依存パッケージのインストールとスクリプト実行まで完了できる
- `/news-article-generator` スキルで URL を入力して HTML 記事を生成できる
- 生成された記事が `output/` フォルダに保存される

---

## 4-1：システムの全体像

```
Copilot Chat で /news-article-generator を呼び出す
    ↓
Skill が Researcher → Writer → Reviewer を順番に呼び出す
    ↓
generate-article.js が HTML ファイルを生成
    ↓
output/<ファイル名>.html が完成
```

---

## 4-2：Copilot Chat に環境構築を頼む

ターミナルは自分で触らず、Copilot Chat（エージェントモード）に頼みます。

**Copilot Chat に以下を貼り付けて送信：**

```
このリポジトリの package.json を確認して、
必要な依存パッケージをインストールして。
その後 output/ フォルダを作って、
scripts/generate-article.js が実行できる状態にして。
```

Copilot がターミナルで `npm install` と `mkdir -p output` を実行してくれます。

---

## 4-3：スクリプトの動作を Copilot に説明させる

`scripts/generate-article.js` を開いた状態で Copilot Chat に入力：

```
このスクリプトが何をしているか、
処理の流れを日本語で説明して
```

コードを読まなくても Copilot が解説してくれます。

---

## 4-4：スキルを呼び出して記事を生成する

1. Copilot Chat を開く（`Ctrl+Shift+I`）
2. `/news-article-generator` と入力して Enter
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

## 4-5：生成された記事を確認する

Copilot Chat に頼みます：

```
output/ フォルダの HTML ファイルをブラウザで開いて
```

または VS Code の Simple Browser で開く：
- `Ctrl+Shift+P` → `Simple Browser: Show` → `output/*.html` のパスを入力

---

## 4-6：生成記事の構成

| セクション | 内容 |
|-----------|------|
| ヘッダー | タイトル・取得日時・ソース URL |
| 要約 | 日本語要約（3〜5 文） |
| 重要ポイント | 箇条書き（3〜5 項目） |
| 影響を受けるシステム | 対象 OS・ソフトウェア |
| 推奨アクション | 優先度付き対策手順 |
| 参考リンク | 元記事・関連情報 |

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