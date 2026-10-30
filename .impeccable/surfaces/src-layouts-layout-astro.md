---
version: 1
slug: "src-layouts-layout-astro"
primary_target: "src/layouts/Layout.astro"
related_targets: ["src/pages/index.astro","src/layouts/PostLayout.astro"]
---

# Surface: MonkeyProof site shell + reading surfaces

Scope: every route (home, posts, post, tags, archive, galleries, about, search, 404). Visitor mode: Read (home leans Persuade only in its first viewport).

Audience/job: technical peers reading long-form architecture/backend articles; arriving from DaveOS, search, RSS, or shared links.

Constraints: English UI; keep search (Pagefind), galleries (flagged), lofi audio (flagged), share links, OG images, RSS. Static, no client framework.

Owner decision (binding): "same world, reading first". Similar style to DaveOS, NOT an app inside DaveOS. No window chrome, traffic lights, or fake ~/paths.

## Direction contract

THESIS: MonkeyProof lives on the same ground as DaveOS (Aurora wallpaper, glass menu bar, palette, type) so the two sites feel seamless, but every page is an ordinary reading-first web page on a solid panel. Refuses both the generic centered-blog-with-cards and the "OS costume" (windows, traffic lights, docks as navigation).

OWN-WORLD: DaveOS 2 Aurora Glass tokens copied from davidemaggi.dev: near-black #06070d ground with drifting violet/cyan/pink/teal blobs, stars, masked grid, grain, vignette; glass menu bar 32px; solid #0c0e17 panels (r18, deep lift + faint accent ring); accent gradient #8b7bff→#3ee6ff; Space Grotesk display, Inter body, JetBrains Mono for dates/labels/code. Same wallpaper presets and light theme as DaveOS; theme+wallpaper handed over via ?theme=&wallpaper=.

STORY: visitor recognises Davide's world, finds the newest article in one glance, reads comfortably, can jump back to DaveOS from the menu bar logo at any time.

FIRST VIEWPORT (home): menu bar (DaveOS mark → davidemaggi.dev, bold "MonkeyProof", Posts/Tags/Archive/About; right: search ⌘K, control center, clock). Left: status line "~/go-bananas $" with caret, h1 "Monkey" solid / "Proof" outlined, tagline, gradient "Read the latest", glass actions, social squares. Right (xl): glass widgets "Pinned/Latest" and "Topics". Below: a "Recent posts" panel listing posts as rows.

FORM: owner-pinned world (DaveOS Aurora Glass look), structure = classic blog pages on solid panels; signature interaction: control center switches theme/wallpaper live and the choice travels to/from DaveOS; focus mode calms the wallpaper and centres the column. seed: none (direction pinned by owner brief; no roll)

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
