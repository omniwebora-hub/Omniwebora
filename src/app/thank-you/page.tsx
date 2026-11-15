import type { Metadata } from "next";
import Link from "next/link";
import { SceneHero } from "@/components/sections/SceneHero";
import { site } from "@/content/site";
import { whatsappLink } from "@/lib/whatsapp";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Brief received",
  description: "Your project brief was delivered.",
  path: "/thank-you",
  noindex: true,
});

/**
 * Reached after /api/inquiry acknowledged delivery (HTTP 200 + ok), or with ?via=whatsapp after the
 * brief was handed to WhatsApp (the visitor presses send there).
 */
export default async function ThankYouPage({ searchParams }: { searchParams: Promise<{ via?: string }> }) {
  const { via } = await searchParams;
  const onWhatsApp = via === "whatsapp";
  return (
    <SceneHero
      scene="/assets/cinematic/contact-arrive-end"
      kicker={onWhatsApp ? "Almost there" : "Brief received"}
      title={onWhatsApp ? "Press send in WhatsApp." : "Thanks, your brief was sent."}
      lede={
        onWhatsApp
          ? `Your brief is ready in WhatsApp, addressed to Omniwebora (${site.whatsapp.display}). Press send and we'll reply there.`
          : "We'll read it carefully and reply to the email address you gave us. In the meantime, you're welcome to explore."
      }
    >
      {onWhatsApp ? (
        <a href={whatsappLink()} target="_blank" rel="noopener" className="btn btn-primary btn-small">
          Open WhatsApp
        </a>
      ) : (
        <Link href="/solutions" className="btn btn-primary btn-small">
          Walk through the Solutions gallery
        </Link>
      )}
      {onWhatsApp ? <Link href="/solutions">Explore Solutions</Link> : <Link href="/approach">How we work</Link>}
    </SceneHero>
  );
}
