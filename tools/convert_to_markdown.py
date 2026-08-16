#!/usr/bin/env python3
"""raw/ に保存した atwiki の HTML を Markdown に変換して content/ に出力する。

    pip install beautifulsoup4 lxml
    python3 tools/convert_to_markdown.py

atwiki が吐く HTML は使われているタグが少なく (h3/h4/div/ul/li/table/a/span/br/hr)、
機械変換しやすい。表だけは Markdown で表現できないものがあるため、条件を見て
Markdown の表と HTML の表を使い分ける (build_table を参照)。
"""

import os
import re
import sys

from bs4 import BeautifulSoup, Comment, NavigableString, Tag

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW = os.path.join(ROOT, "raw", "pages")
OUT = os.path.join(ROOT, "content")

# atwiki のページID -> サイト上のパス。メニューの階層に合わせている。
# 2 (メニュー) と 3 (右メニュー) はナビゲーションなので本文としては出力しない。
SLUGS = {
    1: "index",
    17: "system/index",
    12: "system/rules",
    15: "system/dates",
    13: "system/rose",
    18: "system/glossary",
    16: "seasons/index",
    27: "seasons/bachelor-1",
    28: "seasons/bachelor-1-features",
    26: "seasons/bachelor-2",
    10: "seasons/bachelor-3",
    14: "seasons/bachelor-4",
    23: "seasons/bachelor-5",
    20: "seasons/bachelor-6",
    22: "seasons/bachelorette-1",
    21: "seasons/bachelorette-2",
    25: "seasons/bachelorette-3",
    29: "seasons/bachelorette-4",
}

LINK_RE = re.compile(r"^(?:https?:)?//w\.atwiki\.jp/bachelorjpfan/pages/(\d+)\.html")

# <br> を一旦この番兵に置き換えてから改行に戻す。テキスト中に現れない文字列にする。
BR = "\x00BR\x00"


def href_for(url):
    """atwiki 内部リンクならサイト内パスに、それ以外はそのまま返す。"""
    if "atwiki.jp" in (url or "") and "/search?" in url:
        return None  # 「◯◯をウィキ内検索」リンク。移行先では不要
    m = LINK_RE.match(url or "")
    if not m:
        return url
    slug = SLUGS.get(int(m.group(1)))
    if slug is None:
        return None  # 出力対象外のページ (メニュー等) へのリンク
    return "/" if slug == "index" else "/" + slug.removesuffix("/index") + "/"


def is_bold(tag):
    style = tag.get("style", "")
    return "font-weight: bold" in style or "font-weight:bold" in style


def inline(node):
    """インライン要素を Markdown 文字列にする。<br> は番兵 BR で表す。"""
    if isinstance(node, Comment):
        return ""
    if isinstance(node, NavigableString):
        # atwiki の本文は改行を <br> で表現しているので、生の改行は空白と同じ
        return re.sub(r"\s*\n\s*", "", str(node))
    if not isinstance(node, Tag):
        return ""

    if node.name == "br":
        return BR
    if node.name == "a":
        text = "".join(inline(c) for c in node.children).strip()
        url = href_for(node.get("href", ""))
        if not url:
            return text  # リンク先が存在しないのでテキストだけ残す
        return f"[{text}]({url})" if text else ""

    inner = "".join(inline(c) for c in node.children)
    if node.name == "span" and is_bold(node) and inner.strip():
        return f"**{inner.strip()}**"
    return inner


def paragraphs(node):
    """<div> などのブロックを、空行区切りの段落リストにする。"""
    text = inline(node)
    return [ln.strip() for ln in text.split(BR) if ln.strip()]


def cell_text(td):
    """表のセル。Markdown の表では | と改行が使えないので置き換える。"""
    return inline(td).replace(BR, "<br>").replace("|", "\\|").strip()


