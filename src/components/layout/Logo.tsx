import Link from "next/link";
import styles from "./Logo.module.css";

/**
 * The Omniwebora mark (owner's logo, 2026-11-04: an eye whose iris is the globe, "Omni" in navy and
 * "Webora" in gold, "Vision for a connected world"), redrawn as vector in the site's palette: a navy
 * and cobalt upper lid, a brass lower lid, and a deep-blue globe ringed in gold, its meridians in light.
 * Drawn on a 64 x 40 grid so it stays crisp from the header down to a favicon.
 */
export function LogoMark({ size = 34, idSuffix = "a", className }: { size?: number; idSuffix?: string; className?: string }) {
  const id = (n: string) => `omni-${n}-${idSuffix}`;
  return (
    <svg className={className} width={(size * 64) / 40} height={size} viewBox="0 0 64 40" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={id("lid")} x1="2" y1="20" x2="62" y2="8" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#5a4fd6" />
          <stop offset="0.45" stopColor="#2f6fe0" />
          <stop offset="1" stopColor="#123b8c" />
        </linearGradient>
        <linearGradient id={id("brass")} x1="2" y1="30" x2="62" y2="24" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#a8762c" />
          <stop offset="0.55" stopColor="#e3bd73" />
          <stop offset="1" stopColor="#b8873a" />
        </linearGradient>
        <radialGradient id={id("globe")} cx="28.5" cy="16" r="13" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#3f8cf2" />
          <stop offset="0.55" stopColor="#1b4fb4" />
          <stop offset="1" stopColor="#0a1d4e" />
        </radialGradient>
        <clipPath id={id("clip")}>
          <circle cx="32" cy="20" r="10.4" />
        </clipPath>
      </defs>
      {/* the lids: tapered ribbons meeting in sharp corners */}
      <path d="M1 20C12 1.2 52 1.2 63 20 51 9.6 13 9.6 1 20Z" fill={`url(#${id("lid")})`} />
      <path d="M1 20C12 38.8 52 38.8 63 20 51 30.4 13 30.4 1 20Z" fill={`url(#${id("brass")})`} />
      {/* the iris: the globe */}
      <circle cx="32" cy="20" r="11.8" fill={`url(#${id("brass")})`} />
      <circle cx="32" cy="20" r="10.4" fill={`url(#${id("globe")})`} />
      <g clipPath={`url(#${id("clip")})`} fill="none" stroke="#a9d1ff" strokeWidth="0.7" strokeOpacity="0.8">
        <ellipse cx="32" cy="20" rx="3.9" ry="10.4" />
        <ellipse cx="32" cy="20" rx="8" ry="10.4" />
        <path d="M21.6 20H42.4M22.9 14.8H41.1M22.9 25.2H41.1" />
      </g>
      <circle cx="28.4" cy="16.2" r="1.7" fill="#fff" fillOpacity="0.85" />
    </svg>
  );
}

export function Logo({ onDark = false, tagline = false }: { onDark?: boolean; tagline?: boolean }) {
  return (
    <Link href="/" className={`${styles.logo} ${onDark ? styles.onDark : ""}`} aria-label={tagline ? "Omniwebora, vision for a connected world, home" : "Omniwebora, home"}>
      <LogoMark idSuffix={onDark ? "dark" : "light"} size={30} />
      <span className={styles.text}>
        <span className={styles.word}>
          <span className={styles.omni}>Omni</span>
          <span className={styles.webora}>Webora</span>
        </span>
        {tagline && (
          <>
            {" "}
            <span className={styles.tagline}>Vision for a connected world</span>
          </>
        )}
      </span>
    </Link>
  );
}
