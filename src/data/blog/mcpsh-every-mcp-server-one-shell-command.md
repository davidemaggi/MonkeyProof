---
title: "Your Agent Already Has the Best MCP Client. It's Called a Shell."
description: "Why I built mcpsh, a single Go binary that turns the tools of any MCP server into plain CLI commands for Claude Code, Codex, GitHub Copilot and humans: progressive discovery, schema-generated flags, a warm-session daemon, and security defaults you can actually read."
pubDatetime: 2026-11-28T10:00:00Z
tags:
  - mcp
  - ai-assisted-development
  - claude-code
  - cli
  - security
featured: false
draft: false
mainImage: ../../assets/images/mcpsh-every-mcp-server-one-shell-command.webp
mainImageAlt: "A cartoon monkey at a retro terminal plugs a tangle of cables tagged github, postgres and browser into a single wall socket shaped like a $_ prompt, while three small robots cheer from behind the monitor."
mainImageCaption: Forty cables, one socket. The robots are thrilled.
mainImageCredit: MonkeyProof internal artwork
---

## TL;DR

[mcpsh](https://github.com/davidemaggi/mcpsh) is a single, dependency-free binary that turns the tools of any Model Context Protocol server into shell commands. Every coding agent already has a shell, so once mcpsh is configured, Claude Code, Codex, GitHub Copilot (and you) can use any MCP server without touching the agent's own MCP setup. Agents discover tools step by step instead of swallowing every schema up front, JSON Schema becomes real `--flags`, a background daemon keeps slow servers warm, and nothing runs that you didn't approve. I built it because I wanted MCP in places where it's often missing, and I wanted to see exactly what happens under the hood. Install it with `brew install --cask davidemaggi/tap/mcpsh`, `winget install DavideMaggi.mcpsh` or `npm install -g @davidemaggi/mcpsh`.

---

## Thirty Seconds of Demo Before Anything Else


```console
$ mcpsh add github --env GITHUB_PERSONAL_ACCESS_TOKEN='${GITHUB_TOKEN}' -- npx -y @modelcontextprotocol/server-github
$ mcpsh github
Tools of "github" (41):
  create_issue     Create a new issue in a GitHub repository
  list_issues      List issues in a GitHub repository with filtering options
  ...
$ mcpsh github create_issue --owner acme --repo api --title "Login is broken" --labels bug --labels p1
Created issue #482: https://github.com/acme/api/issues/482
```

That's an MCP server, added once, listed like a man page and called like `git`. Your agent can do the same thing with the one tool it never loses: the terminal. Bash, zsh, PowerShell, whatever it happens to get.

---

## Where This Came From

Here's the part that will sound familiar to anyone working in a large company right now.

We are asked to *lead the AI transformation*. Help clients adopt agents, show the team how it's done, be the people who know. Then the same organization hands you the cheapest AI plan on the price list (unless you manage to wedge a client project with a budget in between), and on top of that switches off half the toolbox. MCP servers are a classic casualty: disabled, restricted, or simply not supported by the agent you're allowed to use that week.

*Please fly us to the future. Here are your wings, we trimmed them a bit for compliance.*

<figure>
  <img
    src="/images/mcpsh-clipped-wings.webp"
    alt="A cartoon monkey in an aviator cap and goggles stands on a runway with neatly trimmed wings, while an owl manager in a suit waves a flag reading AI Transformation and hides giant scissors behind its back. A runway sign says MCP Disabled."
  />
  <figcaption>Fly us to the future. Economy class, no luggage, MCP not included.</figcaption>
</figure>

Fair enough, in part. An MCP server is code that runs on your machine with your credentials, and plenty of agents treat it as a black box: a config entry goes in, something gets spawned, tools appear. If I were the security team, I'd be nervous too.

My problem was the opposite of theirs, and also the same one. I wanted to work with MCP servers in environments where native support is missing or switched off, and I wanted to know *exactly* what was running, with which arguments, which secrets, and for how long. There's an Italian saying for this: *fidarsi è bene, non fidarsi è meglio*. Trusting is good, not trusting is better.

So the idea was simple: one small binary that speaks MCP to the servers and speaks plain shell to everything else. A shell command is the most auditable thing an agent can do. You can read it in the transcript, put it in an allowlist, deny it, log it, run it yourself.

A note before someone forwards this to their CISO: mcpsh is not a way around your company's rules. If your organization says "no external tools", a CLI doesn't make that okay, so ask first. What mcpsh gives you is a version of MCP that's easier to *say yes to*, because every moving part is visible.

---

## The MCP Tax

MCP itself is great. A standard way for models to call tools is exactly what this ecosystem needed. The pain is in the wiring:

- **Every agent has its own config.** Claude Code, Codex and Copilot each want the same server described in their own file, in their own place. Same server, three configs, three chances to paste a token where it shouldn't be.
- **Tool catalogues eat the context window.** Most MCP clients load every tool definition into the model's context before the conversation starts. Anthropic's engineering team [wrote about this](https://www.anthropic.com/engineering/code-execution-with-mcp) in November 2025: with many connected tools, the agent can chew through hundreds of thousands of tokens of definitions before it even reads your request. Some agents now load tools lazily, which helps, but only in those agents.
- **Slow servers start again and again.** An `npx` server that takes a few seconds to boot is fine once. It's less fine on every call.

None of this is a bug in the protocol. It's friction at the edges, and friction is where people give up and go back to copy-pasting curl commands.

---

## The Shell Was There All Along

Every coding agent worth its tokens can run commands in a terminal, whatever shell sits behind it. It's the lowest common denominator, the USB-A of agent tooling: not glamorous, plugs into everything.

mcpsh leans on that. Instead of loading every schema up front, the agent discovers tools progressively, the way a human would:

```sh
mcpsh list                                   # which servers exist, and their status
mcpsh fs                                     # the tools of one server, one line each
mcpsh fs read_text_file --help               # parameters of one tool
mcpsh fs read_text_file --path README.md     # call it
```

It only pays for what it reads. Forty-one GitHub tools cost one short line each, and only when the agent asks. The full schema of `create_issue` appears only when it's about to create an issue.

Tool lists are cached on disk (24 hours by default), so `--help` is instant and never starts a server. `mcpsh refresh` updates the cache when you need it.

---

## JSON Schema In, Real Flags Out

Every MCP tool describes its input with a JSON Schema. mcpsh turns that schema into proper CLI flags: strings, numbers, booleans, enums, repeatable arrays, defaults and required parameters. Arguments are validated *before* the call, so a typo fails fast with a useful message instead of reaching the server as garbage.

```sh
mcpsh github create_issue --help        # flags generated from the schema
mcpsh github list-issues --owner acme --repo api --per-page 5  # kebab-case works for tools and flags
mcpsh fs write_file --json @args.json   # nested input? pass JSON (inline, @file or -)
mcpsh fs list_directory --path . -o json  # full MCP result for machines
```

The output follows the boring rules that make CLIs composable, and boring is the goal here: text on stdout, errors on stderr, binary content saved to a file with the path printed. Exit codes are documented so an agent can tell "I typed it wrong" from "the server is down":

| Code | Meaning |
| --- | --- |
| `0` | Success |
| `1` | The tool reported an error, or the server rejected the call |
| `2` | Usage, validation, configuration or trust error: fix the command |
| `3` | Connection, transport, timeout or daemon error: the server is unreachable |

An agent that gets `2` should reread `--help`. An agent that gets `3` should stop retrying and tell you. Neither of them should loop forty times, which is my favorite agent hobby to discourage.

---

## A Daemon That Keeps Servers Warm (and Cleans Up After Itself)

The first call to a slow `npx` server pays the startup cost. The second shouldn't. mcpsh runs a per-user background daemon that keeps one session per server, multiplexes concurrent calls over it, stops idle servers, restarts crashed ones with backoff, and exits on its own when nobody needs it. It starts by itself; you never have to think about it.

The CLI talks to it over a Unix socket in a `0700` directory, or a named pipe whose ACL admits only you. The CLI resolves your config and secrets with *its own* environment, so the daemon never guesses.

The part I'm unreasonably proud of is the process cleanup. MCP servers love to spawn children: `npx` starts Node, Node starts something else, and on Windows there's a `.cmd` shim in the middle for good measure. mcpsh starts every stdio server in its own process tree (a job object on Windows, a process group on Unix) and kills the whole tree when it closes. No orphans, and no mysterious `node.exe` still running at 11 p.m. from a session you closed after lunch.

<figure>
  <img
    src="/images/mcpsh-architecture.webp"
    alt="Hand-drawn diagram on parchment titled mcpsh: Agent, Terminal and mcpsh CLI in a row, the CLI reading a Tool Cache and talking to a Daemon, which connects to Local Servers and Remote Servers."
  />
  <figcaption>One shell command in, one warm session out.</figcaption>
</figure>

For CI or debugging, `--no-daemon` runs everything in-process with identical output and exit codes. The end-to-end test suite runs every scenario against both modes, so "works with the daemon" and "works without it" mean the same thing.

---

## Paranoid by Default

This is where *non fidarsi è meglio* turns into code.

**Secrets stay in environment variables.** Config values support `${VAR}` and `${VAR:-default}`. A missing variable is a clear error, never an empty token silently sent to a server. `mcpsh add --scope project` refuses clear-text values for anything that looks like a secret (`*TOKEN*`, `*KEY*`, `Authorization`, and friends), and the daemon log redacts them.

**Project servers need your approval.** A repository can ship a `.mcpsh.json`, which is handy for teams and terrifying for everyone else: clone a repo, run an agent, and suddenly a stranger's command runs on your laptop. mcpsh won't start a project server until you run `mcpsh trust`, which shows you what it wants to run and records your approval *for that exact definition*. Change one argument and it asks again.

**Destructive tools need consent.** Tools annotated `destructiveHint: true`, or matched by your own `confirmTools` globs, prompt on a terminal and require `--yes` everywhere else. The skill that ships with mcpsh tells the agent to pass `--yes` only after you agreed to that exact action. You can also hide tools entirely:

```jsonc file=.mcpsh.json
{
  "mcpServers": {
    "github": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/",
      "headers": { "Authorization": "Bearer ${GITHUB_TOKEN}" },
      "allowTools": ["*issue*", "get_*"],
      "denyTools": ["delete_*"]
    }
  }
}
```

**OAuth never opens a browser behind your back.** Remote servers that need OAuth get `mcpsh auth login <server>` once (PKCE, dynamic client registration, refresh tokens). After that, a call that needs a login fails with exit code `2` and tells you what to run, so an agent can't get stuck staring at a login page it can't click.

The config format is the same `mcpServers` shape used by Claude Desktop and `.mcp.json`, so `mcpsh import .mcp.json` brings over what you already have.

---

## Teaching Your Agent in One Command

A CLI is useless to an agent that doesn't know it exists. mcpsh ships two [Agent Skills](https://agentskills.io):

```sh
mcpsh skill install                  # Claude Code, Codex and Copilot, for your user
mcpsh skill install --scope project  # or commit them with the repository
```

If you'd rather use the [skills CLI](https://github.com/vercel-labs/skills), you don't even need mcpsh installed first: the skill offers to install it when it's missing.

```sh
# interactive: pick the skills and the agents
npx skills add davidemaggi/mcpsh

# see what's in the repo without installing anything
npx skills add davidemaggi/mcpsh --list

# both skills, for your user, in Claude Code, Codex and Copilot
npx skills add davidemaggi/mcpsh --skill '*' -g -a claude-code -a codex -a github-copilot

# only the usage skill, into the current project, no prompts
npx skills add davidemaggi/mcpsh --skill mcpsh -a claude-code -y
```

The `mcpsh` skill teaches the discovery workflow and the rules (read the errors, never echo secrets, no `--yes` without consent). The `mcpsh-setup` skill configures servers for you: give your agent an npm or PyPI package, a Docker image, a URL, a README or a `.mcp.json` snippet and say *"set this up with mcpsh"*. It picks the transport, keeps secrets in `${VAR}` references, chooses the scope and checks the connection.

For agents without skills, `mcpsh agents-md >> AGENTS.md` prints plain instructions. And `mcpsh skill generate <server>` writes a skill for one specific server, so the agent knows *when* to reach for it and not only how.

---

## Honest Trade-offs

mcpsh isn't the right answer everywhere, and pretending otherwise would be very un-MonkeyProof.

- **If your agent's native MCP support works for you, keep it.** Especially if it already loads tools lazily. mcpsh shines when native support is missing, restricted, duplicated across tools, or when you want one config for everything.
- **There's an extra hop.** Agent → shell → mcpsh → daemon → server. The daemon makes it fast in practice, but it's still more moving parts than a direct connection.
- **Results go through stdout.** Large results still land in the agent's context if it reads them. `--output json` plus `jq` helps, but it's not the full "write code that filters results" approach Anthropic describes in the post linked above.
- **macOS builds aren't notarized yet.** Homebrew and the install script handle the quarantine attribute for you; a manual download needs one `xattr` command. Windows builds are Authenticode-signed.
- **It's young.** v0.1.3 at the time of writing. Expect rough edges and please report them.

---

## What Building It Taught Me

I wrote the design and the plan, and built it in phases with AI coding agents doing a good share of the typing, one phase per PR, CI green on Linux, macOS and Windows before moving on. A few lessons, in no particular order:

Windows process management is a genre of horror. Job objects, `.cmd` shims that need `cmd.exe` with correct escaping, servers started suspended so they can't escape before the job object catches them. Most of the "no orphans" work happened there.

Distribution is half the project. GoReleaser for six targets, checksums and build attestations, a Homebrew cask, a Scoop bucket, an npm launcher with per-platform packages, winget, Windows code signing on a separate runner that never checks out code. The four releases from v0.1.0 to v0.1.3 all went out on the same day, which tells you everything about how the first publish of a multi-channel release pipeline goes.

Agents need explicit guardrails too. At one point, working on a different PC than my usual one, Claude Code's auto mode denied some `go install` commands. Correct call: those moved to CI, and the handoff notes now say "don't work around such denials". The tool I was building is about control, so it would have been a bit rich to argue with the agent about it.

Boring interfaces win. stdout, stderr, exit codes, `--help`. Half a century of Unix conventions turned out to be a pretty good API for language models.

---

## Try It

```sh
brew install --cask davidemaggi/tap/mcpsh   # macOS
winget install DavideMaggi.mcpsh            # Windows
npm install -g @davidemaggi/mcpsh           # anywhere with Node.js

mcpsh add fs -- npx -y @modelcontextprotocol/server-filesystem .
mcpsh fs
mcpsh skill install
```

The repo is at [github.com/davidemaggi/mcpsh](https://github.com/davidemaggi/mcpsh), MIT licensed. If it saves you a config file or an argument with your security team, a star helps other people find it, and issues help me find the bugs. I'm curious which servers you end up wiring through it, and which one breaks first.

---

## Further Reading

- [Model Context Protocol](https://modelcontextprotocol.io): the spec and the ecosystem.
- [Code execution with MCP: Building more efficient agents](https://www.anthropic.com/engineering/code-execution-with-mcp): Anthropic on context costs of tool definitions and intermediate results.
- [MCP Go SDK](https://github.com/modelcontextprotocol/go-sdk): the official SDK mcpsh is built on.
- [Agent Skills](https://agentskills.io): the skill format used for Claude Code, Codex and Copilot.

## Practical Next Steps

- Run `mcpsh import .mcp.json` on a project you already use with an agent and compare the context usage with and without native MCP.
- Add `allowTools` / `denyTools` to your noisiest server and see how much smaller `mcpsh <server>` gets.
- Put a `.mcpsh.json` in a team repo and try the `mcpsh trust` flow from a fresh clone.
