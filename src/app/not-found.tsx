import type { Metadata } from "next";
import Link from "next/link";
import { solutions } from "@/content/solutions";
import { Icon } from "@/components/ui/Icon";
import { SceneHero } from "@/components/sections/SceneHero";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <SceneHero
      scene="/assets/cinematic/k1-draw"
      id="nf-title"
      kicker="Error 404"
      title="This page doesn’t exist."
      lede="The link may be out of date, or the address may have a typo. These are good places to continue."
    >
      <Link href="/" className="btn btn-primary btn-small">
        Home <Icon name="arrow-right" size={16} />
      </Link>
      <Link href="/solutions">Solutions: {solutions.map((s) => s.short).join(", ")}</Link>
      <Link href="/contact">Contact us</Link>
    </SceneHero>
  );
}
