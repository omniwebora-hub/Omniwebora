"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import styles from "./Footer.module.css";

/**
 * The end of every page leads somewhere, by a click (never automatically): into the Solutions gallery,
 * or from the Solutions pages on to Contact. It opens the footer scene.
 */
export function NextStep() {
  const path = usePathname();
  const inSolutions = path === "/solutions" || path.startsWith("/solutions/");
  const next = inSolutions
    ? { kicker: "Next", title: "Tell us what you’re building.", cta: "Contact us", href: "/contact" }
    : { kicker: "Next · Solutions", title: "Walk through the six rooms.", cta: "Explore Solutions", href: "/solutions" };
  return (
    <div className={`container ${styles.next}`}>
      <p className={styles.nextKicker}>{next.kicker}</p>
      <Link href={next.href} className={styles.nextLink}>
        <span>{next.title}</span>
        <span className={styles.nextCta}>
          {next.cta} <Icon name="arrow-right" size={20} />
        </span>
      </Link>
    </div>
  );
}
