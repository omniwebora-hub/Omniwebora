import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { CityFilm } from "@/components/industries/CityFilm";
import c from "@/components/film/chapters.module.css";
import { IndustryWorkstation } from "@/components/industries/IndustryWorkstation";
import { CtaBand } from "@/components/sections/CtaBand";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Industries: Software Shaped to Your Operations",
  description:
    "Examples of systems that can be tailored to retail and e-commerce, hospitality and restaurants, education, healthcare administration, logistics and professional services.",
  path: "/industries",
});

export default function IndustriesPage() {
  return (
    <>
      <CityFilm>
        <section className={`${c.block} ${c.city}`} data-film-block="city" aria-labelledby="ind-title">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={c.flatPlate} src="/assets/cinematic/i01-city-1280.webp" alt="" />
          <div className={c.cityIntro} data-city-intro>
            <div className={c.panel} data-panel>
              <Breadcrumbs items={[{ name: "Industries", path: "/industries" }]} />
              <p className={c.num}>Industries · technology in the real world</p>
              <h1 id="ind-title" className={c.title}>
                Different operations. Thoughtful digital solutions.
              </h1>
              <p className={c.lede}>Look across the bay: every district runs on systems. Scroll to see how the same building blocks shape a shop, a hotel, a campus, a hospital, a port and an office.</p>
              <a href="#contexts" className={c.more}>
                Or explore every context below
              </a>
            </div>
          </div>
        </section>
      </CityFilm>
      <div className="flat-only">
      <section className="section" id="contexts" aria-label="Business contexts">
        <div className="container">
          <IndustryWorkstation />
        </div>
      </section>
      <CtaBand
        title="Talk about your workflow."
        body="Your business may not fit any of these neatly. Tell us how work moves today and we will suggest what to build first."
        label="Talk about your workflow"
        location="industries"
      />
      </div>
    </>
  );
}
