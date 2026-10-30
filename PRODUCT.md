# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Technically savvy peers: software architects, backend and .NET engineers, platform/DevOps people. They arrive from a shared link, a search result, RSS, or from davidemaggi.dev, and they want to read a long-form technical article end to end, often with code, then maybe browse related posts by tag.

## Product Purpose

MonkeyProof (monkeyproof.dev) is Davide Maggi's personal technical blog: software architecture, backend engineering, distributed systems, experiments, and avoidable mistakes. Success means articles are pleasant to read for their full length, code is legible, and posts are easy to find, share, and subscribe to.

## Positioning

"Chaos, but technically accurate chaos." Written by a System Architect with ~20 years of experience who shares trade-offs and lessons learned, not polished marketing. It is the writing room of the same person whose portfolio is DaveOS (davidemaggi.dev); the two sites must feel like one place, navigable back and forth seamlessly.

## Operating Context

- Static Astro site, deployed as a Docker image (nginx) via semantic-release + GHCR; custom domain via CNAME.
- Content: Markdown/MDX posts in `src/data/blog/`, optional image galleries in `src/data/galleries/`, About page.
- Sibling site davidemaggi.dev (React + Vite, "DaveOS 2 — Aurora Glass") links to the blog; the blog links back.

## Capabilities and Constraints

- Posts with pagination, tags, archives, RSS, sitemap, robots.
- Full-text search (Pagefind).
- Image galleries (feature-flagged) and `GalleryEmbed` inside MDX posts.
- Optional lofi intro audio player (stream or local file), feature-flagged.
- Share links (WhatsApp, Facebook, X, Telegram, Mail).
- Dynamic Open Graph images per post, with `mainImage` / `ogImage` fallbacks.
- Code blocks via Shiki with file names, highlight, word-highlight, and diff notation.
- Light and dark themes.
- Interface language: English only. Articles are written in English by default.

## Brand Commitments

- Name: MonkeyProof. Voice: casual and humorous first (the owner insists: "tutt'altro che serio"), competent underneath, self-ironic, occasional sci-fi references (Doctor Who), never hype or corporate. Applies to UI microcopy too.
- Identity assets from the original theme: Monkey🍌Proof wordmark with the banana, handwritten Sriracha accents.
- Terminal prompt motif `~/go-bananas $` is part of the existing identity.
- Binding visual constraint from the owner: the blog must live in the same visual world as davidemaggi.dev (DaveOS Aurora Glass) so that moving between the two is seamless, while staying reading-first.

## Evidence on Hand

- Posts: `src/data/blog/*.md` (3 posts), About: `src/pages/about.md`.
- Artwork: `src/assets/images/` (choice.png, everest.png, comic.webp), `public/images/` (avatar, diagrams).
- Logo: `src/assets/logo/monkeyproof.svg`; OG fallback `public/monkeyproof-og.png`.
- No testimonials, metrics, or audience numbers exist; do not invent them.

## Product Principles

1. Reading comes first: the world frames the article, never competes with it.
2. One person, one place: the blog and DaveOS share a world, and the way back is always one click away.
3. Honest content: no invented stats, claims, or fake social proof.
4. Fast and static: no client framework where HTML and a small script will do.
