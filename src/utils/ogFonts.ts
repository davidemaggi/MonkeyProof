import fs from "node:fs";
import path from "node:path";

const read = (pkg: string, file: string) =>
  fs.readFileSync(path.resolve(`./node_modules/@fontsource/${pkg}/files/${file}`));

/** Static WOFF files for Satori (it cannot read variable WOFF2). */
export default function loadOgFonts() {
  return [
    { name: "Space Grotesk", data: read("space-grotesk", "space-grotesk-latin-700-normal.woff"), weight: 700 as const, style: "normal" as const },
    { name: "Inter", data: read("inter", "inter-latin-400-normal.woff"), weight: 400 as const, style: "normal" as const },
    { name: "Inter", data: read("inter", "inter-latin-600-normal.woff"), weight: 600 as const, style: "normal" as const },
  ];
}
