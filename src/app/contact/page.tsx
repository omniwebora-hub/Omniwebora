import type { Metadata } from "next";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { BriefStudio, BriefStudioFromUrl } from "@/components/contact/BriefStudio";
import { ContactFilm } from "@/components/contact/ContactFilm";
import { ContactLinks } from "@/components/layout/ContactLinks";
import { pageMetadata } from "@/lib/seo";
import c from "@/components/film/chapters.module.css";
import s from "./contact.module.css";

export const metadata: Metadata = pageMetadata({
  title: "Contact Us",
  description:
    "Share the challenge, a rough idea or an existing process. A short guided brief helps us understand the scope; we reply by email to discuss next steps.",
  path: "/contact",
});

export default function ContactPage() {
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
            <p className={c.lede}>Share the challenge, a rough idea or an existing process. We&rsquo;ll use your details to understand the scope and reply by email.</p>
            <a href="#brief" className={c.more}>
              Start the brief
            </a>
            <ContactLinks />
          </div>
        </div>
      </section>

      <div className={`${c.block} ${c.move}`} data-film-block="arrive" style={{ height: "140svh" }} aria-hidden="true">
        <p className={c.moveLine}>Along the terrace · somewhere quiet to talk</p>
      </div>

      <section className={`${c.block} ${s.brief}`} data-film-block="brief" aria-label="Project brief">
        {/* The link target sits just inside the chapter, so a jump here (after the header offset) lands on it. */}
        <span id="brief" className={s.anchor} />
        <div className={s.card} data-panel>
          <Suspense fallback={<BriefStudio />}>
            <BriefStudioFromUrl />
          </Suspense>
        </div>
      </section>
    </ContactFilm>
  );
}
