/** サイドバーの構成。元 wiki の「メニュー」ページの階層をそのまま再現している。 */
export type NavItem = {
  title: string;
  href: string;
  children?: NavItem[];
};

export const SITE_TITLE = "バチェラー・ジャパン/バチェロレッテ・ジャパン Wiki";

export const nav: NavItem[] = [
  { title: "トップページ", href: "/" },
  {
    title: "システム",
    href: "/system/",
    children: [
      { title: "基本ルール", href: "/system/rules/" },
      { title: "デート", href: "/system/dates/" },
      { title: "ローズ", href: "/system/rose/" },
      { title: "その他用語集", href: "/system/glossary/" },
    ],
  },
  {
    title: "シリーズ解説(配信順)",
    href: "/seasons/",
    children: [
      {
        title: "バチェラー1",
        href: "/seasons/bachelor-1/",
        children: [
          { title: "バチェラー1 固有の特徴", href: "/seasons/bachelor-1-features/" },
        ],
      },
      { title: "バチェラー2", href: "/seasons/bachelor-2/" },
      { title: "バチェラー3", href: "/seasons/bachelor-3/" },
      { title: "バチェロレッテ1", href: "/seasons/bachelorette-1/" },
      { title: "バチェラー4", href: "/seasons/bachelor-4/" },
      { title: "バチェロレッテ2", href: "/seasons/bachelorette-2/" },
      { title: "バチェラー5", href: "/seasons/bachelor-5/" },
      { title: "バチェロレッテ3", href: "/seasons/bachelorette-3/" },
      { title: "バチェラー6", href: "/seasons/bachelor-6/" },
      { title: "バチェロレッテ4", href: "/seasons/bachelorette-4/" },
    ],
  },
];

/** content/ 内のファイル ID を URL パスに変換する。 */
export function idToPath(id: string): string {
  if (id === "index") return "/";
  return "/" + id.replace(/\/index$/, "") + "/";
}
