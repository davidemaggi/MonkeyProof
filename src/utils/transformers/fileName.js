/**
 * Shiki transformer that wraps every code block with a header showing the
 * file name (from the `file="name.ts"` meta) or the language, and a copy
 * button.
 *
 * ```ts file=decorators.ts
 * ```
 *
 * The copy button is wired by the post layout script.
 */
export const transformerFileName = () => ({
  name: "monkeyproof:code-block",
  root(root) {
    const pre = root.children.find(
      child => child.type === "element" && child.tagName === "pre"
    );
    if (!pre) return;

    const metaMap = new Map();
    for (const item of this.options.meta?.__raw?.split(" ") ?? []) {
      const [key, value] = item.split("=");
      if (!key || !value) continue;
      metaMap.set(key, value.replace(/["'`]/g, ""));
    }

    const file = metaMap.get("file");
    const lang = this.options.lang ?? "text";
    const label = file ?? lang;

    pre.properties.tabindex = "0";

    const header = {
      type: "element",
      tagName: "div",
      properties: { class: ["code-block__bar"] },
      children: [
        {
          type: "element",
          tagName: "span",
          properties: {
            class: ["code-block__title", file ? "is-file" : "is-lang"],
          },
          children: [{ type: "text", value: label }],
        },
        {
          type: "element",
          tagName: "button",
          properties: {
            type: "button",
            class: ["code-block__copy"],
            "data-copy-code": "",
            "aria-label": `Copy ${file ?? `${lang} code`}`,
          },
          children: [{ type: "text", value: "Copy" }],
        },
      ],
    };

    root.children = [
      {
        type: "element",
        tagName: "div",
        properties: { class: ["code-block"], "data-lang": lang },
        children: [header, pre],
      },
    ];
  },
});
