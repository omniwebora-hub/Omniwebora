import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = "Omniwebora: websites, mobile apps, ERP & CRM software, business automation and digital marketing";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Branded social card rendered at build time (no third-party or generated imagery). */
export default function OpenGraphImage() {
  const hx = 112.6;
  const hy = 65;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "linear-gradient(120deg, #faf8f3 0%, #f6eee2 45%, #e7eff7 100%)",
          padding: "72px 80px",
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "62%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 34, color: "#0c2349", fontFamily: "sans-serif", fontWeight: 700 }}>
            <svg width="44" height="44" viewBox="0 0 40 40">
              <g fill="none" stroke="#1f74e0" strokeWidth="4.4" strokeLinecap="round">
                <path d="M14.2 19.6a7.6 7.6 0 1 1 11.6 0" />
                <path d="M20 29.6a7.6 7.6 0 1 1-8.4-12.4" />
                <path d="M28.4 17.2A7.6 7.6 0 1 1 20 29.6" />
              </g>
            </svg>
            {site.name}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 92, lineHeight: 1, color: "#0c2349", letterSpacing: -3 }}>Ideas we bring</div>
            <div style={{ fontSize: 92, lineHeight: 1.05, color: "#83632e", letterSpacing: -3 }}>to life.</div>
          </div>
          <div style={{ fontSize: 28, color: "#4d5b70", fontFamily: "sans-serif", lineHeight: 1.4 }}>
            Websites · Mobile apps · ERP & CRM · Automation · Marketing
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "38%" }}>
          <svg width="360" height="420" viewBox="-180 -200 360 420">
            <ellipse cx="0" cy="190" rx="160" ry="26" fill="#ead8b8" />
            <polygon points={`0,-130 ${hx},${-hy} 0,0 ${-hx},${-hy}`} fill="#ffffff" />
            <polygon points={`${-hx},${-hy} 0,0 0,130 ${-hx},${hy}`} fill="#cfe0f6" />
            <polygon points={`0,0 ${hx},${-hy} ${hx},${hy} 0,130`} fill="#8fb3e6" />
            <polygon points={`0,-52 45,-26 45,26 0,52 -45,26 -45,-26`} fill="#0c2349" />
            <polygon points={`0,-130 ${hx},${-hy} ${hx},${hy} 0,130 ${-hx},${hy} ${-hx},${-hy}`} fill="none" stroke="#ffffff" strokeWidth="4" />
            <path d={`M${-hx} ${-hy} L0 -130 L${hx} ${-hy}`} fill="none" stroke="#c9a96e" strokeWidth="4" />
            <ellipse cx="0" cy="8" rx="175" ry="40" fill="none" stroke="#c9a96e" strokeWidth="2.5" transform="rotate(-11)" />
          </svg>
        </div>
      </div>
    ),
    size,
  );
}
