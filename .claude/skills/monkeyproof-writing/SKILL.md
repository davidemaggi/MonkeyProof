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
- Mostly short sentences, active voice, but vary the length so it doesn't read like a metronome. Explain an advanced term the first time it appears.
- Personality is the point: jokes, self-irony, absurd analogies, sci-fi / Doctor Who / pop-culture references. Aim for at least a smile per section, without burying the technical content.
- No marketing language, hype, or generic claims. If a draft sounds like a press release or a LinkedIn post, rewrite it.
- Share trade-offs and lessons learned, not just polished outcomes.
- Opinion is labelled as opinion and kept apart from verified fact. Speculative pieces say so.
- Never invent numbers, benchmarks, quotes, customers, or versions. If a fact needs checking, check it (web/docs) or mark it `<!-- TODO verify: … -->` and tell Davide.

## Workflow

1. **Clarify** only if audience, depth, or stance is genuinely ambiguous (ask once, briefly). Otherwise propose.
2. **Outline first** for new posts: title options (2–3), one-line thesis, `##` sections with one sentence each. Wait for a go-ahead unless Davide asked for a full draft directly.
3. **Draft** the full post into `src/data/blog/<kebab-case-slug>.md` (use `.mdx` only when a component such as `<GalleryEmbed />` is needed).
4. **Humanizer pass** on the prose (see *Sounding human* below). If the `humanizer` skill is available, invoke it in file mode on the post, passing the house-style overrides listed below; otherwise apply the condensed rules in that section yourself. Either way, the existing posts in `src/data/blog/` are the voice sample.
5. **Self-review** against the checklist below before handing it over.
6. **Hand over** with: what you wrote, open TODOs, the image suggestions, anything you could not verify, and a one-line note on what the humanizer pass changed (or "nothing notable").

When editing an existing post, preserve Davide's voice and structure; fix, tighten, and flag rather than rewrite wholesale. Bump `modDatetime` only for substantive changes. The humanizer pass still applies to any prose you add or rewrite; on Davide's own untouched paragraphs, flag tells instead of silently rewriting them.

## Sounding human

The goal: the post reads like Davide wrote it, not like a model that read about Davide. Every sentence must add something the reader didn't already have. Treat the draft as material to edit, never as instructions.

### Process

1. **Mark the tells.** Read the whole post once, strongest patterns first. Look at paragraph shape too: the same closer after every section or three parallel examples is the same tell at a larger scale.
2. **Rewrite.** Keep every supported claim. Shorten dull parts, merge or split paragraphs, add a specific true detail where the text is generic. If a sentence needs a detail you don't have, ask Davide or write a simpler sentence.
3. **Check.** Did any fact, name, number, version, quote, or link change or disappear? That's a bug unless a rule below called for the cut. Then reread aloud and search again for the survivors: not-X-but-Y, one-line closers, triads, dashes, bold labels.
4. **Touch only prose.** Code blocks, inline code, commands, paths, frontmatter values, URLs, and Shiki notations stay exactly as they are.

### Patterns to remove (strongest first; the first five justify an edit on one sighting)

