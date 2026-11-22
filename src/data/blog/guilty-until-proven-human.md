---
title: "Guilty Until Proven Human: AI Is the New Default Suspect for Every Outage"
description: "Outages, breaches, and bugs are starting to get blamed on AI before anyone opens a log. Why the reversed burden of proof is coming, why it is convenient for everyone, and how to keep the evidence that proves who actually broke production."
pubDatetime: 2026-11-22T10:00:00Z
tags:
  - ai-assisted-development
  - devops
  - incident-management
  - security
featured: false
draft: false
mainImage: ../../assets/images/guilty-until-proven-human.webp
mainImageAlt: "A cartoon courtroom: a nervous little robot in the defendant's chair, a monkey judge with a gavel, a jury of monkeys already holding GUILTY signs, and an unread log sheet under a coffee mug on the evidence table."
mainImageCaption: The jury reached a verdict before anyone opened the logs.
mainImageCredit: MonkeyProof internal artwork
---

## TL;DR

We are drifting toward a world where, when something breaks, AI is presumed guilty and a human has to prove otherwise. For an outage, the first theory is "an AI attacked us". For a CVE, it is "the AI wrote that code". For a bad decision, it is "the model hallucinated". It's convenient for everyone: the AI can't be fired, can't sue, and doesn't show up to the postmortem. It's also bad engineering, because the wrong default suspect makes incidents slower to fix. My (opinionated) prediction is that "who wrote this, a person or an agent?" becomes a standard incident question, and the teams that win are the ones that kept the receipts: commit trailers, agent logs, change provenance. The most likely culprit is still the same one as always: a boring change, made in a hurry, by a system nobody fully understands anymore.

---

## The New "It's Always DNS"

Every ops team has a folk religion. For years ours had one commandment: *it's always DNS*. When it wasn't DNS, it was the certificate that expired on a Sunday. When it wasn't the certificate, it was the intern, who had been gone for six months but remained a convenient legend.

That religion is getting a new god.

Pay attention next time a big service goes down. Within minutes, before the status page has finished saying "we are investigating", the replies under the outage post sort themselves into the usual groups. Someone says cyberattack. Someone else says it's an AI-powered cyberattack. A third person suspects the company "replaced all the engineers with ChatGPT". Nobody has seen a single log line. Everybody has a theory, and lately the theory has a chatbot in it.

I call this the reversed burden of proof: *AI is guilty until a human proves otherwise.* And I think it's going to get much worse before it gets better.

---

## How the Presumption Works

The pattern repeats across very different kinds of failure.

### Outages: "Was It an AI Attack?"

When a system fails in a spectacular way, the human brain wants a villain proportional to the damage. "Someone deployed a bad config" feels too small for millions of people unable to book a flight. A shadowy superintelligence feels the right size.

We've been here before, minus the AI. On 19 July 2024 a faulty CrowdStrike content update crashed about 8.5 million Windows machines, by Microsoft's estimate. Airports, hospitals, and banks went down, and for the first few hours the internet was convinced it was a massive cyberattack. It was a bad update file. In October 2021, Facebook, Instagram, and WhatsApp vanished for around six hours, and the hacker theories were everywhere. It was a command issued during routine backbone maintenance that disconnected Facebook's data centers; BGP routes were withdrawn, DNS went with them, and so did the internal tools engineers needed to fix it.

Neither had an attacker. Both were complex systems doing what complex systems do. Swap "hackers" for "AI" in the speculation and you have the 2026 version.

### Security Bugs: "The AI Wrote That"

This one is more interesting, because sometimes it's even true. A lot of code now gets written with an assistant in the loop, so when a SQL injection shows up in review, "the AI generated that" is a statistically reasonable guess.

It's also the most comfortable sentence a developer can say. Compare:

- "I didn't parameterize the query." (You, at the retrospective, sweating.)
- "Copilot didn't parameterize the query." (A tool, at the retrospective, not sweating, because it has no glands.)

