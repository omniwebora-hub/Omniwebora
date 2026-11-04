import Link from "next/link";
import styles from "./Logo.module.css";

/**
 * The owner's logo, used exactly as supplied (2026-11-04: "use the same logo, no change"): the eye whose
 * iris is the globe, "OmniWebora" and "Vision for a connected world". The artwork is only cut from its
 * white background (scripts/brand/make_logo.py); it is made for a light ground, so it always sits on one
 * (the frosted header, the footer's plaque).
 */
const SRC = "/brand/omniwebora-logo";

export function Logo({ size = "header" }: { size?: "header" | "footer" }) {
  return (
    <Link href="/" className={`${styles.logo} ${styles[size]}`} aria-label="Omniwebora, home">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${SRC}-480.webp`}
        srcSet={`${SRC}-480.webp 480w, ${SRC}-960.webp 960w, ${SRC}-1440.webp 1440w`}
        sizes={size === "footer" ? "300px" : "(max-width: 1023px) 170px, 212px"}
        width={480}
        height={115}
        alt=""
        decoding="async"
        loading={size === "footer" ? "lazy" : undefined}
      />
    </Link>
  );
}
