import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { idToPath } from "../nav";

/** Markdown/HTML の記法を落として、検索対象の素のテキストにする。 */
function plain(md: string): string {
  return md
    .replace(/<[^>]+>/g, " ") // HTML の表
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // リンクはテキストだけ残す
    .replace(/^\|[\s\-|]+\|$/gm, " ") // 表の区切り行
    .replace(/[|#*`>]/g, " ")
    .replace(/\\([|])/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

export const GET: APIRoute = async () => {
  const entries = await getCollection("pages");
  const docs = entries.map((entry) => ({
    title: entry.data.title,
    path: idToPath(entry.id),
    text: plain(entry.body ?? ""),
  }));

  return new Response(JSON.stringify(docs), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
};
