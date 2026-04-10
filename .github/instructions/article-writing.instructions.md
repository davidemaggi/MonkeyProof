---
description: "Use when writing, editing, outlining, or refining MonkeyProof blog posts in Markdown or MDX. Covers tone, article structure, frontmatter quality, examples, and editorial style for technical articles."
name: "MonkeyProof Article Writing"
applyTo: "src/data/blog/**/*.{md,mdx}"
---
# MonkeyProof Article Writing Guidelines

- Write for technically savvy peers. Keep the tone conversational, competent, and reflective.
- Prefer clarity over flourish. Use short sentences, active voice, and explain advanced terms the first time they appear.
- Keep personality in the text. Dry humor, self-irony, and occasional sci-fi or pop-culture references are welcome when they support the point.
- Avoid marketing language, exaggerated claims, and generic hype.

## Article Shape

- Add a TL;DR section at the top if the article is long or covers multiple complex points. This should be a concise summary of the main insights or takeaways.
- Start with a clear, descriptive title and a concrete description that states the value of the article in 1-2 sentences.
- Open with a brief introduction that explains the problem, motivation, or context. A short personal anecdote is fine when relevant.
- Structure the body with meaningful `##` and `###` headings.
- Explain both the how and the why. Do not stop at implementation steps.
- End with lessons learned, practical takeaways, or mistakes worth avoiding.
- Close with a short conclusion that leaves the reader with a concrete insight, an open question, or a next experiment.

## Content Rules

- Favor technically accurate examples over abstract statements.
- When using code blocks, always specify the language.
- Use lists, tables, and blockquotes only when they improve scanning.
- Include references or further reading when the article depends on external concepts, tools, or standards.
- If an article is speculative or opinionated, label that clearly and separate opinion from verified fact.
- Suggest further experiments or questions for readers to explore when appropriate.
- Suggest related articles or topics for readers who want to dive deeper into the subject.
- Suggest practical next steps for readers who want to apply the insights from the article in their own work.
- Suggest imagery, diagrams, or visualizations that could help illustrate complex concepts or architectures discussed in the article(highlight them so i can evaluate and evnetually add them).

## Frontmatter Expectations

- Always provide `title`, `description`, `pubDatetime`, and `tags`.
- Keep `description` specific and informative, not teaser copy.
- Choose tags that reflect the actual technical themes of the article.
- If `mainImage` is present, add `mainImageAlt`. Add caption and credit when useful.
- If it is not present suggest a main image that would fit the article and I'll check, retrieve it add it to the frontmatter.
- Use `ogImage` only as a fallback metadata value when a dedicated main image is not available.
- Code snippets in the article should be supported by the frontmatter metadata. For example, if the article includes a code example of a specific technology, consider adding a relevant tag and mentioning that technology in the description.

## Style Anchors

- The voice should feel like MonkeyProof: architecture, backend engineering, distributed systems, experiments, avoidable mistakes, and technically accurate chaos.
- Share lessons learned and tradeoffs, not just polished outcomes.
- If humor appears, keep it restrained and relevant.
- If a draft becomes too formal, rewrite it to sound more like a smart engineer talking to another smart engineer.

## When Unsure

- Default to English unless the user explicitly asks for another language.
- Prefer a complete, well-structured article over a flashy but shallow draft.
- Ask for clarification if the target audience, article depth, or intended stance is ambiguous.