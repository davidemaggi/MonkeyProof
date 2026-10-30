---
name: monkeyproof-writing
description: Use when writing, outlining, editing, reviewing, or polishing a MonkeyProof blog post (Markdown/MDX in src/data/blog/), including frontmatter, titles, descriptions, tags, code samples, image suggestions, and tone. Also use when the user asks for article ideas or wants a draft turned into a publishable post.
---

# MonkeyProof article writing

MonkeyProof (monkeyproof.dev) is Davide Maggi's technical blog: software architecture, backend and .NET, distributed systems, platform/DevOps, experiments, and avoidable mistakes. Tagline: **technically accurate chaos**.

Davide writes to you in Italian; **articles are in English** unless he explicitly asks otherwise. Reply to him in his language, write the post in English.

## Voice

The tone is anything but serious. Casual, humorous, self-ironic, like a chat at the coffee machine with a colleague who happens to know a lot. Keep the jokes; just keep the facts straight.

- A smart engineer talking to another smart engineer. Conversational, competent, reflective.
- Short sentences, active voice. Explain an advanced term the first time it appears.
- Personality is the point: jokes, self-irony, absurd analogies, sci-fi / Doctor Who / pop-culture references. Aim for at least a smile per section, without burying the technical content.
- No marketing language, hype, or generic claims. If a draft sounds like a press release or a LinkedIn post, rewrite it.
- Share trade-offs and lessons learned, not just polished outcomes.
- Opinion is labelled as opinion and kept apart from verified fact. Speculative pieces say so.
- Never invent numbers, benchmarks, quotes, customers, or versions. If a fact needs checking, check it (web/docs) or mark it `<!-- TODO verify: … -->` and tell Davide.

## Workflow

1. **Clarify** only if audience, depth, or stance is genuinely ambiguous (ask once, briefly). Otherwise propose.
2. **Outline first** for new posts: title options (2–3), one-line thesis, `##` sections with one sentence each. Wait for a go-ahead unless Davide asked for a full draft directly.
3. **Draft** the full post into `src/data/blog/<kebab-case-slug>.md` (use `.mdx` only when a component such as `<GalleryEmbed />` is needed).
4. **Self-review** against the checklist below before handing it over.
5. **Hand over** with: what you wrote, open TODOs, the image suggestions, and anything you could not verify.

When editing an existing post, preserve Davide's voice and structure; fix, tighten, and flag rather than rewrite wholesale. Bump `modDatetime` only for substantive changes.

## Article shape

- **TL;DR** at the top (`## TL;DR`) when the post is long or covers several points: 2–5 sentences with the actual takeaways.
- **Intro**: the problem, motivation, or context. A short personal anecdote is welcome when relevant.
- **Body**: meaningful `##` / `###` headings (they become the "On this page" sidebar automatically — do **not** add a manual table of contents). Explain the *why*, not only the *how*.
- **Lessons learned / practical takeaways**: mistakes to avoid, trade-offs.
- **Conclusion**: one concrete insight, an open question, or a next experiment.
- Where useful, close with **Further reading** (real links), **related topics**, and **practical next steps** for the reader.
- `---` horizontal rules between major sections are fine and match existing posts.

Lists, tables, and blockquotes only when they improve scanning.

## Frontmatter

Schema lives in `src/content.config.ts`. Always provide `title`, `description`, `pubDatetime`, `tags`.

```yaml
---
title: "OpenEverest in the Real World: Running Databases on Kubernetes Without Cloud Lock-In"
description: "A practical deep dive into OpenEverest: install the platform, provision PostgreSQL on Kubernetes, set backups and PITR, and handle Day 2 operations."
pubDatetime: 2026-04-12T10:30:00Z
modDatetime:            # optional, only for substantive updates
tags:
  - kubernetes
  - databases
featured: false         # true pins it in the home "Pinned" widget
draft: true             # keep true until Davide approves
mainImage: ../../assets/images/everest.png
mainImageAlt: "Descriptive alt text of what the image shows"
mainImageCaption: Short, ideally witty caption.
mainImageCredit: MonkeyProof internal artwork
---
```

