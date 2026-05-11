# BURGER & SHRIMP オンラインショップ

ハンバーガー店の物販用ECサイト。Next.js + Firebase + Stripe + Vercel構成。
**ターミナル不使用** で公開できるように作っています。

---

## できること

- ビーフパティ・ガーリックシュリンプの単品販売（個数選択）
- カート（ブラウザに保存）
- Stripeクレジットカード決済（売上はお店の銀行口座に振込）
- 47都道府県別の送料計算（1万円以上で送料無料）
- 管理画面で注文確認・ステータス管理・商品登録
- **ヤマトB2クラウド用CSVをワンクリックでダウンロード** → B2クラウドに取り込めば送り状が作れる

---

## 公開までの全体の流れ（所要：半日〜1日）

1. **Firebase プロジェクトを作る** （無料）
2. **Stripe アカウントを作る** （事業者審査あり・無料）
3. **GitHub アカウントを作って、このフォルダの中身をアップロード**
4. **Vercel に GitHub を連携してデプロイ**（無料プランでOK）
5. **環境変数を Vercel に登録**
6. **独自ドメインを Vercel に接続**
7. **管理者アカウントを Firebase Auth に作成**
8. **商品を登録・テスト購入**

---

## 1. Firebase プロジェクトを作る

1. https://console.firebase.google.com にGoogleアカウントでログイン
2. 「プロジェクトを追加」→ 名前は何でもOK（例：`burger-shrimp-ec`）
3. Googleアナリティクスは「無効」でOK
4. プロジェクトができたら **左メニュー** から以下を順に有効化:
   - **Authentication** → 「始める」 → 「メール/パスワード」を有効化
   - **Firestore Database** → 「データベースを作成」 → 本番モードで開始 → リージョンは `asia-northeast1（東京）`
   - **Storage**（商品画像用、任意） → 「始める」

### Firebase の設定値（フロント用）を取得

1. プロジェクト設定（⚙️アイコン）→ 「全般」タブを下にスクロール
2. 「マイアプリ」→ **ウェブアプリ（</>アイコン）** を追加
3. アプリ名を入れて登録すると `firebaseConfig` のJSONが出る
4. 以下の6つをメモ:

```js
apiKey: "...",
authDomain: "...",
projectId: "...",
storageBucket: "...",
messagingSenderId: "...",
appId: "..."
```

### Firebase Admin（サーバー用）を取得

1. プロジェクト設定 → 「サービスアカウント」タブ
2. 「新しい秘密鍵を生成」をクリックして **JSONファイル** をダウンロード
3. ファイルを開くと中に以下があるので、これも後で使う:
   - `project_id`
   - `client_email`
   - `private_key`（改行 \n がたくさん入った長い文字列）

⚠️ **このJSONファイルはGitHubに絶対アップロードしないこと**

### Firestoreのセキュリティルールを設定

1. Firestore Database → 「ルール」タブ
2. このリポジトリの `firestore.rules` の中身をコピペして「公開」

### 管理者アカウントを作成

1. Authentication → 「Users」タブ → 「ユーザーを追加」
2. メールアドレスとパスワードを入力（このメアドが管理画面のログイン用）

---

## 2. Stripe アカウントを作る

1. https://stripe.com/jp にアクセスして「今すぐ始める」
2. メールで登録 → ビジネス情報入力
3. **「事業の所在地: 日本」** にする
4. 銀行口座（売上振込先）を登録 → **お店の銀行口座を指定**
5. 本人確認書類を提出（数日で審査完了。完了するまではテスト決済のみ可能）

### APIキーを取得

1. ダッシュボード → 開発者 → 「APIキー」
2. **公開可能キー**（`pk_test_...`）と **シークレットキー**（`sk_test_...`）をメモ
3. 本番稼働時は右上のトグルで「本番」に切り替えて `pk_live_...` / `sk_live_...` を取得

### Webhookを設定（重要・後でVercelにデプロイしてから）

1. 開発者 → Webhook → 「エンドポイントを追加」
2. URL: `https://あなたのドメイン/api/webhooks/stripe`
3. リッスンするイベント:
   - `checkout.session.completed`
   - `checkout.session.expired`
   - `checkout.session.async_payment_failed`
4. 作成後、「署名シークレット」（`whsec_...`）をメモ

---

## 3. GitHub にアップロード

ターミナル不要の方法:

1. https://github.com で無料アカウント作成
2. 右上 ＋ → New repository
3. リポジトリ名は `burger-shop` など。**Private** を選ぶこと
4. 「Create repository」
5. 「**uploading an existing file**」リンクをクリック
6. このフォルダの **中身を全部ドラッグ&ドロップ**（`node_modules` は無いはず）
7. 「Commit changes」

---

## 4. Vercel でデプロイ

1. https://vercel.com に GitHub アカウントで Sign Up
2. 「Add New...」→「Project」
3. GitHubのリポジトリ一覧から `burger-shop` を選んで「Import」
4. Framework Preset: **Next.js** が自動で選ばれる
5. **環境変数（Environment Variables）** を以下のように登録:

