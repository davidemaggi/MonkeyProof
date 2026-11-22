---
name: monkeyproof-social
description: Use when Davide wants to promote or publish a MonkeyProof post on social media (LinkedIn, X, or other channels), write the social copy for an article, or run/extend the n8n "MonkeyProof Social Publisher" workflow. Covers copy per channel, the social image, the approval gate, and the webhook call that publishes.
---

# MonkeyProof social publishing

Social posts for MonkeyProof articles are published through a self-hosted n8n workflow, **MonkeyProof Social Publisher** (`https://n8n.davidemaggi.dev/workflow/n5aQBb7qUK6Bgncy`). One webhook call publishes to every requested channel; channels run independently, so a failure on X doesn't block LinkedIn.

Davide talks in Italian; the social copy is in English (like the blog) unless he asks otherwise.

## Hard rules

- **Never publish without Davide's explicit OK on the final text of every channel.** Show the exact copy, then wait. "Make it viral" is not approval; "ok pubblica" / "go" is.
- Publishing is outward-facing and not undoable from here (deleting a post later doesn't un-notify anyone). If anything in the payload changed after approval, ask again.
- Don't invent numbers or quotes: social copy follows the same fact rules as the article (`monkeyproof-writing`).
- One call per approval. Don't retry a failed channel without checking whether it actually posted (look at the execution first).

## Workflow

1. **Read the post** in `src/data/blog/<slug>.md` and confirm it's live: `curl -sI https://monkeyproof.dev/posts/<slug>/` must return 200.
2. **Write the copy per channel** (see *Channels*). For LinkedIn, follow the `linkedin-skills:linkedin-repurposer` rules (hook before the fold, 900–1300 chars, link in the first comment, humanizer pass).
3. **Social image.** LinkedIn's API rejects WebP. Make a JPG of the mainImage and push it:
   ```sh
   mkdir -p public/social
   magick src/assets/images/<slug>.webp -strip -quality 85 public/social/<slug>.jpg
   ```
   Commit it (`chore(social): add <slug> social image`) and push. Use the raw GitHub URL, which works right after the push without waiting for a release:
   `https://raw.githubusercontent.com/davidemaggi/MonkeyProof/main/public/social/<slug>.jpg`
4. **Approval card.** Show Davide, per channel: the exact text, character count, image, first comment. Wait for the OK.
5. **Publish** (see *Calling the webhook*).
6. **Hand over the X copy** in a fenced block, ready to paste on x.com.
7. **Verify**: check the execution in n8n (MCP `get_execution`, or the Executions tab) and report what posted where, with links if the output has them. If a channel failed, say which and why; don't silently retry.

## Channels

| Channel | Key | Text limit | Image | Link |
| --- | --- | --- | --- | --- |
| LinkedIn | `linkedin` | ~3000 (aim 900–1300) | `imageUrl` (JPG/PNG), uploaded natively | In `firstComment`, never in the body |
| X | `x` | 280 (a URL counts as 23) | Not uploaded: X renders the post's Open Graph card from the URL | In the text |

X copy: one sharp hook line plus the URL. No threads (the workflow posts a single tweet), 0–1 hashtags.

**X is manual by default.** The X API has no free tier since February 2026 (pay-per-use: about $0.015 per post, $0.20 per post containing a URL, prepaid credits). Davide chose to post on X by hand: write the X copy, include it in the approval card, and hand it over ready to paste. Don't send `x` in `channels` unless Davide explicitly says X credits are loaded and asks to automate it. The X branch stays in the workflow, ready for that day.

## Calling the webhook

Secrets live in `.env` at the repo root (gitignored):

```sh file=.env
MONKEYPROOF_SOCIAL_WEBHOOK_URL=https://n8n.davidemaggi.dev/webhook/monkeyproof-social
MONKEYPROOF_SOCIAL_WEBHOOK_HEADER=X-MonkeyProof-Key
MONKEYPROOF_SOCIAL_WEBHOOK_SECRET=<value of the n8n "MonkeyProof Social Webhook" header credential>
```

Payload (omit a channel to skip it; every field marked `?` is optional):

```json file=payload.json
{
  "channels": ["linkedin"],
  "linkedin": {
    "text": "Post body",
    "imageUrl?": "https://raw.githubusercontent.com/davidemaggi/MonkeyProof/main/public/social/<slug>.jpg",
    "firstComment?": "Full article: https://monkeyproof.dev/posts/<slug>"
  },
  "x": { "text": "Hook line https://monkeyproof.dev/posts/<slug>" }
}
```

Write the approved texts to temp files and build the JSON with `jq` so quotes and newlines are escaped correctly (never hand-escape):

```sh
set -a; source .env; set +a
jq -n \
  --rawfile li /tmp/mp-social/linkedin.txt \
  --arg img "https://raw.githubusercontent.com/davidemaggi/MonkeyProof/main/public/social/<slug>.jpg" \
  --arg comment "Full article: https://monkeyproof.dev/posts/<slug>" \
  '{channels:["linkedin"],
    linkedin:{text:($li|rtrimstr("\n")), imageUrl:$img, firstComment:$comment}}' > /tmp/mp-social/payload.json

curl -sS -X POST "$MONKEYPROOF_SOCIAL_WEBHOOK_URL" \
  -H "$MONKEYPROOF_SOCIAL_WEBHOOK_HEADER: $MONKEYPROOF_SOCIAL_WEBHOOK_SECRET" \
  -H "Content-Type: application/json" \
  --data @/tmp/mp-social/payload.json
```

The webhook answers immediately ("Workflow was started"); the result is in the execution, so always do step 7.

If `.env` is missing, the n8n MCP `execute_workflow` (workflow `n5aQBb7qUK6Bgncy`, `type: "webhook"`, method POST, same body, header in `headers`) is the fallback.

## The n8n workflow

Nodes: `Social Post Request` (webhook, header auth) → `LinkedIn Requested?` → `Get LinkedIn Member` (`/v2/userinfo`, gives the member id used as author of the post and the comment) → `LinkedIn Has Image?` → `Download Post Image` → `LinkedIn Post With Image` / `LinkedIn Post Text Only` → `Has First Comment?` → `Add LinkedIn First Comment` (LinkedIn `socialActions/{urn}/comments` API); in parallel `X Requested?` → `Post on X`.

Credentials (set once in n8n): `MonkeyProof Social Webhook` (Header Auth), `LinkedIn account` (LinkedIn OAuth2, Organization Support off; used by both LinkedIn nodes and by the `Get LinkedIn Member` and `Add LinkedIn First Comment` HTTP nodes, which must be assigned by hand after any MCP update), `X` (X OAuth2). The workflow must be **published/active** for the production webhook URL to work.

### Adding a channel

1. Add a key to the payload (e.g. `bluesky: { text }`).
2. In n8n (MCP: `search_nodes` → `get_node_types` → edit code → `validate_workflow` → `update_workflow`), add a `<Channel> Requested?` IF branch off `Social Post Request`, checking `($json.body.channels || []).includes('<key>') && !!$json.body.<key>?.text`, then the channel's node reading from `$('Social Post Request').item.json.body.<key>`.
3. Update the sticky note in the workflow, the *Channels* table, and the payload example above.

## Known limits

- LinkedIn access tokens expire (about 60 days); if LinkedIn nodes fail with 401, reconnect the `LinkedIn` credential in n8n.
- X automation costs money (see *Channels*); the `X` credential in n8n is not configured.
- X images aren't uploaded (the X node's OAuth2 flow has no media upload); the OG card from the URL covers it.
