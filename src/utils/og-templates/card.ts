import satori from "satori";
import { SITE } from "@/config";
import loadOgFonts from "../ogFonts";

type Node = { type: string; props: Record<string, unknown> };
const h = (type: string, style: Record<string, unknown>, children?: unknown): Node => ({
  type,
  props: { style, children },
});

const dot = (color: string) =>
  h("div", { width: 18, height: 18, borderRadius: 999, backgroundColor: color });

/** A DaveOS window floating on the Aurora wallpaper. */
export default async function ogCard({ path, title, footer }: { path: string; title: string; footer: string }) {
  const host = new URL(SITE.website).hostname;
  const size = title.length > 70 ? 54 : title.length > 40 ? 64 : 76;

  const tree = h(
    "div",
    {
      width: "100%",
      height: "100%",
      display: "flex",
      padding: 56,
      backgroundColor: "#06070d",
      backgroundImage:
        "radial-gradient(circle at 8% 0%, #6d4affcc 0%, transparent 45%), radial-gradient(circle at 100% 15%, #00c2ff99 0%, transparent 40%), radial-gradient(circle at 60% 120%, #ff3d9a88 0%, transparent 45%)",
      fontFamily: "Inter",
    },
    h(
      "div",
      {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        borderRadius: 26,
        border: "1px solid #ffffff2a",
        backgroundColor: "#0c0e17f2",
      },
      [
        h(
          "div",
          {
            display: "flex",
            alignItems: "center",
            height: 64,
            padding: "0 26px",
            borderBottom: "1px solid #ffffff14",
            backgroundColor: "#161927",
            borderRadius: "26px 26px 0 0",
          },
          [
            h("div", { display: "flex", gap: 10 }, [dot("#ff5f57"), dot("#febc2e"), dot("#28c840")]),
            h("div", { display: "flex", flex: 1, justifyContent: "center", color: "#9aa1b9", fontSize: 22 }, path),
            h("div", { width: 74 }),
          ]
        ),
        h(
          "div",
          { display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1, padding: "48px 56px" },
          [
            h(
              "div",
              {
                display: "flex",
                fontFamily: "Space Grotesk",
                fontWeight: 700,
                fontSize: size,
                lineHeight: 1.05,
                letterSpacing: "-0.04em",
                color: "#f3f4fa",
              },
              title
            ),
            h("div", { display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 26 }, [
              h("div", { display: "flex", color: "#c9cede" }, footer),
              h(
                "div",
                {
                  display: "flex",
                  padding: "10px 22px",
                  borderRadius: 999,
                  color: "#ffffff",
                  fontWeight: 600,
                  backgroundImage: "linear-gradient(120deg, #8b7bff, #3ee6ff)",
                },
                host
              ),
            ]),
          ]
        ),
      ]
    )
  );

  return satori(tree as never, { width: 1200, height: 630, fonts: loadOgFonts() });
}
