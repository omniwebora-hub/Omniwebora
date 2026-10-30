import type { Metadata } from "next";
import Link from "next/link";
import { SceneHero } from "@/components/sections/SceneHero";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Brief received",
  description: "Your project brief was delivered.",
  path: "/thank-you",
  noindex: true,
});

/** Reached only after /api/inquiry acknowledged delivery (the brief studio navigates here on HTTP 200 + ok). */
export default function ThankYouPage() {
  return (
    <SceneHero
      scene="/assets/cinematic/contact-arrive-end"
      kicker="Brief received"
      title="Thanks, your brief was sent."
      lede="We'll read it carefully and reply to the email address you gave us. In the meantime, you're welcome to explore."
    >
      <Link href="/solutions" className="btn btn-primary btn-small">
        Walk through the Solutions gallery
      </Link>
      <Link href="/approach">How we work</Link>
    </SceneHero>
  );
}
