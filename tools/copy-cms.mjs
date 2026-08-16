// Sveltia CMS 本体を node_modules から public/admin/ にコピーする。
// CDN から読み込まず同梱することで、オフラインでも編集画面が開ける。
import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const src = resolve(root, "node_modules/@sveltia/cms/dist/sveltia-cms.js");
const dest = resolve(root, "public/admin/sveltia-cms.js");

mkdirSync(dirname(dest), { recursive: true });
copyFileSync(src, dest);
console.log("copied sveltia-cms.js -> public/admin/");
