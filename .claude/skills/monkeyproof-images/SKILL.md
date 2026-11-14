---
name: monkeyproof-images
description: Use when a MonkeyProof blog post needs artwork (a mainImage, in-article illustrations, or diagrams), when turning an IMAGE SUGGESTION comment into a real image, or when Davide asks for image prompts in the house style. Produces generator-ready prompts in the MonkeyProof cartoon-monkey style, plus file placement, naming, and Markdown wiring.
---

# MonkeyProof images

All MonkeyProof artwork shares one look: a painterly, hand-inked cartoon with a brown monkey as the protagonist. Generated images that drift from it (flat vector, 3D render, anime, photorealism, corporate isometric) break the visual continuity of the blog. This skill is how you keep them consistent.

You (the agent) usually **cannot generate raster images** yourself. Your job is to write prompts precise enough to get an on-style result on the first or second try (the art is generated at 1536×1024 and stored as WebP). Davide's default is to run **Codex CLI** in the repo root, so you hand over one self-contained Codex prompt that generates the images, saves them in the right place, and wires them into the post (see *Codex hand-off prompt*). If an image-generation tool or API *is* available in the session, use the same prompt with it.

## Reference images

Look at these before writing prompts (Read them, they render as images):

| File | Kind | What to learn from it |
| --- | --- | --- |
| `src/assets/images/everest.webp` | Scene / mainImage | Monkey as conductor, tech mascots as orchestra members, warm stage light |
| `src/assets/images/choice.webp` | Scene / mainImage | Monkey from behind at a crossroads, signposts with tool names, golden backlight |
| `public/images/devops_path.webp` | Diagram on a scene | Chalkboard flowchart with colored hand-lettered boxes, monkey at a desk in the foreground |
| `public/images/openeverest-bananaRama-workflow.webp` | Pure diagram | Aged parchment, hand-lettered title and labels, arrows, small monkey vignettes in corners |

## The house style

Always state these in the prompt; image models forget anything you leave implicit.

- **Medium**: hand-drawn cartoon illustration, bold dark ink outlines, painterly textured shading, visible grain/paper texture, slightly vintage storybook/comic feel. Not flat vector, not 3D, not anime, not photo.
- **Light and palette**: warm golden/amber light, often a glowing backlight or spotlight; earthy browns, oranges, ochres; cool blues used as accents (tech mascots, signage). Rich but not neon.
- **The monkey** (keep it identical across images): friendly cartoon monkey, chestnut-brown fur, light tan face and muzzle, big round tan ears, large dark expressive eyes, wide cheerful smile. Default outfit is an **orange hoodie** with a dark backpack covered in gear/wrench patches. Costume changes are fine when the scene calls for it (tuxedo with bow tie as conductor, lab coat with head lamp as rescuer), but the face and fur never change.
- **Tech as characters**: technologies appear as friendly anthropomorphic mascots or objects inspired by their themes, not copied logos (an elephant for PostgreSQL, a dolphin for MySQL, a whale-ship for Docker, a helm wheel for Kubernetes). AI agents are small friendly retro robots.
- **Recurring motif**: bananas. Sneak one in (a sign, a mug, a sticker, a pile on fire for "bad deployment").
- **Text**: short, hand-lettered labels on signs, boards, or tags. Keep every label to 1–3 words and spell them out in quotes in the prompt. Fewer labels means fewer typos.
- **Composition**: landscape 3:2, **1536×1024**. One clear focal point. Leave breathing room; the mainImage is also cropped for cards.

### Two image kinds

1. **Scene** (mainImage and most in-article art): a single funny situation that carries the post's metaphor. The joke should be readable without the caption.
2. **Diagram**: a flow or architecture drawn as if by hand on **aged parchment** or a **chalkboard**, with a hand-lettered title, rounded boxes or illustrated icons, thick hand-drawn arrows, and one or two small monkey vignettes. Max ~7 nodes; split bigger flows into two images.

## Prompt template

Fill every bracket. Keep the style block verbatim so all images match.

```text
[SCENE or DIAGRAM description: who is where, doing what, what the joke is.]
[Supporting characters/objects and what they mean.]
Text in the image, exactly as written and nothing else: "[Label 1]", "[Label 2]", "[Label 3]".

Style: hand-drawn cartoon illustration with bold dark ink outlines and painterly, textured shading, subtle paper grain, vintage storybook comic feel. Warm golden amber lighting with soft glow, earthy browns and oranges with blue accents. The protagonist is a friendly cartoon monkey with chestnut-brown fur, light tan face, big round tan ears, large dark expressive eyes and a wide smile, [outfit, default: wearing an orange hoodie and a dark backpack with gear and wrench patches]. Landscape 3:2, 1536x1024. No flat vector, no 3D render, no photorealism, no real brand logos, no extra text.
```

For diagrams, replace the first lines with the layout: background (parchment or chalkboard), title text, the nodes left-to-right or top-to-bottom with their labels, the arrows between them, and where the monkey vignette sits.

## Workflow