- `description`: specific and informative (shown in listings, search, and social cards), 1–2 sentences, not teaser copy.
- `tags`: lowercase kebab-case, reflecting the real technical themes. Reuse existing tags (`grep -h "^  - " src/data/blog/*.md | sort | uniq -c`) before inventing new ones. If the post contains code in a technology, that technology should be a tag and appear in the description.
- `mainImage` goes in `src/assets/images/` (optimised by Astro). If present, `mainImageAlt` is mandatory; add caption/credit when useful.
- No `mainImage`? Suggest one (see Images) and leave the field out; a social card is generated automatically. `ogImage` is only a fallback for a dedicated social image.
- New drafts start with `draft: true`.

## Code

- Every fenced block declares its language. Add a file name when it helps; it renders as the code window title:

  ````md
  ```ts file=decorators.ts
  function logged<T extends new (...args: unknown[]) => unknown>(target: T, _ctx: ClassDecoratorContext) {
    return class extends target {} // [!code highlight]
  }
  ```
  ````

- Shiki notations available: `// [!code highlight]`, `// [!code word:Foo]`, `// [!code ++]`, `// [!code --]` (use the language's comment syntax, e.g. `# [!code ++]` in YAML/sh).
- Examples must be technically accurate and runnable in spirit: real flags, real API names, current versions. Prefer a short, correct snippet over a long, approximate one.

## Images

In-article images live in `public/images/` and are referenced as `/images/<name>.png`. You cannot create the images: **suggest** them so Davide can produce them. For each, give a descriptive kebab-case filename, the alt text, and a caption, ready to paste:

```md
<figure>
  <img
    src="/images/devops-learning-path.png"
    alt="A DevOps engineer sipping coffee in front of a blackboard flowchart: Cloud → IaC → CI/CD → Docker → Kubernetes."
  />
  <figcaption>Sometimes the smartest move is to sit, read, and plan before you start running.</figcaption>
</figure>
```

Highlight every suggestion inside the draft with an HTML comment right above it so it is easy to find and evaluate:

```md
<!-- IMAGE SUGGESTION: diagram of the backup → PITR → restore flow across two clusters -->
```

List all suggestions (including a `mainImage` idea if missing) in your hand-over message too. The house style for artwork is cartoon illustrations with a monkey protagonist (see `src/assets/images/`).

Handwritten voice: `*emphasis*` renders in the Sriracha handwritten font, so use it for asides and punchlines, not for technical terms. For a longer handwritten aside, `<span class="spicy">…</span>` works in Markdown too. `---` renders as a banana section break.

Galleries: in `.mdx` posts, `<GalleryEmbed slug="folder-name" />` embeds a gallery from `src/data/galleries/<slug>/` (props `limit`, `cols`, `showLink`).

## Self-review checklist

- [ ] TL;DR states real takeaways (if the post is long).
- [ ] Every claim is either verified, sourced, or marked as opinion / TODO.
- [ ] Headings form a sensible outline (no manual TOC, no skipped levels).
- [ ] Every code block has a language; snippets are correct.
- [ ] Frontmatter complete; description specific; tags reuse existing ones; `draft: true` for new posts.
- [ ] Image suggestions marked with `<!-- IMAGE SUGGESTION -->` and listed.
- [ ] Ends with takeaways and a conclusion; further reading links are real.
- [ ] Reads like Davide, not like a brochure. It made you smile at least a few times.
- [ ] `npm run build` passes (it runs `astro check`), or at least `npx astro check`.

## Preview

`npm run dev` and open `http://localhost:4321/posts/<slug>/`. Drafts are visible in dev only. Search (⌘K) works only after `npm run build`.
