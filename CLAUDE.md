# MonkeyProof

Davide Maggi's technical blog (monkeyproof.dev). Static Astro 7 site, deployed as an nginx Docker image via semantic-release + GHCR.

Davide talks to you in Italian; articles and UI copy are in English.

## Writing articles

Use the `monkeyproof-writing` skill (`.claude/skills/monkeyproof-writing/`) for anything that touches posts in `src/data/blog/`.

## Commands

- `npm run dev` — dev server on :4321 (drafts visible, search disabled)
- `npm run build` — `astro check` + build + Pagefind index (needs Node ≥ 22.23.4; `.nvmrc` pins 24)
- `npm run preview` — serve `dist/`
- `npm run lint` / `npm run format`

Commits follow Conventional Commits (semantic-release derives the version).

## Design

The blog shares the visual world of **DaveOS 2 "Aurora Glass"**, the desktop-in-the-browser at davidemaggi.dev (repo `~/Repos/davidemaggi.dev`), so the two feel seamless. Similar style only: it is **not** an app inside DaveOS (no window chrome, traffic lights, fake paths). Tokens, wallpapers, and menu bar mirror that site; keep them in sync when either changes. See `DESIGN.md` and `PRODUCT.md`; UI work uses the `impeccable` and `ui-ux-pro-max` skills.

- Theme/wallpaper/focus prefs live in `localStorage` (`mp.*`) and are handed to/from DaveOS via `?theme=&wallpaper=`.
- `src/config.ts` holds feature flags (galleries, lofi audio, archives, edit link).
- Code blocks get a header (file name/language + Copy) from `src/utils/transformers/fileName.js`.
