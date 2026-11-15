import type { Metadata } from "next";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { BriefStudio, BriefStudioFromUrl } from "@/components/contact/BriefStudio";
import { ContactFilm } from "@/components/contact/ContactFilm";
import { ContactLinks } from "@/components/layout/ContactLinks";
import { pageMetadata } from "@/lib/seo";
import { describeTransport } from "@/lib/inquiry/transport";
import c from "@/components/film/chapters.module.css";
import s from "./contact.module.css";

export const metadata: Metadata = pageMetadata({
  title: "Contact Us",
  description:
    "Share the challenge, a rough idea or an existing process. Send a short brief or message us on WhatsApp.",
  path: "/contact",
});

export default function ContactPage() {
  // Read at build time: with a mailbox connected the brief is emailed; otherwise it is sent on WhatsApp.
  const emailReady = describeTransport() !== "none";
  return (
    <ContactFilm>
      <section className={`${c.block} ${c.hold}`} data-film-block="terrace" style={{ "--hold": "95svh" } as React.CSSProperties} aria-labelledby="contact-title">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={c.flatPlate} src="/assets/cinematic/contact-arrive-end-1280.webp" alt="" />
        <div className={c.panelWrap}>
          <div className={c.panel} data-panel>
            <Breadcrumbs items={[{ name: "Contact", path: "/contact" }]} />
            <p className={c.num}>Contact us</p>
            <h1 id="contact-title" className={c.title}>
              Tell us what you&rsquo;re building.
            </h1>
            <p className={c.lede}>Share your idea, or message us on WhatsApp.</p>
            {/* Owner, 2026-11-06: "Enquire with us" opens the form (the next chapter). */}
            <div className={c.actions}>
              <a href="#brief" className="btn btn-primary btn-small">
                Enquire with us
              </a>
            </div>
            <ContactLinks />
          </div>
        </div>
      </section>

      <div className={`${c.block} ${c.move}`} data-film-block="arrive" style={{ height: "100svh" }} aria-hidden="true">
        <p className={c.moveLine}>Along the terrace · somewhere quiet to talk</p>
      </div>

      <section className={`${c.block} ${s.brief}`} data-film-block="brief" data-free-scroll aria-label="Project brief">
        {/* The link target sits just inside the chapter, so a jump here (after the header offset) lands on it. */}
        <span id="brief" className={s.anchor} />
        <div className={s.card} data-panel>
          <Suspense fallback={<BriefStudio emailReady={emailReady} />}>
            <BriefStudioFromUrl emailReady={emailReady} />
          </Suspense>
        </div>
      </section>
    </ContactFilm>
  );
}
