---
title: "BMAD Method, Honestly: Where It Shines, Where It Struggles, and Why I Built My Own"
description: "A practical review of the BMAD Method for AI-driven development: how its agents, skills and planning paths work, where it excels, where it struggles on large brownfield platforms, and the knowledge-first framework I built instead."
pubDatetime: 2026-11-14T10:00:00Z
tags:
  - ai-assisted-development
  - spec-driven-development
  - software-architecture
  - claude-code
featured: false
draft: false
mainImage: ../../assets/images/bmad-iceberg.webp
mainImageAlt: "A cartoon monkey in a rowboat next to an iceberg: a tiny tip flagged PRD above water and a huge underwater mass labelled Platform Knowledge, full of books and gears."
mainImageCaption: The spec is the tip. Guess what sinks the ship.
mainImageCredit: MonkeyProof internal artwork
---

## TL;DR

BMAD (Breakthrough Method for Agile AI-Driven Development) is an open source, MIT-licensed method that turns your AI coding tool into a small agile team: an analyst, a PM, an architect, a product owner, a developer, a UX designer, each with a name and a job. It is great at taking a fuzzy idea to a PRD, an architecture and a backlog of buildable stories, and it is honest about scaling ceremony to the size of the work. It struggles when the hard part is not "what should we build" but "what does this three-year-old platform already do, and why". For that situation I evaluated it, dropped it, and built a knowledge-first framework where the documentation of the system is the product and agents are thin consumers of it. Today that knowledge base lets me get docs, designs and internal tools out of very short prompts.

---

## Why I Even Looked at BMAD

