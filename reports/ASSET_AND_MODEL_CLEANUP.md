# Asset and model cleanup

Method: inventory → reference search (`grep` across `src`, `tests`, `qa`, `docs`) → remove only project-local, unused items → re-run typecheck, lint, unit, e2e and build. Nothing was uninstalled globally; no secrets were deleted. Byte-level list of every removed file: `reports/removed_inventory.txt`. Git has no commits, so the inventory is the record of what existed.

## Removed
| Item | Why |
|---|---|
| `src/components/3d/*` (16 files: Engine, Scene, Atrium, Plinth, Strands, Effects, shaders…) and `hero/HeroStage.tsx`, `HeroFallback.*`, `PanelVignette.tsx`, `lib/heroStore.ts`, `lib/quality.ts` | The failed procedural R3F hero (reference 01). Replaced by the Higgsfield plate + HTML layers. |
| npm deps `three`, `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`, `postprocessing`, `@types/three` | Only used by the removed engine. `npm uninstall` (project-local). |
| `.mcp.json` (only entry: MuAPI), `scripts/launch-claude-with-muapi.ps1`, `MUAPI_KEY` line in `.env.example` | Owner: Higgsfield is the only generation provider. |
| `qa/interact.mjs`, `qa/probe.mjs`, `qa/states.mjs`; old `qa/lighthouse/*` and `qa/screenshots/*` | Depended on removed engine test hooks / measured the failed build. |
| `docs/design-direction.md`, `docs/interaction-storyboard.md`, `docs/asset-manifest.md`, `docs/qa-report.md` | Described the removed engine; superseded by `design/*`, `assets/ASSET_MANIFEST.md`, `reports/*`. |
| `src/app/services/**`, `src/app/process/page.tsx` | Replaced by `/solutions/*` and `/approach`; 308 redirects in `next.config.ts`. |
| `components/forms/InquiryForm.*`, `app/contact/ContactForm.tsx`, `sections/HomeSections.*`, `ProcessThread.*`, `WorkConcepts.*`, `ServiceWorlds.*`, `illustrations/{ServiceArt,ConceptArt}.tsx`, `previews/PreviewFrame.*`, `content/{services,process,work}.ts` | Replaced by the governance rebuild (brief studio, home chapters, seven-stage explorer, Concept Lab, solution content). |

## Moved / archived (not deleted)
- `MASTER_IMPLEMENTATION_PROMPT.md` → `docs/handoff/archive/MASTER_IMPLEMENTATION_PROMPT_v1.md`
- `README_FIRST.md` (MuAPI kit instructions) → `docs/handoff/archive/README_FIRST_v1_muapi_kit.md`

## Kept deliberately
- `reference/*` (all target, failed and brochure files), `public/brand/omniwebora-mark.svg` (owner: keep logo), Higgsfield raw media (gitignored), the inquiry API/transport/rate limiter, SEO/OG code, `.claude/skills/*`, `.claude/launch.json`.
- **Secrets not touched:** a plaintext MuAPI key remains in `.claude/settings.local.json` (`env.MUAPI_KEY`) and `.env.local` (`MUAPI_KEY`). Both files are gitignored. **Owner action: revoke/rotate that key in MuAPI and delete those two lines.**

## Verification after cleanup
`npm run build` ✓ · `tsc` ✓ · `eslint` ✓ · Vitest 33/33 ✓ · Playwright 72 passed / 8 device-specific skips ✓. Runtime dependencies now: `gsap`, `next`, `react`, `react-dom`, `zod`.
