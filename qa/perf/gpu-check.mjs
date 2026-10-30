import { chromium } from "@playwright/test";
for (const args of [[], ["--use-angle=d3d11", "--enable-gpu", "--ignore-gpu-blocklist", "--enable-gpu-rasterization"]]) {
  for (const headless of [true, false]) {
    const b = await chromium.launch({ headless, args });
    const p = await b.newPage();
    await p.goto("about:blank");
    const r = await p.evaluate(async () => {
      const c = document.createElement("canvas");
      const gl = c.getContext("webgl");
      const ext = gl && gl.getExtension("WEBGL_debug_renderer_info");
      const ts = [];
      await new Promise((res) => { let n = 0; const f = (t) => { ts.push(t); if (++n < 61) requestAnimationFrame(f); else res(); }; requestAnimationFrame(f); });
      const d = ts.slice(1).map((t, i) => t - ts[i]);
      return { renderer: ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : "none", rafMs: +(d.reduce((a, b) => a + b, 0) / d.length).toFixed(2) };
    });
    console.log(JSON.stringify({ headless, args: args.length ? "gpu-flags" : "default", ...r }));
    await b.close();
  }
}
