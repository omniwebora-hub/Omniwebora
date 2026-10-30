# Asset manifest

All generated media came from **Higgsfield** (claude.ai MCP connector) during authoring. The website never calls Higgsfield at runtime; it serves the optimised local files in `public/assets/cinematic/`. Raw downloads live in `assets/higgsfield/raw/` (gitignored, re-downloadable from the job IDs below). Pipeline: `scripts/cinematic/build_assets.py` (Pillow + ffmpeg via `FFMPEG` env). Credits: 600 at start → 555 now (≈ 45 spent; failed jobs were refunded).

Reference upload: `reference/02_INTENDED_TARGET.png` → Higgsfield media `97522e60-52fe-4929-b094-c6db5bf7111c` (style/composition reference only; never used as a page background).

| ID | Purpose / slot | Model | Job ID | Status | Prompt summary | Local outputs | Notes |
|---|---|---|---|---|---|---|---|
| H00 | Home hero plate (LCP image) | GPT Image 2.5, 4K, high | `a4c1fd66-3fbd-4f9c-a919-c51ccb7a6bab` | **Accepted** | Same composition as target, all UI removed; ivory marble atrium, golden hour, layered glass cube with empty sapphire core face, thin gold ring, dark-marble/brass pedestal, calm left 45% | `h00-hero-{1280,1920,2560}.webp` (100/195/285 KB), `h00-hero-portrait-{720,1100}.webp` (81/151 KB) | Logo on the core is real SVG, overlaid in HTML |
| H00-nb | Alternative keyframe | Nano Banana 2.1, 4K ×2 | `5487b545-…`, `981634a7-…` | Failed (provider), refunded | Clean-plate edit of target | none | — |
| H01 | Scroll push-in (home film) | MiniMax H3, 2K, 6.6 s | `2608f30c-c7cb-49d0-803a-fe1fb193a555` | **Accepted** | Start frame = H00; slow stabilised dolly-in toward the cube; rigid geometry; no new objects/text | 56 frames × 2 sizes: `h01/lg` (1440×810, 4.4 MB total), `h01/md` (960×540, 2.7 MB); `h01-end-2560.webp` (200 KB); `src/content/cinematic.generated.ts` (per-frame cube track) | Frame 0 matches H00 within ~4/255 per channel; staged loading (8 coarse frames after load, rest on first scroll), desktop only |
| H01-k | Alternative push-in | Kling 3.0 pro, 5 s | `877879d3-862c-4ee9-b4a9-1e734aa00b5f` | Rejected | Same brief | none | Outer glass shell drifted off-register from the core |
| H00-loop | Idle ambient loop | Kling 3.0 pro, start=end frame | `b224cf86-ccd9-4f6b-92e7-627a3a17815e` | Rejected | Locked-off camera, subtle motion | none | Camera panned ~20% of frame despite prompt |
| R01 | Closing pull-back (home H10); preview backdrops | GPT Image 2.5, 4K | `0a40cbcc-643a-43a1-9bc4-972d5b166eb9` | **Accepted** | Same atrium/sculpture from further back, symmetric arch, open sky for a headline | `r01-pullback-{1280,2400}.webp` (108/298 KB) | Also used (cropped) as backdrop in preview frames |
| D01 | Colonnade detail (no sculpture) | GPT Image 2.5, 4K 21:9 | `e0b0bcfa-0896-4389-97e6-95c52c8616bc` | **Accepted** | Same world, calm left half | `d01-colonnade-{1280,2400}.webp` (72/202 KB) | Used on /work header and the responsive-browser stage only |
| A01 | About artefact desk | GPT Image 2.5, 2K | `6a9896a2-232b-461e-bbea-21d13dcd67b9` | **Accepted** | Same building/light; empty honed ivory worktable, brass lamp, notebook; no text | `a01-studio-table-{1280,2400}.webp` (66/156 KB) | HTML artefacts sit on the table; also used in stage/desk backgrounds |
| S00 | Solutions film: gallery entrance (intro hold) | GPT Image 2.5, 4K, high | `859bf820-fd59-4561-a40c-ecc1629279c5` | **Accepted** | Same world (refs H00 + D01); long colonnade, alcoves on the right, calm left third | `s00-gallery-{1280,1920,2560}.webp` (94/195/300 KB) | Desktop intro hold and mobile intro plate |
| S01 | Solutions film: websites alcove, blank frontal display | GPT Image 2.5, 4K, high | `f833c74e-0c4e-4aa8-970d-fe88936e342e` | **Accepted** | Frontal lit alcove, one blank white display | `s01-web-{1280,1920,2560}.webp` | Mobile plate; display rect measured by `build_film.py` |
| S02 | Solutions film: operations room, wide display + desk | GPT Image 2.5, 4K, high | `b5b19f23-21ff-40ec-ba26-fa394f9aa5e5` | **Accepted** | Same light; wide blank wall display, stone desk, two chairs, sea view | `s02-ops-{1280,1920,2560}.webp` | Mobile plate |
| S10 | Clip: gallery → websites alcove | MiniMax H3, 6.6 s, 2560×1440, start S00 / end S01 | `07ff7d6c-beb8-4e17-a6d9-9a7233f650a6` | **Accepted** | Glide down the colonnade, turn right into the alcove | `sol-enter/{lg,md}` 64 frames (3.2 / 1.8 MB), `sol-enter-{start,end}-2560.webp`, `sol-enter-end-1280.webp` | End frame is the web hold still; display rect `[0.3, 0.2278, 0.399, 0.3389]` |
| S11 | Clip: websites alcove → operations room | MiniMax H3, 6.6 s, 2560×1440, start S01 / end S02 | `6ac40da5-f79e-4e2e-ac28-1cbc4b2380c6` | **Accepted** | Lateral truck with a pillar wipe | `sol-web-ops/{lg,md}` 64 frames (3.1 / 1.7 MB), start/end stills | First frame within 2.3/255 of S01, last within 3.8/255 of S02; display rect `[0.3135, 0.2111, 0.3698, 0.2852]` |

