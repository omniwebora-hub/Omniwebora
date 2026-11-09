/**
 * Map a flat rectangle onto a screen seen in perspective in a still: four corners in, CSS matrix3d out.
 * Corners are plate fractions (TL, TR, BR, BL), measured with scripts/cinematic/measure_screens.py.
 */
export type Quad = readonly [readonly [number, number], readonly [number, number], readonly [number, number], readonly [number, number]];

/** Solve A x = b (8×8) by Gaussian elimination with partial pivoting. */
function solve(a: number[][], b: number[]) {
  const n = b.length;
  const m = a.map((row, i) => [...row, b[i]]);
  for (let c = 0; c < n; c++) {
    let p = c;
    for (let r = c + 1; r < n; r++) if (Math.abs(m[r][c]) > Math.abs(m[p][c])) p = r;
    [m[c], m[p]] = [m[p], m[c]];
    for (let r = 0; r < n; r++) {
      if (r === c) continue;
      const f = m[r][c] / m[c][c];
      for (let k = c; k <= n; k++) m[r][k] -= f * m[c][k];
    }
  }
  return m.map((row, i) => row[n] / row[i]);
}

/**
 * The transform (origin 0 0) that takes a w × h element at the top-left of a refW × refH box onto the
 * quad (plate fractions of that box).
 */
export function quadMatrix(w: number, h: number, quad: Quad, refW: number, refH: number) {
  const src = [
    [0, 0],
    [w, 0],
    [w, h],
    [0, h],
  ];
  const dst = quad.map(([x, y]) => [x * refW, y * refH]);
  const a: number[][] = [];
  const b: number[] = [];
  for (let i = 0; i < 4; i++) {
    const [x, y] = src[i];
    const [u, v] = dst[i];
    a.push([x, y, 1, 0, 0, 0, -u * x, -u * y]);
    b.push(u);
    a.push([0, 0, 0, x, y, 1, -v * x, -v * y]);
    b.push(v);
  }
  const [h0, h1, h2, h3, h4, h5, h6, h7] = solve(a, b);
  // column-major 4×4 from the 3×3 homography
  const m = [h0, h3, 0, h6, h1, h4, 0, h7, 0, 0, 1, 0, h2, h5, 0, 1];
  return `matrix3d(${m.map((v) => +v.toFixed(8)).join(", ")})`;
}