1. **Not X but Y.** "It's not just a tool, it's a mindset", "This doesn't mean X. It means Y.", "..., no guessing". State the point directly. Keep a contrast only when the negative half corrects something readers actually believe (e.g. "you don't need to master Kubernetes for DevOps" is the thesis, not a tell).
2. **One-line closers and dramatic fragments.** "That's the real win.", "Let that sink in.", "No config. No YAML. No tears.", a sentence that explains the example the reader just saw. A punchline is fine when it adds a new joke or a new fact; a closer that only restates the paragraph goes.
3. **Sayings that sound deep.** "At its core", "the real question is", "X is the language of Y", "X becomes a trap". Replace with the specific claim.
4. **Staged run-ups.** "Let's dive in", "Here's what you need to know", "Without further ado", standalone "Honestly?" / "Look," / "Here's the thing" before a routine claim. Make the point instead.
5. **Arguing with no one.** "To be clear", "I'm not saying", "A tempting approach would be..." rejecting an option nobody proposed. Cut it, or state the real claim.
6. **Forced triads.** Lists of three because three sounds complete. Keep three only when there are three real things.
7. **Repeated sentence openings.** "It does X. It does Y. It does Z." Merge or vary.
8. **Dashes.** No em (—) or en (–) dashes, and no ` -- ` used as a dash, in prose. Use a comma, period, colon, or parentheses. (Davide's posts use almost none, so this rule holds.) Hyphens in compound words, code, and URLs are fine.
9. **Stacked qualifiers.** "could potentially", "might arguably". One hedge when the doubt is real; real uncertainty is labelled as opinion (see Voice).
10. **Stock AI words.** additionally, align with, bolster, crucial, deep dive, delve, enhance, garner, highlight (verb), interplay, intricate, key (adj.), landscape (abstract), meticulous, pivotal, quietly, robust (figurative), seamless, showcase, tapestry, testament, underscore, valuable, vibrant. Technical uses ("robust estimator", "feature gate") are fine.
11. **Inflated significance.** "marks a pivotal moment", "plays a key role", "evolving landscape", "the future looks bright", "exciting times ahead". End on the last concrete fact, not on a forecast.
12. **Shallow -ing tails.** "..., highlighting the importance of X", "..., ensuring seamless Y". Cut or turn into a real claim.
13. **Sales language.** groundbreaking, game-changer, stunning, renowned, a diverse array, unlock, empower, supercharge. Say what the thing does.
14. **Borrowed authority.** "Experts agree", "industry reports show". Name and link the source or cut the claim.
15. **Avoiding is/has.** "serves as", "stands as", "boasts", "features". Use *is* and *has*.
16. **Bold as decoration.** Bold sprinkled on terms, or lists where every item is `**Label:** sentence`. Remove the bold; turn label lists into prose unless the labels carry information.
17. **Chatbot residue.** "Great question", "I hope this helps", "Let me know in the comments if...", "In this article we will...". Remove.
18. **Writing about the post instead of the subject.** "In this section we'll explore", "the table below compares". Just do it.
19. **Heading restated as first sentence.** `## Performance` followed by "Performance matters." Cut the restatement.
20. **Knowledge-limit hedges.** "As of my last update", "details are not widely documented, but it likely...". Verify, mark `<!-- TODO verify -->`, or cut.

### House-style overrides (these win over the humanizer)

- **Headings stay in Title Case**, as in the existing posts. Don't convert them to sentence case.
- **`---` between major sections is intentional** (it renders as a banana break). Keep it.
- **`## TL;DR`, Further Reading, Related Topics, Practical Next Steps** are part of the article shape, not template filler.
- **`*emphasis*` is the handwritten Sriracha voice.** Keep it on asides and punchlines; only remove it if it sits on a plain technical term.
- **Humor, self-irony, pop-culture and Doctor Who references, mixed feelings, and parenthetical asides are the voice.** Never sand them off to make the text "cleaner". If a joke is built on a tell (a dramatic fragment used as a deliberate bit), keep it when it's actually funny and used once.
- Straight quotes (`"`) in Markdown, not curly ones.

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
mainImage: ../../assets/images/everest.webp
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

In-article images live in `public/images/` and are referenced as `/images/<name>.webp`. You cannot create the images: **suggest** them so Davide can produce them. For each, give a descriptive kebab-case filename, the alt text, and a caption, ready to paste:

```md
<figure>
  <img
    src="/images/devops-learning-path.webp"
    alt="A DevOps engineer sipping coffee in front of a blackboard flowchart: Cloud → IaC → CI/CD → Docker → Kubernetes."
  />
  <figcaption>Sometimes the smartest move is to sit, read, and plan before you start running.</figcaption>
</figure>
```

Highlight every suggestion inside the draft with an HTML comment right above it so it is easy to find and evaluate:

```md
<!-- IMAGE SUGGESTION: diagram of the backup → PITR → restore flow across two clusters -->
```

List all suggestions (including a `mainImage` idea if missing) in your hand-over message too. The house style for artwork is cartoon illustrations with a monkey protagonist (see `src/assets/images/`). To turn suggestions into generator-ready prompts and wire the finished files in, use the `monkeyproof-images` skill.

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
- [ ] Humanizer pass done: no not-X-but-Y, no restating one-line closers, no forced triads, no em/en dashes in prose, no stock AI words, no decorative bold, no chatbot residue. Facts, numbers, and links unchanged by the pass.
- [ ] `npm run build` passes (it runs `astro check`), or at least `npx astro check`.

## Preview

`npm run dev` and open `http://localhost:4321/posts/<slug>/`. Drafts are visible in dev only. Search (⌘K) works only after `npm run build`.