Every interface shown on the site (browser, phones, dashboards, workflows, topology, layers, demos) is HTML/CSS, not generated imagery. Fallbacks: every image has explicit dimensions or a CSS box; the film falls back to the H00 still (reduced motion, mobile, Save-Data, or frames not yet loaded).

### Reuse, 2026-10-30
- **L01** (`362a692d`, GPT Image 2.5, top-down glass table with two tablets and a laptop) was generated for the Concept Lab, which the owner removed. It now carries **How We Work** ("the planning table"): `l01-lab-{1280,1920,2560}.webp`, screen rects in `film.generated.ts` → `l01-lab.screens`. No new credits used this session (balance 246.25).

### Home "Ideas we bring to life" and footer, 2026-10-30 (Higgsfield CLI)
| ID | Asset | Model | Job | Status | Output |
|---|---|---|---|---|---|
| K1 | The building as a luminous drawing on the terrace, blue hour (S08 framing) | GPT Image 2.5, 4K, high | `2698d122` | Accepted | `k1-draw-{1280,1920,2560}.webp` (Home LCP) |
| K2 | Full-size ivory study model, early morning | GPT Image 2.5, 4K, high | `6a463400` | Accepted | source for HB/HC |
| K3 | Finished building, daylight, lights off | GPT Image 2.5, 4K, high | `a1bd69bd` | Accepted | source for HC/HD |
| HB | Clip: drawing → model (locked camera) | MiniMax H3, 6 s, start K1 / end K2 | `e1b7c1de` | Accepted | `home-design/` |
| HC | Clip: model → built | MiniMax H3, 6 s, start K2 / end K3 | `6515b376` | Accepted | `home-build/` |
| HD | Clip: built → lit at golden hour | MiniMax H3, 6 s, start K3 / end S08 | `6d65a085` | Accepted | `home-launch/` |
| H11r | H11 reversed (terrace → product wall) | ffmpeg `reverse`, no credits | n/a | Accepted | `home-enter/` |
| F01 | Footer: the building at night, seamless loop | MiniMax H3, 6 s, start = end S08n | `c4514758` | Accepted | `footer-night.mp4` (1.1 MB) |
Credits: 246.25 → 185.5 (3 × 4.25 + 4 × 12 = 60.75). Retired: the crystal hero (H00/H01 frames remain in `public/` unused; R01 pull-back unused).
| L02 | Eye-level view along the planning table in the studio (L01 + A01 refs) | GPT Image 2.5, 4K, high | `e0634d8f` | Accepted | `l02-table-eye-*.webp` (How We Work opening) |
| L10 | Clip: eye level → crane up to top-down over the table | MiniMax H3, 6 s, start L02 / end L01 | `ba0912b1` | Accepted | `plan-arrive/` |
Credits after this pass: 185.5 → 169.25 (4.25 + 12).
