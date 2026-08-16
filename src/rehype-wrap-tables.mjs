/**
 * 表を <div class="table-wrap"> で包む rehype プラグイン。
 *
 * 参加者一覧のような横に長い表は、スマホでは画面からはみ出す。包んだ div 側で
 * 横スクロールさせることで、ページ全体が横に伸びるのを防ぐ。
 */
export function rehypeWrapTables() {
  return (tree) => {
    const walk = (node) => {
      if (!node.children) return;
      node.children = node.children.map((child) => {
        walk(child);
        if (child.type === "element" && child.tagName === "table") {
          return {
            type: "element",
            tagName: "div",
            properties: { className: ["table-wrap"] },
            children: [child],
          };
        }
        return child;
      });
    };
    walk(tree);
  };
}
