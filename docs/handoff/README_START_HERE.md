# Omniwebora — Higgsfield Website Rescue Handoff

## Folder contents
- `MASTER_CLAUDE_CODE_PROMPT.md` — full implementation brief to pass to Claude Code.
- `reference/01_CURRENT_FAILED_RESULT.jpg` — result to REPLACE; use only for visual gap analysis.
- `reference/02_INTENDED_TARGET.png` — exact client target visual direction.

## How to use
1. Extract this ZIP into your actual website repo, or copy the two reference images and the master prompt into it while maintaining their relative paths.
2. Authenticate/connect Higgsfield in Claude Code yourself, as planned. Verify its tools are visible; do not put credentials in repo files.
3. Start Claude Code in the repository and paste:

   Read `MASTER_CLAUDE_CODE_PROMPT.md` completely. Inspect both reference images and the current website. Higgsfield is my approved asset generation provider; use my connected Higgsfield tools/skills and do not use MuAPI. Follow the exact phased rebuild, begin by fixing the hero to match the target, then implement the cinematic scroll journey and site quality checks. Preserve useful code, audit old generation dependencies before removing only those that are safe and unused, run the app, and provide real screenshots/tests. Execute the project end to end.

4. If images cannot be read from their paths, explicitly attach them to Claude Code or put them in the repo; don't rely on screenshots being accessible from this chat automatically.

## Higgsfield specifics
Official docs recommend the Higgsfield CLI + companion skills for Claude Code (`npm i -g @higgsfield/cli`, `higgsfield auth login`, `npx skills add higgsfield-ai/skills`) rather than assuming the Claude web connector is already available in Claude Code. If you've already connected it, don't duplicate installations. MCP/CLI generations use paid credits; ask for cost visibility before large batches. Official documentation: https://higgsfield.ai/creator-hub/help-center/integrations/how-do-i-connect-higgsfield-to-ai-agent