1. Read the post (and its `<!-- IMAGE SUGGESTION -->` comments) and Read two reference images of the same kind.
2. For each image, decide scene vs diagram, the one joke or one flow it carries, and the exact labels.
3. Write the prompt from the template. Also give: filename, target folder, alt text, caption.
4. Hand over a **single Codex hand-off prompt** (see next section) by default: Davide runs Codex CLI in the repo root to generate the images, and Codex places and wires them. Open the message with "Written for: Codex CLI, run in the repo root." Only give bare per-image prompts if he asks for those specifically.
5. If he reports drift, give a targeted regeneration prompt for that single image with one corrective sentence ("the monkey's face must match: tan muzzle, round tan ears") rather than rewriting the style block.
6. If the images come back to you instead (or a generation tool is available in your session), do the placement and wiring yourself (see *Files and wiring*), remove the `<!-- IMAGE SUGGESTION -->` comments, and run `npx astro check`.

## Codex hand-off prompt

One self-contained prompt, in English, inside a ` ````text ` fence so Davide can paste it or run `codex "$(cat prompt.md)"`. Codex has no access to this conversation, so the prompt must contain everything: exact paths, full image prompts (style block included), exact frontmatter values, exact edits. Use this skeleton and fill every bracket:

````text
You are working in the MonkeyProof blog repo (Astro). Generate [N] illustrations for the post src/data/blog/[slug].md, save them at the exact paths below, and wire them into the post.

## Step 0: match the house style
Before generating, look at these reference images. Every new image must match their style:
- src/assets/images/everest.webp
- src/assets/images/choice.webp
- public/images/devops_path.webp
- public/images/openeverest-bananaRama-workflow.webp
If your image tool accepts reference images, pass everest.webp and choice.webp for scenes, and openeverest-bananaRama-workflow.webp for diagrams. The full style guide is in .claude/skills/monkeyproof-images/SKILL.md.

Generate every image as PNG, landscape, 1536x1024. It gets converted to WebP in a later step.

## Image [n]: save to [src/assets/images/<slug>.png for the mainImage | public/images/<name>.png for in-article] (temporary PNG)
Prompt:
[full prompt from the template, including the "Text in the image, exactly as written and nothing else" line and the full Style block]

[...one section per image...]

## Quality check (do this for each image)
Open the generated image and check it. Regenerate (at most 2 retries per image) if any of these is true:
- a label is misspelled, missing, or there is extra text;
- the style is off (flat vector, 3D, photoreal, anime);
- the monkey doesn't match the references (chestnut fur, tan face, big round tan ears).

## Wire the images into the post
Edit src/data/blog/[slug].md:
1. [If there is a mainImage] In the frontmatter, insert these lines right after `draft: true` (or after `tags` if there's no draft line). Do this only once the file exists:
   mainImage: ../../assets/images/[slug].webp
   mainImageAlt: "[concrete description of what is drawn]"
   mainImageCaption: [witty caption]
   mainImageCredit: MonkeyProof internal artwork
2. [For each in-article image] [Either: "The post already has a <figure> pointing to /images/<name>.webp. Leave it unchanged." Or: "Insert this <figure> block right after the paragraph starting with '<first words>': <exact figure markup>".]
3. Delete the HTML comment lines that start with `<!-- IMAGE SUGGESTION:` ([count] of them). Delete only those lines. Leave every other comment alone, especially all `<!-- TODO verify` comments.
4. Do not change any other text in the post.

## Convert every image to WebP
The house format is WebP (a 3 MB PNG becomes ~300 KB). For every generated PNG (mainImage included), convert it and delete the PNG:
magick [path]/[name].png -strip -quality 85 [path]/[name].webp && rm [path]/[name].png
All references in the post (frontmatter and <figure> src) must point to the .webp files.

## Verify
Run `npx astro check` and make sure it reports 0 errors.
Then report:
- every file path and its dimensions (`magick identify <file>`);
- the retries you needed and why;
- any label you couldn't get spelled correctly.
Do not commit.
````

Before handing it over, check the post yourself: the figure `src` paths and the number of `IMAGE SUGGESTION` comments in the prompt must match what is actually in the file. Mention in your message that Codex won't commit, so Davide can review the images first.

## Files and wiring

The house format is **WebP** at quality 85: generate the PNG, convert, delete the PNG.

```sh
magick <path>/<name>.png -strip -quality 85 <path>/<name>.webp && rm <path>/<name>.png
```

- **mainImage** → `src/assets/images/<slug>.webp` (Astro also optimizes it). Frontmatter:

  ```yaml
  mainImage: ../../assets/images/<slug>.webp
  mainImageAlt: "What the image shows, concretely"
  mainImageCaption: Short, ideally witty caption.
  mainImageCredit: MonkeyProof internal artwork
  ```

  Only add `mainImage` once the file exists, or the build fails.

- **In-article images** → `public/images/<kebab-case-name>.webp` (not optimized by Astro, so the WebP conversion is what keeps them light):

  ```md
  <figure>
    <img src="/images/<name>.webp" alt="Concrete description of what is drawn." />
    <figcaption>Caption that adds a joke or a fact, not a restatement.</figcaption>
  </figure>
  ```

- Exception: `public/monkeyproof-og.png` (the social card) stays PNG.
- Alt text describes what is drawn (characters, action, labels), not what it symbolizes. Captions follow the `monkeyproof-writing` voice.
