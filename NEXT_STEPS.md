# 残作業メモ

atwiki からの移行作業の続き。最終更新: 2026-08-16

## ここまでで終わっていること

- atwiki の全 20 ページを取得 (`raw/`)。取得漏れなし
- うち本文 18 ページを Markdown に変換 (`content/`)。本文の文字数カバレッジ 100%
- Astro でサイトを構築。サイドバー・全文検索・スマホ対応・ダークモードまで動作確認済み
- ブラウザ編集画面 (Sveltia CMS) を `/admin` に設置

## 次にやること

### 1. リポジトリを private にする（未完了・優先）

このリポジトリは現在 **public** で、wiki の本文が誰でも読める状態にある。

<https://github.com/cassell19-lgtm/my-project/settings> を開き、左サイドバーで
「General」を選んだ状態でページ最下部までスクロールすると「Danger Zone」があり、
その中の `Change repository visibility` から Private に変更できる。

### 2. ローカルで動かして確認する（未実施）

```
cd C:\Users\casse\my-project
git pull
npm install
npm run dev
```

- 閲覧 → <http://localhost:4321/>
- 編集 → <http://localhost:4321/admin/> で「Work with Local Repository」を選び、
  `my-project` フォルダを指定する (Chrome / Edge のみ)

詳しい使い方は README.md を参照。

## そのうち決めること

- **公開するかどうか。** 公開する場合の変更点は README.md の「公開するときにやること」に記載
- **外出先からも自分だけ見たい場合**は、Cloudflare Pages + Cloudflare Access (無料枠) で
  メールアドレス認証をかける構成にする
- **旧 atwiki をどうするか。** atwiki から独自ドメインへの 301 リダイレクトは張れないので、
  公開するなら旧 wiki の各ページに新 URL への誘導を置き、数か月は両方残すことになる
- 独自ドメインを取るか (まずは無料のサブドメインで始めて後から差し替え可能)

## 作業を再開するときの引き継ぎ

新しいセッションでは、この会話の記憶は引き継がれない。
このファイルと README.md を読んでもらえば、状況はひととおり伝わる。
