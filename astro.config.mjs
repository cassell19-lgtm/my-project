// @ts-check
import { defineConfig } from "astro/config";
import { rehypeWrapTables } from "./src/rehype-wrap-tables.mjs";

export default defineConfig({
  // 公開時に実際のドメインへ差し替える
  site: "https://example.com",
  markdown: {
    rehypePlugins: [rehypeWrapTables],
  },
});
