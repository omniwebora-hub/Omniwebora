import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { StudioFilm } from "@/components/about/StudioFilm";
import c from "@/components/film/chapters.module.css";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "About Omniwebora",
  description:
    "Omniwebora is a technology partner for web, mobile, software, automation and enterprise solutions, matching each digital solution to a real business need. Innovate. Build. Transform.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <StudioFilm>
        <section className={`${c.block} ${c.hold}`} data-film-block="studio" style={{ "--hold": "110svh" } as React.CSSProperties} aria-labelledby="page-title">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={c.flatPlate} src="/assets/cinematic/about-in-start-1280.webp" alt="" />
          <div className={c.panelWrap}>
            <div className={c.panel} data-panel>
              <Breadcrumbs items={[{ name: "About", path: "/about" }]} />
              <p className={c.num}>About Omniwebora · Innovate. Build. Transform.</p>
              <h1 id="page-title" className={c.title}>
                Technology should fit the people who use it.
              </h1>
              <p className={c.lede}>We build websites, mobile apps, custom software, automation, digital marketing and enterprise platforms, each matched to a real business need and built to last.</p>
            </div>
          </div>
        </section>

        <div className={`${c.block} ${c.move}`} data-film-block="in" aria-hidden="true" />
        <div className={`${c.block} ${c.hold}`} data-film-block="table" style={{ "--hold": "40svh" } as React.CSSProperties} aria-hidden="true" />
        <div className={`${c.block} ${c.move}`} data-film-block="out" aria-hidden="true" />

        <section className={`${c.block} ${c.hold}`} data-film-block="meet" style={{ "--hold": "120svh" } as React.CSSProperties} aria-labelledby="meet-title">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={c.flatPlate} src="/assets/cinematic/about-out-end-1280.webp" alt="" loading="lazy" />
          <div className={c.panelWrap}>
            <div className={c.panel} data-panel>
              <p className={c.num}>Work with us</p>
              <h2 id="meet-title" className={c.title}>
                One partner, from idea to launch and beyond.
              </h2>
              <p className={c.lede}>We listen first, plan in seven clear stages and stay with you after launch. A rough idea is enough to begin.</p>
              <div className={c.actions}>
                <Link href="/contact" className="btn btn-primary btn-small">
                  Contact us
                </Link>
                <Link href="/approach" className={c.more}>
                  How we work
                </Link>
              </div>
            </div>
          </div>
        </section>
      </StudioFilm>
    </>
  );
}
