# Experience system (Gate 2)

## Visual grammar (shared)
- **Material and colour:** ivory stone (`--porcelain #faf8f3`, `--stone`), deep navy (`--ink #0c2349`), sapphire (`--cobalt #1467c5`), champagne gold used as fine edges and rules only (`--gold #b59258`, text gold `#6a4f22`–`#83632e` for contrast).
- **Type:** Newsreader display cut (self-hosted static opsz 72 / 500, 24 KB) for ideas; Hanken Grotesk for explanation and UI.
- **Object language (one meaning per object):** browser viewport = website; phone = mobile journey; module console = software; directed flow = automation; rails between named systems = integrations; stacked layers = enterprise; paper artefacts = method (About/Approach); scope desk = pricing; brief summary card = contact.
- **Photography:** the Higgsfield atrium world appears in three places only: home hero/film, home closing pull-back, and one documentary still on About. Interior routes no longer reuse the colonnade as a hero background.
- **Motion:** one dominant interaction per route plus one secondary; everything else is calm editorial layout. Transitions are short (≤ 600 ms) state changes; scroll-scrubbed motion is reserved for the home film and closing pull-back. Every interactive state is reachable by keyboard and reversible; `prefers-reduced-motion` removes transforms but keeps all states.
- **Truth labels:** any interface at readable size carries "Illustrative" wording; Concept Lab demos carry "Illustrative demonstration · Not client work".

## Performance budget
- No WebGL anywhere (the brief allows R3F "only if a 3D object must be truly interactive"; none of the route objects needs it, and DOM/SVG keeps them accessible and crawlable).
- Interior routes: no video; one optimised still at most; ≤ 60 KB route JS beyond the shared framework.
- Home film frames load in stages (coarse after load, full on first scroll, desktop only).

## Rejected ideas (and why)
- 3D phone in WebGL on Mobile Apps: a CSS-perspective phone gives the same reading with real, accessible DOM screens and no 600 KB engine.
- Generated imagery of dashboards or devices: generated UI text is illegible; real HTML interfaces are used instead.
- Animated pricing carousel: pricing stays a readable table with a track selector.