Every few months the AI coding world produces a new Method™ that promises to stop your agent from vibe-coding a distributed monolith at 2 a.m. Most of them are a prompt with a logo. BMAD is not one of those: it has a real community, real docs at [docs.bmad-method.org](https://docs.bmad-method.org/), a public repo, and a clear opinion about how AI-assisted delivery should work.

I came to it with a specific problem. At work I was (and still am) on a large platform in the packaging and food & beverage world, in development for about three years. The AI tools were good at writing code. They were terrible at knowing *which* code to write, because on any platform of that size, a good chunk of the knowledge needed to answer that lives in people's heads and in old tickets, not in the code.

So the question was: can BMAD be the thing that gives agents the context they lack? Spoiler from the title: not for that project. But it deserves a fair hearing first, because for a lot of teams it is a very good answer.

---

## What BMAD Actually Is

BMAD describes itself as a way to "turn an idea or change request into working software without giving up the thinking". The emphasis on *thinking* matters. The method is built around the idea that you make the decisions, the AI does the legwork, and the reasoning behind every decision is written down so it survives the end of the chat session.

Technically, BMAD is a set of **skills**: named commands that plug into AI coding tools like Claude Code or Cursor. You install them into a project, and your agent gains a vocabulary of workflows it can run. The current docs cover v7 (in preview alpha at the time of writing, with frequent breaking changes) while v6.12 is the stable release. The two install paths look like this:

```sh
# v6.12 (stable)
npx bmad-method install

# v7 (preview alpha): core tools are required, the method skills add the workflows
npx skills add bmad-code-org/BMAD-METHOD/skills/core-tools --skill '*'
npx skills add bmad-code-org/BMAD-METHOD/skills/method --skill '*'
```

Setup creates a `_bmad/` folder for shared config, `_bmad/custom/` for your team's overrides (they survive updates), and `_bmad-output/` where the documents and tickets end up. Then you open your coding tool and ask the `bmad` skill what to do next. It inspects the project and recommends a path, which is a nice touch for people who would otherwise read the docs for an hour and then do whatever they were going to do anyway.

### The Cast

The most recognizable part of BMAD is the team of personas. Each one is an agent with its own menu of commands:

| Persona | Skill | What they do |
| --- | --- | --- |
| Mary, Analyst | `bmad-agent-analyst` | Brainstorming, research, briefs, PRFAQs, BRDs |
| John, Product Manager | `bmad-agent-pm` | Creates and validates PRDs |
| Winston, Architect | `bmad-agent-architect` | Records architecture decisions |
| Sally, UX Designer | `bmad-agent-ux-designer` | UX design (`DESIGN.md`, `EXPERIENCE.md`) |
| Sofia, Product Owner | `bmad-agent-po` | Slices requirements into tickets, manages the board |
| Amelia, Developer | `bmad-agent-dev` | Builds, writes QA tests, reviews, runs retrospectives |

There used to be a Technical Writer, Paige, who is officially "on hiatus". I like to think she's on a beach somewhere, finally free of documenting other people's microservices.

Around the personas sit the workhorse skills: `bmad-build` turns a work item into reviewed, verified code; `bmad-code-review` runs several reviewers and triages their findings; `bmad-retrospective` judges a finished epic against its requirements; `bmad-party-mode` puts several agents in a room to argue, which is exactly as chaotic and as useful as it sounds.

### How It Works: The Loop and the Paths

The delivery loop has four stages: **Clarify, Plan, Build and verify, Learn and adjust**. Vague ideas enter at Clarify, big but clear ideas at Plan, small changes go straight to Build. What I appreciate is that BMAD does not force everything through the full pipeline. The docs define four planning paths:

1. **Trivial**: an obvious, low-risk edit. You don't need BMAD. (A method telling you not to use it is a good sign.)
2. **One session**: run `bmad-build`, which plans, builds and reviews the change.
3. **Epic-sized**: give Sofia the epic intent, she fills in requirements and slices stories into a `tickets.toml` in build order, you run `bmad-build` per story, then `bmad-retrospective`.
4. **Project-sized**: several epics or a greenfield product (the docs say roughly 20 or more sessions). You produce the shared planning documents the project needs (brief, PRD, UX, architecture) and Sofia turns the initiative into epics.

The guidance on documents is refreshingly unbureaucratic: a PRD only when more than one person must agree on what the product is, a BRD only when there's a client/vendor split or a regulator wants a signed baseline, architecture and UX docs only when decisions must stay consistent across separately built epics. The docs even say it out loud: too little planning costs one Build run, too much produces documents nobody reads.


<figure>
  <img
    src="/images/bmad-agent-standup.webp"
    alt="A cartoon monkey running a stand-up meeting with six robot agents wearing name badges, next to an empty beach chair labelled Paige."
  />
  <figcaption>Daily stand-up, BMAD edition. Paige sends her regards from the beach.</figcaption>
</figure>

---

## Where BMAD Shines

### Going From Napkin to Backlog

This is BMAD's home turf. If you have an idea and no product yet, the sequence of brainstorm, forge the idea (`bmad-forge-idea` pressure-tests it with questions), brief, PRD, architecture, epics, stories is genuinely good. It forces you to answer the questions you'd otherwise discover in week six, when they're expensive. Having an agent persona whose whole job is to poke holes in your PRD is like having a colleague who reads the spec *before* the meeting. Rare, precious, slightly annoying.

### Decisions That Survive the Chat Window

The biggest failure mode of AI-assisted development is amnesia. You explain the context, the agent does good work, the session ends, and tomorrow you explain it all again, slightly differently. BMAD's artifacts are files in your repo, so the "why" travels with the code. That alone puts it ahead of the classic "giant prompt in a notes app" approach.

### Right-Sized Ceremony

Many spec-driven tools have a sledgehammer-for-a-nut problem: every typo fix becomes a requirements document. BMAD's paths make that explicit and let small work skip the ceremony. You still need the discipline to pick the right path, but the method gives you permission not to over-plan.

### Review Built In

`bmad-build` doesn't stop at "code compiles". It plans, builds and reviews, and `bmad-code-review` runs multiple reviewers and triages findings. `bmad-walkthrough` guides a *human* through reviewing a commit or PR. Given how confidently wrong agents can be, a method that treats review as a first-class step instead of an afterthought gets points from me.

### Extensibility

The Toolsmith module (`bmad-toolsmith`, persona Smithy) builds new skills, agents and modules, and `bmad-eval` measures whether a skill actually works with baseline vs variant runs. Customizations live in `_bmad/custom/` and survive updates. There's an ecosystem around it too: a Creative Intelligence Suite, a Game Dev Studio, and a Test Architect (TEA) module for teams that want serious test strategy.

---

## Where BMAD Struggles

Some of the criticism floating around the web refers to older versions (v4, the v6 alpha), and the team has clearly listened. I'll point out where that's the case.

### The Brownfield Problem

BMAD's mental model starts from intent: *what do we want to build?* On a greenfield project that's the hard question. On a mature platform the hard question is different: *what does the system already do, what are the unwritten rules, and which of the three ways we do authentication is the one that wins?*

The criticism here is consistent across independent write-ups. [CodeMySpec](https://codemyspec.com/blog/bmad-method-explained) notes that BMAD's documentation-first assumptions "don't always map cleanly onto a 10-year-old monolith". [Simon Martinelli](https://martinelli.ch/why-spec-driven-development-tools-fail-in-the-enterprise/) argues that BMAD, Spec Kit and Kiro are all greenfield-first and assume a single driver going from spec to code, ignoring stakeholders, reviews and compliance (worth knowing: his post also promotes his own alternative, AIUP). A user on [GitHub issue #446](https://github.com/bmad-code-org/BMAD-METHOD/issues/446), working on a brownfield bug investigation with v4, hit hardcoded paths like a single `docs/prd.md` and asked for a feature-level concept so agents could coordinate on parallel work streams.

The fun part is that BMAD v7 more or less agrees. The old `bmad-document-project` workflow, which generated whole documentation trees for existing repos, is now deprecated, and the docs describe its output as "large, unverified, stale on arrival". The new `bmad-project-context` skill does the opposite: it writes a deliberately tiny block into `AGENTS.md` with only the things an agent can't cheaply learn from the code (commands that the obvious guess gets wrong, policies, divergent conventions, confirmed pitfalls). Their own line is "the old skills wrote more documentation. This skill keeps less, and checks it."

That is a good idea, and I agree with it *for implementation context*. But the docs are explicit that planning context (rationale, rejected approaches, ownership, org standards) is out of scope and "coming separately". On a three-year-old platform, that missing piece is the whole game.

### Ceremony and Token Cost

Every phase is more model calls, more documents in context, more tokens. On a big project the PRD and architecture alone can be large enough to squeeze small context windows. The sizing paths help, but the moment you're in project-sized mode you pay for it, in money and in wall-clock time.

### Personas Are a Leaky Abstraction

Named agents are great for onboarding and for making a process feel tangible. They're less great when the real organization doesn't look like the simulated one. On my platform, the architectural knowledge was spread across many domain teams, product decisions came from more than one place, and plenty of rules lived in the contracts between services rather than in any document. A simulated Scrum team on top of a non-Scrum reality produces documents that look right and are subtly wrong. *Opinion*: the personas are a UX choice, and a good one, but they model a team, not a system.

### Learning Curve and Churn

There are a lot of skills, a lot of menu codes, and at the moment a major version in preview alpha that the docs themselves warn "can break an existing setup". If you're adopting it across a team, budget time for that.

### The Usual AI Caveat

None of this removes the need for someone who knows the system to review the output. In a [hands-on brownfield comparison](https://medium.com/@mathivananmani/reviving-brownfield-projects-with-ai-a-comparative-look-at-github-spec-kit-openspec-and-bmad-a7bc5116dd9a), BMAD's quick spec correctly identified the touch points in existing classes, and a proper review still found logic mistakes that would have caused regressions. That's not a BMAD problem, it's an LLM problem, but it caps how much a method can promise.

---

## Alternatives and Different Approaches

There's no universal winner, so here's how I'd choose:

| Situation | What I'd reach for |
| --- | --- |
| Greenfield product, fuzzy idea, want structure | **BMAD**. This is its sweet spot. |
| One feature at a time, minimal process | [GitHub Spec Kit](https://github.com/github/spec-kit): slash commands that go from spec to plan to tasks to code, no personas. |
| Changes to an existing codebase, lightweight | [OpenSpec](https://github.com/Fission-AI/OpenSpec): one folder per change with proposal, spec deltas, design and tasks; explicitly built for brownfield. |
| You want the tool to own the workflow | [Kiro](https://kiro.dev/): spec-driven planning and verification inside its own IDE, CLI and web app. |
| Engineering discipline over product planning | [Superpowers](https://github.com/obra/superpowers): brainstorm, plan, TDD, subagent execution, as skills. |
| Enterprise, requirements-heavy, many stakeholders | [AIUP](https://martinelli.ch/why-spec-driven-development-tools-fail-in-the-enterprise/): use-case-driven and iterative, scoped to features within bounded contexts. |
| Big, old, weird platform | Build a knowledge layer first, then pick any of the above (or none). Keep reading. |

The pattern I keep seeing: the tools differ in *how much process* they impose, but they mostly share the same assumption that the spec you write now is the main source of truth. On a mature system, the main source of truth is the system, and the spec is a thin delta on top of a mountain of existing behavior. If that mountain isn't documented in a form agents can use, no amount of process fixes it.

---

## The Project Where I Said No

Back to the platform. Three years of development, a .NET backend and React micro-frontends, split into many domains. Each domain has its own set of microservices and micro-frontends, and on top of that sits a layer of shared "common" microservices used across domains. Nothing unusual for a system of that size and age: it's simply a lot to hold in your head, and much of the reasoning behind it lives with the people who made the decisions rather than in the repository. Great for coffee-machine conversations, less great for an AI agent that can't join them.

I gave BMAD v6 two jobs. First, document the existing platform with `bmad-document-project`, so the agents would have something to stand on. Then, run a real feature through the planning flow: PRD, architecture, stories.

The documentation pass went about as well as you'd expect from the sentence "many domains, each with many microservices". It didn't scale: the context exploded, and so did time and cost. What came out was a lot of generic text describing structure and files (things the code already says), some of it simply wrong or invented, and none of the *why*: no decisions, no rationale, no record of the options we had already tried and abandoned. In hindsight, the v7 docs' verdict on that skill ("large, unverified, stale on arrival") is a fair summary of my experience.

The feature run inherited the same problem. The planning agents did what they're designed to do and produced a clean PRD and a tidy architecture document, written as if the platform were a blank slate with some code in it. Every document needed someone who knew the platform to correct it, and at that point the human was doing the hard part and the agents were doing the typing.

BMAD's own docs warn about exactly this: "If a PRD cites nothing the repository already does, expect design rework once Build meets the real code." Fair. The issue was that making the PRD cite what the platform does required knowledge that wasn't in the repo at all.

So I flipped the problem around.

### Knowledge First, Agents Second

Instead of a method that starts from *intent* and generates documents, I built a framework that starts from *knowledge* and treats every output (docs, designs, code, tools) as a projection of it. The idea is simple to say and annoying to do: before you ask agents to build anything, give them a structured, verified model of the system.

The framework has four parts:

1. **A knowledge base of the platform.** Domain concepts and their relationships, bounded contexts and who owns them, architectural decisions *with their rationale and the alternatives we rejected*, integration contracts, conventions (and which one wins when two coexist), known pitfalls. Plain Markdown in the repo, structured so an agent can navigate it by following links instead of loading everything.
2. **A custom MCP server.** It gives agents two things: search over the knowledge base, so they pull only the slice that matters for the task instead of the whole thing, and queries over the code itself, so they can check the knowledge against what the services actually do. With this many domains, "load everything into context" stops being an option very quickly.
3. **Thin skills and agents that consume it.** Generating a design doc, documenting a domain, scaffolding an internal tool, reviewing a change against the conventions: each is a small skill or a dedicated subagent whose main job is to fetch the right knowledge and apply it. They're boring on purpose. The intelligence lives in the knowledge, not in elaborate prompts.
4. **A maintenance loop.** Every piece of work that teaches us something new feeds back into the knowledge base. A rule that a tool or test now enforces gets removed from the docs. Knowledge has owners, just like code.

If that last point sounds familiar, it's because BMAD's v7 project context lands on very similar rules for its small `AGENTS.md` block: refresh, audit, "smaller or equal, never larger". We reached the same conclusion about implementation context from different directions. Where we differ is scope: I needed the planning context (the *why*, the history, the rejected options) to be first-class, because on a mature platform that's where agents go wrong.


<figure>
  <img
    src="/images/knowledge-first-framework.webp"
    alt="Diagram of a knowledge-first framework: a large platform knowledge layer at the bottom feeding thin skills that produce docs, designs, internal tools and reviews, with a feedback loop back into the knowledge layer."
  />
  <figcaption>The agents are the easy part. The knowledge is the iceberg.</figcaption>
</figure>

### Why It Works for "Any Project in the Same Situation"

None of the framework is specific to our domain. The skeleton (what kinds of knowledge to capture, how to structure it, how skills consume it, how it stays true) is reusable for any large platform with years of history. The content is project-specific, the shape isn't. That's the part I'd hand to another team in the same situation.

### What It Gives Us Today

Once the knowledge base reached critical mass, the prompts got short. Really short. Requests that used to need a page of context now look like "document this domain", "propose a design for this change" or "scaffold a micro-frontend for X", and the output follows our conventions, references the right decisions, and respects constraints nobody mentioned in the prompt.

Today it produces documentation, designs and architecture proposals, internal tools, code and reviews. In practice, docs and designs that used to take days now take hours, and internal tools that would have eaten weeks get built over a weekend. The framework itself stays internal, but the shape described above is the part worth stealing.

The agents didn't get smarter. They got informed. *Turns out the secret ingredient of AI-assisted development is the thing we've been skipping for twenty years: writing stuff down.*

---

## Lessons Learned

- **Pick the method for the hard part of your project.** If the hard part is deciding what to build, BMAD is a strong choice. If the hard part is understanding what you already built, invest in knowledge first.
- **Generated documentation of existing code is mostly noise.** BMAD learned this too. Agents read source better than summaries of source. Capture what the code *can't* tell you.
- **Rationale is the scarcest resource.** Why a decision was made, and what was rejected, is the knowledge that prevents agents (and new humans) from re-proposing the thing you abandoned two years ago.
- **Knowledge needs owners and pruning.** A knowledge base that only grows ends up as the kind of wiki nobody trusts (we've all met one).
- **Methods are composable.** Nothing stops you from running BMAD's planning paths on top of your own knowledge layer. The knowledge layer is the part that's hard to get from a package.

---

## Conclusion

BMAD is one of the most thoughtful takes on AI-assisted delivery around: right-sized process, decisions written down, review built in, and a team willing to deprecate its own workflows when they turn out wrong. For greenfield products and well-understood codebases, try it.

For a big platform with years of history, the bottleneck isn't process, it's context. That's where I ended up building my own framework, and the open question I'm still chewing on is whether planning context can ever be generated, or whether it always has to be harvested from the humans who made the decisions. BMAD says theirs is "coming separately". I'm curious to see what they come up with.

---

## Further Reading

- [BMAD Method documentation](https://docs.bmad-method.org/)
- [BMAD: Choose a Planning Path](https://docs.bmad-method.org/plan/choose-a-planning-path/)
- [BMAD: The Theory of Project Context](https://docs.bmad-method.org/existing-codebases/theory-of-project-context/)
- [BMAD-METHOD on GitHub](https://github.com/bmad-code-org/BMAD-METHOD)
- [Why Spec-Driven Development Tools Fail in Enterprise](https://martinelli.ch/why-spec-driven-development-tools-fail-in-the-enterprise/) (Simon Martinelli)
- [Reviving Brownfield Projects with AI: Spec Kit, OpenSpec and BMAD](https://medium.com/@mathivananmani/reviving-brownfield-projects-with-ai-a-comparative-look-at-github-spec-kit-openspec-and-bmad-a7bc5116dd9a)

## Practical Next Steps

- Try BMAD on a small greenfield side project and run the full project-sized path once, just to feel the flow.
- On your work codebase, list five things a new colleague always gets wrong. That's the seed of your knowledge base.
- Write down the rationale for the last three architectural decisions your team made, including what you rejected. Then ask an agent to propose a design in that area and see how much better it gets.
