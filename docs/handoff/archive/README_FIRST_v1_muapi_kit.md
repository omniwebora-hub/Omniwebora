# Omniwebora Claude Code handoff kit

## What's included
- `MASTER_IMPLEMENTATION_PROMPT.md`: comprehensive build directive for Claude Code.
- `reference/omniwebora-visual-reference.png`: user-supplied visual; inspiration ONLY, not the live hero background.
- `.mcp.json`: hosted MuAPI MCP, with environment-variable substitution `${MUAPI_KEY}`; no actual secret included.
- `.claude/skills/immersive-3d-web/SKILL.md`: custom project-specific cinematic Three.js / performance / SEO skill.
- `CLAUDE.md`: auto-read project instructions for Claude Code.
- `docs/CLIENT_CONFIRMATION.md`: facts and assets to obtain before production launch.
- `scripts/launch-claude-with-muapi.ps1`: optional Windows PowerShell launcher that requests a fresh key privately for the current process.

## 1 — Security first
The key originally pasted into chat should be considered exposed. Revoke/rotate it via MuAPI's official dashboard and use a NEW key. The secret must never appear in a prompt, source file, screenshot, Git commit, public issue or shared project configuration.

## 2 — Start in a fresh project directory
Unzip this package INTO the Omniwebora project directory, ensuring hidden dotfiles and `.claude/` are extracted. If this project already contains `.mcp.json` or `CLAUDE.md`, merge rather than overwrite their existing contents. Avoid accidentally tracking secrets. Verify Claude Code is installed (`claude --version`).

## 3 — Skills (optional extra sources)
Read third-party skills before trusting/installing them. Anthropic's official frontend-design skill:

```sh
npx skills add anthropics/skills --skill frontend-design -a claude-code
```

Independent community Three.js skills:

```sh
npx skills add cesartevisual/threejs-skills --skill threejs-r3f --agent claude-code
npx skills add cesartevisual/threejs-skills --skill threejs-performance --agent claude-code
npx skills add cesartevisual/threejs-skills --skill threejs-interaction --agent claude-code
```

Check installer help first if arguments have changed. The custom `immersive-3d-web` skill already exists locally in this kit.

## 4 — MuAPI MCP connection (Windows PowerShell)
From this project root, start with:

```powershell
.\scripts\launch-claude-with-muapi.ps1
```

Enter the NEW MuAPI key when prompted (not the compromised one). Inside Claude run `/mcp` and verify `muapi` reports connected; then request MuAPI model discovery. This launcher sets the variable only for the Claude process, so the secret is NOT saved into `.mcp.json`.

Alternative manual method for Bash/macOS/Linux: `read -srp 'New MuAPI API key: ' MUAPI_KEY; echo; export MUAPI_KEY; claude` (from this project directory). Use a shell/session-scoped environment variable instead of saving it in source control.

If `.mcp.json` has other MCP integrations, preserve and merge entries. Never publish an actual API key in project scope. The server URL and variable substitution follow Claude Code MCP documentation; connectivity needs to be tested on YOUR machine.

## 5 — Give Claude this initial command

```text
Read @MASTER_IMPLEMENTATION_PROMPT.md, @reference/omniwebora-visual-reference.png, @CLAUDE.md, and @.claude/skills/immersive-3d-web/SKILL.md. You own end-to-end design, coding, visual validation and QA. Confirm MuAPI is connected if available, inspect this repository, install/check verified frontend and 3D skills if useful, then IMPLEMENT the site, launch it locally, test it and summarize results. Do not end with a plan. Be accurate about unverified client facts and all tool/test statuses.
```

If your terminal's `@` file syntax doesn't attach the image, ask Claude to inspect the exact relative file path. The site should be built even if MuAPI or other paid tools are unavailable.

## 6 — Production reminders
No provider key or SMTP credentials are provided. A real contact/lead provider must be configured before publishing a working enquiry form. Real client cases, figures, testimonials, official domain, logo source and legal privacy text must be approved first. Never publish invented metrics or fake success events.
