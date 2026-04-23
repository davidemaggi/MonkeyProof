# MonkeyProof

![Astro](https://img.shields.io/badge/Astro-6.x-BC52EE?logo=astro&logoColor=white)
![Node](https://img.shields.io/badge/Node-%3E%3D22.12.0-339933?logo=node.js&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue.svg)

MonkeyProof is a personal blog built with Astro, focused on software architecture, backend engineering, and distributed systems, with a custom design and SEO/performance optimizations.

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Local Setup](#local-setup)
- [Available Scripts](#available-scripts)
- [Automated Release and Docker Publish (GHCR)](#automated-release-and-docker-publish-ghcr)
- [Conventional Commits for Versioning](#conventional-commits-for-versioning)
- [Site Configuration](#site-configuration)
- [Content and Frontmatter](#content-and-frontmatter)
- [Main and OG Images](#main-and-og-images)
- [Galleries](#galleries)
- [Full-Text Search (Pagefind)](#full-text-search-pagefind)
- [Troubleshooting](#troubleshooting)
- [License](#license)

## Overview

Main features:

- Static blog with pagination, tags, archives, and RSS.
- Light/dark theme, client-side search, and custom UI.
- Dynamic Open Graph images for posts (with frontmatter/config fallbacks).
- Support for article main images (`mainImage`) rendered as a dedicated card below the title.
- Automated semantic-release and Docker publish to GHCR.

## Tech Stack

- Framework: `astro` (v6)
- Content layer: `astro:content` + `zod` schema
- Styling: Tailwind CSS v4 + custom CSS
- Markdown/MDX: `@astrojs/mdx`, `remark-toc`, `remark-collapse`
- Search: `pagefind`
- SEO: sitemap + RSS + Open Graph

## Project Structure

Main paths:

- `src/pages/`: Astro routes (`/`, `/posts`, `/tags`, `/rss.xml`, etc.)
- `src/layouts/`: global layouts and post detail layout
- `src/components/`: reusable UI components
- `src/data/blog/`: Markdown/MDX posts
- `src/data/galleries/`: gallery content
- `src/config.ts`: main site configuration
- `src/content.config.ts`: collection frontmatter schema
- `.github/workflows/docker-build-push.yml`: semantic-release + Docker publish to GHCR

## Prerequisites

Required versions (aligned with Astro 6):

- Node.js `>= 22.12.0`
- npm `>= 10`

This repository includes:

- `package.json` with `engines`
- `.nvmrc` set to `22.12.0`

## Quick Start

```zsh
git clone https://github.com/davidemaggi/MonkeyProof.git
cd MonkeyProof
nvm use 22.12.0 || nvm install 22.12.0
npm ci
npm run dev
```

Then open the local URL shown in terminal (usually `http://localhost:4321`).

## Local Setup

For a more explicit setup flow (useful on a fresh machine):

```zsh
# from your local repository folder
nvm install 22.12.0
nvm use 22.12.0
npm ci
```

Run in development:

```zsh
npm run dev
```

Build locally:

```zsh
npm run build
```

Preview build:

```zsh
npm run preview
```

## Available Scripts

From `package.json`:

- `npm run dev`: starts Astro dev server
- `npm run build`: `astro check` + build + Pagefind index + copy to `public/pagefind`
- `npm run preview`: serves the build output
- `npm run release`: runs `semantic-release`
- `npm run sync`: syncs Astro content/types
- `npm run lint`: lints the project
- `npm run format`: applies formatting
- `npm run format:check`: checks formatting only

Note: `build` copies `dist/pagefind` into `public/pagefind`. During local work, this folder may appear as modified in your git working tree.

## Automated Release and Docker Publish (GHCR)

The repository uses semantic-release in `.github/workflows/docker-build-push.yml`.

Flow on push to `main` or `master`:

1. `semantic-release` calculates the next version from commit messages and creates `v<version>` tag + GitHub release.
2. Release commit updates `package.json`, `package-lock.json`, and `CHANGELOG.md`.
3. Docker image is built and pushed to GHCR only when a new release is actually published.
4. The workflow verifies `package.json.version` is exactly the published release version.

Container destination:

- `ghcr.io/<owner>/<repo>` (lowercase, derived from `github.repository`)
- tags: `<version>`, `v<version>`, `latest`

Important:

- Do not create git tags manually.
- Trigger releases only via Conventional Commits merged/pushed to `main`/`master`.

## Conventional Commits for Versioning

Version bump rules:

- `fix:` -> patch release
- `feat:` -> minor release
- `BREAKING CHANGE` footer or `!` in type/scope -> major release

Examples:

- `fix(search): handle empty query`
- `feat(posts): add related articles section`
- `feat(api)!: remove deprecated endpoint`

## Site Configuration

Main configuration is in `src/config.ts` (`SITE`):

- site data (`website`, `title`, `desc`, `author`, `profile`)
- avatar (`SITE.avatar.src`, `SITE.avatar.alt`)
- toggles (`lightAndDarkMode`, `showArchives`, `showGalleries`, `showBackButton`)
- base SEO settings (`ogImage`, `dynamicOgImage`)
- timezone and language
- intro audio options

Astro configuration in `astro.config.ts`:

- `site: SITE.website`
- MDX + sitemap integrations
- markdown plugins / Shiki transformers
- responsive image configuration
- public env schema (`PUBLIC_GOOGLE_SITE_VERIFICATION`)

## Content and Frontmatter

Blog collection in `src/content.config.ts` (`blog`):

Main fields:

- `title`, `description`, `pubDatetime`
- `tags`, `draft`, `featured`
- `mainImage`, `mainImageAlt`, `mainImageCaption`, `mainImageCredit`
- `ogImage` (string fallback metadata)
- `canonicalURL`, `timezone`, `hideEditPost`

Example post: `src/data/blog/HelloWorld.md`.

## Main and OG Images

OG priority logic used for post pages:

1. `mainImage`
2. `ogImage`
3. Dynamic OG (`/posts/<slug>/index.png`) when `SITE.dynamicOgImage` is enabled
4. Global fallback (`SITE.ogImage` / `og.png`)

Important details:

- `mainImage` can be a local asset or a URL string.
- `ogImage` is a metadata string (valid example: `/monkeyproof-og.png`).
- If `mainImage` or `ogImage` exists, dynamic OG is not generated for that post.

## Galleries

The project includes a gallery feature with dedicated routes (`/galleries`).

Full technical documentation:

- `GALLERIES.md`

Feature flags in `src/config.ts`:

- `SITE.showGalleries`
- `SITE.showGalleriesInIndex`

## Full-Text Search (Pagefind)

Pagefind is generated at build time via:

- `pagefind --site dist`

In local flow, the index is also copied into `public/pagefind` by the `build` script.

## Troubleshooting

### EBADENGINE / EUSAGE during `npm ci`

Symptom: warning/error for `astro` / `@astrojs/*` requiring Node `>=22.12.0`.

Fix:

```zsh
nvm use 22.12.0
node -v
npm -v
npm ci
```

### `/monkeyproof-og.png` not resolved

- Use a root-relative path in frontmatter (`/monkeyproof-og.png`).
- Keep `ogImage` as metadata string (already configured in `src/content.config.ts`).

## License

This project is distributed under the MIT license. See `LICENSE`.