| 変数名 | 値 |
|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebaseのapikey |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebaseのauthdomain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebaseのprojectid |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebaseのstoragebucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebaseのsenderid |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | FirebaseのappId |
| `FIREBASE_ADMIN_PROJECT_ID` | サービスアカウントJSONのproject_id |
| `FIREBASE_ADMIN_CLIENT_EMAIL` | サービスアカウントJSONのclient_email |
| `FIREBASE_ADMIN_PRIVATE_KEY` | サービスアカウントJSONのprivate_key（**そのまま貼り付け。改行はそのまま**） |
| `STRIPE_SECRET_KEY` | Stripeの sk_test_... または sk_live_... |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripeの pk_test_... または pk_live_... |
| `STRIPE_WEBHOOK_SECRET` | Stripe Webhookの whsec_...（後で追加でもOK） |
| `ADMIN_EMAILS` | 管理者のメアド（カンマ区切り） |
| `NEXT_PUBLIC_SITE_URL` | https://あなたのドメイン |

6. 「Deploy」をクリック → 数分待つと公開URLが発行される（例：`burger-shop.vercel.app`）

---

## 5. 独自ドメインを接続

1. Vercel のプロジェクト → Settings → Domains
2. 「Add」 → ご自身のドメインを入力（例：`shop.your-restaurant.com`）
3. 表示されるDNSレコード（CNAMEまたはA）を **ドメイン管理会社（お名前.com / Cloudflare等）** に設定
4. 数十分〜数時間で反映される

---

## 6. Stripe Webhookを設定（再）

上記のURLが確定したら、Stripe → Webhookに戻って:
- URL: `https://あなたのドメイン/api/webhooks/stripe`
- `whsec_...` を取得して Vercel の環境変数 `STRIPE_WEBHOOK_SECRET` に登録
- Vercel で「Redeploy」

---

## 7. 商品を登録してテスト購入

1. `https://あなたのドメイン/admin/login` にアクセス
2. Firebase Authenticationで作った管理者メアド/パスワードでログイン
3. 「商品管理」→ 「新規追加」で商品を登録
   - 商品画像URLは、Firebase Storageや、UnsplashなどのURLを貼り付け
4. トップに戻って商品を購入してみる（テストモードなら Stripe のテストカード `4242 4242 4242 4242` 任意の将来日付・任意の3桁CVC で決済可）
5. 「注文管理」で注文が `paid` になっていることを確認

---

## 8. ヤマト B2クラウド用CSVのダウンロード

1. `/admin/orders` → 発送したい注文にチェック
2. 「ヤマトB2用CSVダウンロード」をクリック
3. ダウンロードしたCSVを **B2クラウドの「送り状データ取込」** から取り込み
4. B2クラウドで送り状を印刷

### ⚠️ 重要：B2クラウドCSVのカスタマイズ

`lib/yamato-csv.ts` の冒頭に **出荷元（お店の住所・電話）** をハードコードしています。
**必ずあなたのお店の情報に書き換えてください。**

```ts
const SENDER = {
  name: 'BURGER & SHRIMP',
  nameKana: 'バーガーアンドシュリンプ',
  phone: '00-0000-0000',
  postalCode: '0000000',
  address: '東京都千代田区〇〇1-2-3',
  building: '',
};
```

また、B2クラウドのテンプレートCSVをダウンロードして列の順序や名称が一致しているか必ず確認してください。
列順がズレるとB2クラウドが取り込みエラーを出します。

---

## 法律・許認可についての注意

⚠️ **食品の通販には販売許可が必要な場合があります。**

- 「肉のパティを冷凍で通販」する場合 → **食肉販売業の許可** が必要
- 飲食店営業許可だけでは **通販はできません**
- 必ず **管轄の保健所** に確認してください
- 「ガーリックシュリンプ」も加工食品扱いになるため、製造業の許可が必要なケースがあります

特商法・利用規約・プライバシーポリシーの3ページにある「〇〇」の部分は、
実際の事業者情報に書き換えてから公開してください。

---

## カスタマイズしたい場所

| やりたいこと | 触るファイル |
|---|---|
| サイト名・キャッチコピー変更 | `app/layout.tsx`, `app/page.tsx`, `components/Header.tsx`, `components/Footer.tsx` |
| ヒーロー画像変更 | `app/page.tsx` の `backgroundImage` |
| 送料変更 | `lib/shipping.ts` |
| 送料無料の閾値変更 | `lib/shipping.ts` の `FREE_SHIPPING_THRESHOLD` |
| 特商法の表記 | `app/legal/tokushoho/page.tsx` |
| プライバシーポリシー | `app/legal/privacy/page.tsx` |
| ヤマト出荷元情報 | `lib/yamato-csv.ts` の `SENDER` |
| ヤマトCSVの列定義 | `lib/yamato-csv.ts` の `COLUMNS` |
| 配送時間帯コード | `lib/yamato-csv.ts` の `timeSlotCode()` |

---

## トラブルシューティング

### ビルドが失敗する
- 環境変数が登録されているか確認
- `FIREBASE_ADMIN_PRIVATE_KEY` は改行コードを含むので「Encrypt」のチェックを外さない

### 商品が表示されない
- Firebase の Firestore に products コレクションが作られているか
- 商品の `available` が `true` か

### 決済できない
- Stripeのキーが test と live で混じっていないか
- Webhookシークレットが正しく登録されているか

### CSVが文字化けする
- Excelで開くと文字化けすることがある。**B2クラウドへのアップロード自体は問題ありません**
- Excelで確認したい場合：「データ」タブ → 「テキストから」→ UTF-8 を選択

---

## 参考リンク

- Next.js: https://nextjs.org/docs
- Firebase: https://firebase.google.com/docs
- Stripe: https://stripe.com/docs
- Vercel: https://vercel.com/docs
- ヤマトB2クラウド: https://bmypage.kuronekoyamato.co.jp/
