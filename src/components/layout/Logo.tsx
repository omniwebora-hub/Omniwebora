import Link from "next/link";
import styles from "./Logo.module.css";

/**
 * PROVISIONAL: vector redraw of the mark in the client's visual reference.
 * Replace with official logo files (see docs/content-verification.md).
 */
export function LogoMark({ size = 34, idSuffix = "a" }: { size?: number; idSuffix?: string }) {
  const g = `omni-g-${idSuffix}`;
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={g} x1="6" y1="4" x2="34" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#45a0ff" />
          <stop offset="0.55" stopColor="#1f74e0" />
          <stop offset="1" stopColor="#123f9e" />
        </linearGradient>
      </defs>
      <g fill="none" stroke={`url(#${g})`} strokeWidth="4.4" strokeLinecap="round">
        <path d="M14.2 19.6a7.6 7.6 0 1 1 11.6 0" />
        <path d="M20 29.6a7.6 7.6 0 1 1-8.4-12.4" />
        <path d="M28.4 17.2A7.6 7.6 0 1 1 20 29.6" />
        <path d="M16.4 25.4 20 22l3.6 3.4" />
      </g>
    </svg>
  );
}

export function Logo({ onDark = false }: { onDark?: boolean }) {
  return (
    <Link href="/" className={`${styles.logo} ${onDark ? styles.onDark : ""}`} aria-label="Omniwebora, home">
      <LogoMark idSuffix={onDark ? "dark" : "light"} />
      <span className={styles.word}>Omniwebora</span>
    </Link>
  );
}
