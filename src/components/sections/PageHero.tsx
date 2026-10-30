import Image from "next/image";
import { Breadcrumbs, type Crumb } from "@/components/layout/Breadcrumbs";
import { STILLS } from "@/content/heroWorld";
import styles from "./PageHero.module.css";

type Props = {
  crumbs: Crumb[];
  kicker: string;
  title: string;
  lede: string;
  children?: React.ReactNode;
  /** Visual on the right (illustration). */
  aside?: React.ReactNode;
  tone?: "porcelain" | "mist" | "ink";
  /** Atrium colonnade photograph behind the header (used sparingly; most routes have their own visual). */
  plate?: boolean;
};

/** Interior page header: breadcrumbs, one H1, a lede, and an optional bespoke visual. */
export function PageHero({ crumbs, kicker, title, lede, children, aside, tone = "porcelain", plate = false }: Props) {
  return (
    <section className={`${styles.hero} ${styles[tone]}`} aria-labelledby="page-title">
      {plate && (
        <div className={styles.plate} aria-hidden="true">
          <Image src={STILLS.colonnade[1].src} alt="" fill sizes="70vw" quality={65} className={styles.plateImg} />
        </div>
      )}
      <div className={`container ${styles.inner} ${aside ? styles.withAside : ""}`}>
        <div className={styles.copy}>
          <Breadcrumbs items={crumbs} />
          <p className="kicker">{kicker}</p>
          <h1 id="page-title" className={styles.title}>
            {title}
          </h1>
          <p className={styles.lede}>{lede}</p>
          {children && <div className={styles.actions}>{children}</div>}
        </div>
        {aside && <div className={styles.aside}>{aside}</div>}
      </div>
    </section>
  );
}
