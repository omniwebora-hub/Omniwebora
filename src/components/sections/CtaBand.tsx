import { TrackedLink } from "@/components/ui/TrackedLink";
import { Icon } from "@/components/ui/Icon";
import styles from "./CtaBand.module.css";

/** Closing call to action used on interior pages. */
export function CtaBand({
  title = "Have an idea that needs to work in the real world?",
  body = "Tell us about it. We'll help you work out what to build first, and how.",
  href = "/contact",
  label = "Contact Us",
  location,
}: {
  title?: string;
  body?: string;
  href?: string;
  label?: string;
  location: string;
}) {
  return (
    <section className={styles.band} data-scenic="open" aria-labelledby={`cta-${location}`}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.copy}>
          <h2 id={`cta-${location}`}>{title}</h2>
          <p>{body}</p>
        </div>
        <TrackedLink href={href} event="start_project" props={{ location }} className="btn btn-on-ink">
          {label}
          <Icon name="arrow-right" size={18} className="btn-arrow" />
        </TrackedLink>
      </div>
    </section>
  );
}
