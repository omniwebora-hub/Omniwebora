import Link from "next/link";
import { solutions } from "@/content/solutions";
import { site } from "@/content/site";
import { Logo } from "./Logo";
import { Icon } from "@/components/ui/Icon";
import { FooterScene } from "./FooterScene";
import { NextStep } from "./NextStep";
import { ContactLinks } from "./ContactLinks";
import styles from "./Footer.module.css";

/**
 * The last scene of every page: the building at night across the pool, in gentle motion. On wide
 * screens the page lifts away to reveal it in place (it never scrolls up over anything). Real routes
 * only, no invented address or social profiles.
 */
export function Footer() {
  const year = new Date().getFullYear();
  const verifiedSocial = site.social.filter((s) => s.verified);

  return (
    <footer className={styles.footer}>
      <div className={styles.scene} aria-hidden="true">
        <FooterScene src="/assets/cinematic/footer-night.mp4" poster="/assets/cinematic/s08-night-1920.webp" />
        <span className={styles.veil} />
      </div>
      <NextStep />
      <div className={`container ${styles.top}`}>
        <div className={styles.brand}>
          <Logo onDark />
          <p className={styles.tagline}>{site.brochureTagline}</p>
          <p>{site.description}</p>
          <ContactLinks className={styles.direct} />
          <Link href="/contact" className="btn btn-on-ink btn-small">
            Contact us
            <Icon name="arrow-right" size={18} className="btn-arrow" />
          </Link>
        </div>

        <nav aria-label="Solutions" className={styles.col}>
          <h2 className={styles.colTitle}>Solutions</h2>
          <ul>
            {solutions.map((s) => (
              <li key={s.slug}>
                <Link href={`/solutions/${s.slug}`}>{s.name}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Explore" className={styles.col}>
          <h2 className={styles.colTitle}>Explore</h2>
          <ul>
            <li><Link href="/industries">Industries</Link></li>
            <li><Link href="/approach">How we work</Link></li>
            <li><Link href="/pricing">Pricing</Link></li>
          </ul>
        </nav>

        <nav aria-label="Company" className={styles.col}>
          <h2 className={styles.colTitle}>Company</h2>
          <ul>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/privacy">Privacy notice</Link></li>
            {verifiedSocial.map((s) => (
              <li key={s.href}>
                <a href={s.href} rel="noopener" target="_blank">{s.label}</a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className={`container ${styles.bottom}`}>
        <p>
          © {year} {site.legalName.verified ? site.legalName.value : site.name}. Every project receives a written proposal based on its
          requirements.
        </p>
        <a href="#main" className={styles.made}>Back to top</a>
      </div>
    </footer>
  );
}
