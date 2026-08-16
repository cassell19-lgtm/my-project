# バチェラー・ジャパン/バチェロレッテ・ジャパン Wiki

atwiki (`w.atwiki.jp/bachelorjpfan`) の内容を移行した、静的サイト版の wiki。

## 使い方

初回だけ:

```
npm install
```

サイトを起動する:

```
npm run dev
```

- 閲覧 → http://localhost:4321/
- 編集 → http://localhost:4321/admin/

編集画面を開いたら **「Work with Local Repository」** を選び、このフォルダを指定する。
ブラウザ上で本文を書き換えると、`content/` の Markdown が直接更新される。
(Chrome または Edge が必要。Firefox / Safari は未対応)

編集した内容を保存するには、いつもの git 操作をする:

```
git add content
git commit -m "内容を更新"
git push
```

## 構成

```
content/          本文 (Markdown)。ここだけ編集すればよい
  index.md          トップページ
  system/           システム (基本ルール・デート・ローズ・その他用語集)
  seasons/          シリーズ解説 (バチェラー1〜6 / バチェロレッテ1〜4)
src/
  nav.ts            サイドバーの構成。ページを増やしたらここに追記する
  layouts/          ページの外枠
  pages/            ルーティングと検索
  styles/global.css 見た目
public/admin/     ブラウザ編集画面 (Sveltia CMS) の設定
raw/              atwiki から取得した元の HTML (移行の記録用。消してもよい)
tools/            移行用スクリプト
```

## ページを追加する

1. `content/seasons/` などに `.md` ファイルを作る (編集画面からでもよい)
2. `src/nav.ts` にサイドバー用の項目を追記する

## 公開するときにやること

現状は**非公開前提**の設定になっている。公開する際は以下を変更する。

- `src/layouts/Layout.astro` の `<meta name="robots" content="noindex, nofollow" />` を削除する
  (これがあると検索エンジンに載らない)
- `astro.config.mjs` の `site` を実際のドメインに変更する
- `public/admin/` を公開範囲から外すか、GitHub OAuth を設定する

## 移行用スクリプト

再取得や再変換が必要になったときだけ使う。通常は不要。

```
python tools/fetch_atwiki.py          # atwiki から HTML を取得して raw/ に保存
python3 tools/convert_to_markdown.py  # raw/ の HTML を content/ の Markdown に変換
```

`convert_to_markdown.py` は `content/` を**上書きする**ので、移行後に加えた編集は消える。
移行が済んだ今は基本的に実行しないこと。