Same bug, same commit, same person who pressed merge. One version comes with personal responsibility; the other comes with a vendor to complain about.

### Decisions: "The Model Hallucinated"

The quietest version of the presumption lives in business decisions. A wrong number in a report, a support reply that promised a refund nobody approved, a summary that dropped the one clause that mattered. "The AI hallucinated" ends the conversation. Nobody asks who decided to ship an unreviewed output straight to a customer, which was the actual decision, and a very human one.

---

## Why Everyone Loves This Scapegoat

The AI is the perfect suspect. A quick character profile:

- It can't be fired, so blaming it costs nobody their job.
- It has no lawyer (the vendor does, but the vendor's terms of service already said "outputs may be inaccurate" in a font size usually reserved for pharmaceutical side effects).
- It doesn't attend the postmortem to say "actually, you told me to do that".
- It's in the news every day, so the story writes itself.
- It sounds sophisticated. "We were hit by an advanced AI-driven threat" plays much better at the board meeting than "someone renamed a column in production".

(Ask me how I know. The AI was not involved in my column incident; it would have at least asked.)

There's also a second-order incentive. If AI is the villain, the fix is a product: buy the AI security tool, the AI observability tool, the AI that watches the other AI. If the villain is "we have too much change and too few people who understand the system", the fix is hiring, slower releases, and boring process. Guess which one gets a booth at the conference.

---

## The Plot Twist: AI Probably Isn't the Attacker, but It's Often at the Crime Scene

Here's where I get off the "it's never the AI" bus too, because that's just the same lazy default pointing the other way.

My opinion: the realistic way AI breaks your production isn't a rogue model launching an attack. It's volume. Assistants and agents make it cheap to produce changes, and cheap changes get produced. More pull requests, more dependency bumps, more "small refactors" that touch forty files, more patches for bugs that automated scanners found faster than anyone can test the fixes. Every one of those changes goes into the same old pipeline with the same old number of reviewers.

Safety engineering has a name for how this ends. James Reason's Swiss cheese model says accidents happen when the holes in several layers of defense line up. Charles Perrow, in *Normal Accidents*, argued that in tightly coupled, complex systems, failures aren't freak events; they're expected. AI doesn't need to be the hole. It just needs to slide a lot more slices of cheese through the machine, faster, while the people checking the slices get fewer and more tired.

So in a typical incident, AI might be:

| Role | Example | Who's actually responsible |
| --- | --- | --- |
| Attacker | A model autonomously exploiting your system | Whoever pointed it at you |
| Author | An agent wrote the buggy code | Whoever reviewed and merged it |
| Accelerant | Change volume outran your testing | Whoever set the release pace |
| Alibi | Nobody checked, AI got blamed | Everyone in the meeting |

In my experience the last two rows are where the action is. The first row makes the headlines.

<figure>
  <img
    src="/images/swiss-cheese-change-conveyor.webp"
    alt="A robot happily loads Swiss cheese slices onto a fast conveyor belt labelled CHANGES while an exhausted monkey with a magnifying glass tries to inspect them; a beam of light passes through aligned holes into a server labelled PROD."
  />
  <figcaption>The robot isn't the hole. It just keeps adding cheese.</figcaption>
</figure>

---

## Why the Wrong Default Suspect Is Expensive

Blameless postmortems, as described in the [Google SRE book](https://sre.google/sre-book/postmortem-culture/), exist because blame makes people hide information, and hidden information makes incidents repeat. "Blame the AI" looks blameless (no human gets yelled at), but it does the same damage from the other side.

- **It slows diagnosis.** If the first hour goes into "is this an attack?", that's an hour not spent on "what changed in the last 24 hours?", which is the question that solves most outages.
- **It ends the analysis too early.** "The model generated vulnerable code" is a description, not a root cause. Why did review miss it? Why did no test catch it? Why did it reach production on a Friday at 17:55? Stopping at "AI" skips the useful questions.
- **It erodes trust in both directions.** Teams that over-blame AI stop using tools that would help them. Teams that under-blame it stop reviewing what the tools produce.
- **It creates a moral hazard.** If "the AI did it" reliably gets you off the hook, people will start saying it about things the AI didn't do. Give it a year and someone will blame Copilot for a bug from 2014.

---

## What "Proving Otherwise" Will Look Like

If the presumption is coming anyway, the practical move is to make sure you can answer the question quickly and honestly. My prediction (opinion, label firmly attached) is that "was this change written by a person or an agent, and who approved it?" becomes as routine in incident reviews as "when was it deployed?". Teams with receipts will answer in minutes. Teams without them will argue for a week.

Some cheap receipts you can start keeping today:

**Mark AI-assisted commits.** Git trailers are free and greppable. Claude Code, for example, adds a `Co-Authored-By` trailer by default; you can adopt the same convention for any tool:

```text file=commit-message.txt
fix(orders): parameterize customer lookup query

Co-Authored-By: Claude <noreply@anthropic.com>
Reviewed-by: Davide Maggi
```

Then answering "how much of this module did an agent touch?" is one command:

```sh
git log --format='%h %an %s' --grep='Co-Authored-By: Claude' -- src/orders/
```

**Keep agent logs like you keep deploy logs.** If an agent can open PRs, run migrations, or touch infrastructure, its session transcripts and tool calls are audit data. Store them with a retention policy, not in someone's laptop temp folder.

**Give agents their own identities.** An agent that acts with a human's personal token makes every action look human, which destroys the evidence in both directions. A dedicated service account with scoped permissions makes the audit trail honest.

**Write the human decision down.** The accountable moment is almost never "the model produced X". It's "someone decided X was good enough to ship". Approvals in the PR, a named owner on the change, a reason in the ticket. That's what the postmortem actually needs.

The goal is to be able to say "it wasn't the AI, it was the certificate that expired on a Sunday" with a straight face and a link.

---

## Lessons Learned (So Far)

- Default to "what changed?" before "who attacked us?". It was true before AI, and it's still true.
- "The AI did it" is never a root cause. Keep asking why until you reach a decision a human made: to merge, to skip the test, to ship on Friday.
- Watch the change rate, not just the change content. If AI doubled your output and your review capacity stayed flat, you've already found your next incident.
- Keep provenance: who or what wrote the change, who approved it, when it shipped. Cheap now, priceless at 3 a.m.
- Be equally suspicious of "it's definitely AI" and "it's definitely not AI". Both are guesses wearing a confident hat.

---

## Conclusion

The robot in the defendant's chair makes a great headline, and once in a while it'll even be guilty. But most of the time, when you pull the logs, you'll find the same suspect we've always found: a reasonable person, under time pressure, making a change to a system too big for anyone to hold in their head. AI makes that person faster. It doesn't make them disappear, and it definitely doesn't take their place in the postmortem.

The open question is the uncomfortable one. If we keep blaming the AI for everything, how long until we stop checking whether it was actually us?

(It was probably DNS.)

---

## Further Reading

- [Postmortem Culture: Learning from Failure](https://sre.google/sre-book/postmortem-culture/), Google SRE book
- [Helping our customers through the CrowdStrike outage](https://blogs.microsoft.com/blog/2024/07/20/helping-our-customers-through-the-crowdstrike-outage/), Microsoft, with the 8.5 million devices estimate
- [More details about the October 4 outage](https://engineering.fb.com/2021/10/05/networking-traffic/outage-details/), Meta Engineering
- Charles Perrow, *Normal Accidents: Living with High-Risk Technologies* (1984)
- James Reason, *Human Error* (1990), where the Swiss cheese model comes from

## Practical Next Steps

1. Add a commit trailer convention for AI-assisted changes and write it into your contributing guide.
2. Check which identity your agents use to act. If it's yours, give them their own.
3. Add one line to your incident template: "Change provenance: human / agent / both, approved by ___".
4. Next outage, time how long it takes for someone to say "AI". Then time how long it takes to check what was deployed. Compare.