def clean_html_table(table):
    """スタイルとクラスを落とした素の HTML の表を返す。"""
    t = BeautifulSoup(str(table), "lxml").find("table")
    for c in t.find_all(string=lambda s: isinstance(s, Comment)):
        c.extract()
    for el in t.find_all(True):
        for attr in ("style", "class", "title", "target"):
            el.attrs.pop(attr, None)
        if el.name == "a":
            url = href_for(el.get("href", ""))
            if url:
                el["href"] = url
            else:
                el.unwrap()
    return re.sub(r"\n\s*\n", "\n", str(t))


def build_table(table):
    """表を Markdown か HTML に変換する。

    Markdown の表にできるのは「1行目が全て th」かつ「結合セルがない」場合だけ。
    項目名が左列にある縦型の表 (1列目だけ th) は th の意味が失われるため HTML で出す。
    """
    rows = table.find_all("tr")
    if not rows:
        return ""
    if table.find(attrs={"colspan": True}) or table.find(attrs={"rowspan": True}):
        return clean_html_table(table)

    head = rows[0].find_all(["th", "td"])
    if not head or any(c.name != "th" for c in head):
        return clean_html_table(table)
    if any(c.name == "th" for r in rows[1:] for c in r.find_all(["th", "td"])):
        return clean_html_table(table)

    width = len(head)
    lines = ["| " + " | ".join(cell_text(c) for c in head) + " |",
             "|" + "---|" * width]
    for r in rows[1:]:
        cells = [cell_text(c) for c in r.find_all(["th", "td"])]
        if len(cells) != width:  # 想定外の行数はここで諦めて HTML に落とす
            return clean_html_table(table)
        lines.append("| " + " | ".join(cells) + " |")
    return "\n".join(lines)


def build_list(ul, depth=0):
    out = []
    for li in ul.find_all("li", recursive=False):
        nested = li.find_all("ul", recursive=False)
        for n in nested:
            n.extract()
        text = inline(li).replace(BR, " ").strip()
        out.append("  " * depth + f"- {text}")
        for n in nested:
            out.extend(build_list(n, depth + 1))
    return out


def convert(path, pid):
    soup = BeautifulSoup(open(path, encoding="utf-8", errors="replace").read(), "lxml")
    body = soup.find("div", id="wikibody")
    # トップページの <title> はサイト名そのものなので、ページ名として使わない
    title = "トップページ" if pid == 1 else soup.find("title").get_text().split(" - ")[0].strip()

    blocks = []
    for node in body.children:
        if isinstance(node, Comment) or not isinstance(node, Tag):
            continue
        if node.name in ("h3", "h4", "h5"):
            level = {"h3": "##", "h4": "###", "h5": "####"}[node.name]
            blocks.append(f"{level} {inline(node).strip()}")
        elif node.name == "table":
            blocks.append(build_table(node))
        elif node.name == "ul":
            blocks.append("\n".join(build_list(node)))
        elif node.name == "hr":
            blocks.append("---")
        elif node.name in ("div", "p"):
            blocks.extend(paragraphs(node))
        elif node.name == "br":
            continue
        else:
            blocks.extend(paragraphs(node))

    # atwiki が全ページ末尾に付ける「◯◯をウィキ内検索」は移行先では意味がない
    blocks = [b for b in blocks if b.strip() and "をウィキ内検索" not in b]

    front = f'---\ntitle: "{title}"\natwiki_id: {pid}\n---\n'
    return front + "\n" + "\n\n".join(blocks) + "\n"


def main():
    if not os.path.isdir(RAW):
        sys.exit(f"{RAW} がありません。先に tools/fetch_atwiki.py を実行してください。")

    written = 0
    for pid, slug in sorted(SLUGS.items()):
        src = os.path.join(RAW, f"{pid}.html")
        if not os.path.exists(src):
            print(f"  !! {src} がありません")
            continue
        md = convert(src, pid)
        dest = os.path.join(OUT, slug + ".md")
        os.makedirs(os.path.dirname(dest), exist_ok=True)
        with open(dest, "w", encoding="utf-8") as f:
            f.write(md)
        print(f"  {pid:>3} -> content/{slug}.md  ({len(md):,} chars)")
        written += 1
    print(f"\n{written} ページを変換しました")


if __name__ == "__main__":
    main()
