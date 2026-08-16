#!/usr/bin/env python3
"""atwiki の全ページの HTML をローカルに保存する。

標準ライブラリのみで動くので pip install は不要。
使い方 (Windows cmd):

    python tools\\fetch_atwiki.py

保存先: raw/ 配下
  raw/list_1.html, raw/list_2.html ...  ページ一覧
  raw/pages/123.html ...               各ページ

すでに保存済みのファイルはスキップするので、途中で止めても再実行で続きから取得する。
"""

import os
import re
import sys
import time
import urllib.error
import urllib.request

WIKI_ID = "bachelorjpfan"
BASE = f"https://w.atwiki.jp/{WIKI_ID}"
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "raw")

# サーバに負荷をかけないよう1リクエストごとに待つ秒数
DELAY = 1.0

UA = "Mozilla/5.0 (compatible; personal-wiki-backup/1.0; owner-initiated)"


def get(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=30) as res:
        return res.read()


def save(path, data):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "wb") as f:
        f.write(data)


def fetch_page_list():
    """ページ一覧を辿って、全ページIDを集める。"""
    ids = set()
    for n in range(1, 100):  # 一覧のページ送り。該当なしで打ち切る
        url = f"{BASE}/list" if n == 1 else f"{BASE}/list?page={n}"
        print(f"[list] {url}")
        try:
            html = get(url)
        except urllib.error.HTTPError as e:
            print(f"  -> HTTP {e.code} で打ち切り")
            break
        save(os.path.join(OUT, f"list_{n}.html"), html)

        text = html.decode("utf-8", errors="replace")
        found = set(re.findall(r"/%s/pages/(\d+)\.html" % WIKI_ID, text))
        new = found - ids
        print(f"  -> {len(found)} 件 (新規 {len(new)} 件)")
        if not new:
            break
        ids |= found
        time.sleep(DELAY)
    return sorted(ids, key=int)


def main():
    ids = fetch_page_list()
    if not ids:
        print("\nページIDが1件も取れませんでした。")
        print("ブラウザで {}/list を開けるか確認してください。".format(BASE))
        sys.exit(1)

    print(f"\n合計 {len(ids)} ページを取得します\n")
    ok = skipped = failed = 0
    for i, pid in enumerate(ids, 1):
        dest = os.path.join(OUT, "pages", f"{pid}.html")
        if os.path.exists(dest):
            skipped += 1
            continue
        url = f"{BASE}/pages/{pid}.html"
        print(f"[{i}/{len(ids)}] {url}")
        try:
            save(dest, get(url))
            ok += 1
        except Exception as e:  # noqa: BLE001 - 1件失敗しても続行したい
            print(f"  !! 失敗: {e}")
            failed += 1
        time.sleep(DELAY)

    print(f"\n完了: 取得 {ok} / スキップ {skipped} / 失敗 {failed}")
    print(f"保存先: {os.path.abspath(OUT)}")


if __name__ == "__main__":
    main()
