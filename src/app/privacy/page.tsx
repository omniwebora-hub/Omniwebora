import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { Icon } from "@/components/ui/Icon";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/content/site";
import styles from "../pages.module.css";

/**
 * PRE-LAUNCH DRAFT. Not reviewed by a lawyer. Always noindex until site.privacyPolicyApproved.
 * It describes what the code actually does today, so the client and their adviser have an
 * accurate starting point.
 */
export const metadata: Metadata = pageMetadata({
  title: "Privacy Notice (draft)",
  description: "How Omniwebora handles the information you send through this website. Pre-launch draft pending legal review.",
  path: "/privacy",
  noindex: !site.privacyPolicyApproved,
});

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "Privacy notice", path: "/privacy" }]}
        kicker="Privacy"
        title="Privacy notice"
        lede="How this website handles the information you send us, in plain language."
      />

      <section className="section" style={{ paddingTop: 0 }} aria-label="Privacy notice">
        <div className="container" style={{ maxWidth: 860 }}>
          {!site.privacyPolicyApproved && (
            <div className={styles.notice} role="note" style={{ marginBottom: 48 }}>
              <Icon name="alert" size={20} />
              <p>
                <strong>Pre-launch draft.</strong> This notice describes how the website currently works and is awaiting review by
                the business owner and a legal adviser. It will be replaced by an approved policy, including the company&rsquo;s
                legal name and contact details, before launch.
              </p>
            </div>
          )}

          <div className={styles.prose}>
            <h2>What we collect</h2>
            <p>When you send an inquiry through the contact form, we receive:</p>
            <ul>
              <li>your name and the email address you provide;</li>
              <li>your company name, if you choose to give it;</li>
              <li>the service you selected, your timeline (optional) and your project description;</li>
              <li>the page you submitted the form from, and any campaign tags (such as utm_source) in the link that brought you to the site, plus the website you came from.</li>
            </ul>
            <p>We don&rsquo;t ask for, and you shouldn&rsquo;t send, sensitive personal information or payment details through the form.</p>

            <h2>How we use it</h2>
            <p>
              We use these details only to read and reply to your inquiry and to understand how people find us. We don&rsquo;t sell
              your information or add you to a mailing list without asking.
            </p>

            <h2>Cookies and analytics</h2>
            <p>
              This site doesn&rsquo;t set advertising or tracking cookies. Campaign tags are held in your browser&rsquo;s session
              storage for the current visit only, and are sent to us only if you submit the form. If privacy-friendly, cookieless
              analytics are enabled, they record anonymous page views and events (for example, that a form was sent) without
              identifying you.
            </p>

            <h2>Where it goes and how long we keep it</h2>
            <p>
              Inquiries are delivered to our team by email or into the system we use to manage enquiries. Retention periods and the
              names of any service providers involved will be listed here once confirmed.
            </p>

            <h2>Your choices</h2>
            <p>
              You can ask us what we hold about you, ask us to correct it, or ask us to delete it. Until a dedicated privacy contact
              is published here, reply to any email we have sent you, or send a request through the{" "}
              <Link href="/contact">contact form</Link>.
            </p>

            <h2>Changes</h2>
            <p>We&rsquo;ll update this notice when the way the site works changes, and show the date of the latest version here.</p>
          </div>
        </div>
      </section>
    </>
  );
}
