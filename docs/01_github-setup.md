> 📅 **Day 1 — Step 1/2**

# Step 1：GitHub 環境構築 ＆ SSH パスワードレス設定

---

## 🎯 このステップのゴール

- GitHub にリポジトリを作成できる
- SSH キーを生成し、パスワードなしで GitHub にアクセスできる
- VS Code からクローンして作業できる状態にする

---

## 1-1：GitHub アカウントの確認

ブラウザで [https://github.com](https://github.com) にアクセスし、ログインできることを確認してください。

---

## 1-2：SSH キーの生成

ターミナルを開いて、以下のコマンドを実行します。

```bash
# SSH キーを生成（Ed25519 形式推奨）
ssh-keygen -t ed25519 -C "your-email@example.com"
```

**対話式プロンプトへの回答：**

```
Enter file in which to save the key: [Enter でデフォルト（~/.ssh/id_ed25519）]
Enter passphrase: [Enter を押してパスフレーズなし ← パスワードレスのポイント]
Enter same passphrase again: [Enter]
```

> 💡 **ポイント**: パスフレーズを空にすることで「パスワードレス」になります。  
> セキュリティが気になる場合は ssh-agent を使う方法もあります（後述）。

---

## 1-3：公開鍵を GitHub に登録

```bash
# 公開鍵の内容を表示
cat ~/.ssh/id_ed25519.pub
```

表示された内容（`ssh-ed25519 AAAA...` から始まる 1 行）を全てコピーします。

### GitHub への登録手順

1. GitHub にログイン
2. 右上のアバター → **Settings**
3. 左メニュー → **SSH and GPG keys**
4. **New SSH key** ボタンをクリック
5. Title に分かりやすい名前（例: `work-laptop-2026`）を入力
6. Key タイプ: **Authentication Key**
7. Key 欄にコピーした公開鍵をペースト
8. **Add SSH key** をクリック

---

## 1-4：SSH 接続のテスト

```bash
ssh -T git@github.com
```

以下のように表示されれば成功です：

```
Hi <your-username>! You've successfully authenticated, but GitHub does not provide shell access.
```

---

## 1-5：GitHub でリポジトリを作成

1. GitHub の右上「**+**」→「**New repository**」
2. 設定例：

| 項目 | 値 |
|------|-----|
| Repository name | `security-news-outmation-demo` |
| Description | セキュリティニュース自動化学習キット |
| Visibility | Private（社内利用のため） |
| Initialize with README | チェックなし（後で追加） |

3. **Create repository** をクリック

---

## 1-6：リポジトリをローカルにクローン

```bash
# SSH URL でクローン（HTTPS ではなく SSH を選ぶ）
git clone git@github.com:<your-username>/security-news-outmation-demo.git

# クローンしたフォルダに移動
cd security-news-outmation-demo

# VS Code で開く
code .
```

> 💡 **SSH でクローンすること** がパスワードレスのポイントです。  
> HTTPS でクローンすると毎回トークン入力が必要になります。

---

## 1-7：Git の初期設定（初回のみ）

```bash
# 自分の名前とメールを設定
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"

# 設定確認
git config --list
```

---

## ✅ チェックリスト

- [ ] `ssh -T git@github.com` でパスワードなしに認証できた
- [ ] GitHub にリポジトリが作成された
- [ ] SSH URL でクローンできた
- [ ] VS Code でフォルダが開けた

---

## ❓ よくあるトラブル

### `Permission denied (publickey)` が出る

```bash
# SSH エージェントに鍵を追加
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# 再テスト
ssh -T git@github.com
```

<details>
<summary>▼ PowerShell の場合</summary>

```powershell
# SSH エージェントサービスを起動して鍵を登録
Start-Service ssh-agent
ssh-add $env:USERPROFILE\.ssh\id_ed25519

# 再テスト
ssh -T git@github.com
```

> ⚠️ `Start-Service` が「アクセスが拒否されました」と出る場合は、  
> PowerShell を**管理者として実行**してから `Set-Service ssh-agent -StartupType Automatic` を一度だけ実行してください。

</details>

### 複数の SSH キーを使い分けたい場合

`~/.ssh/config` ファイルを作成：

```
Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519
```

---

## ➡️ 次のステップ

👉 [02_copilot-documents.md](02_copilot-documents.md) に進んでください
