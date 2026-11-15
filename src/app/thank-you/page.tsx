import type { Metadata } from "next";
import Link from "next/link";
import { SceneHero } from "@/components/sections/SceneHero";
import { Icon } from "@/components/ui/Icon";
import { site } from "@/content/site";
import { whatsappLink } from "@/lib/whatsapp";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Brief ready",
  description: "Your project brief is ready to send on WhatsApp.",
  path: "/thank-you",
  noindex: true,
});

/** Reached after the brief was handed to WhatsApp (owner, 2026-11-15: WhatsApp only); the visitor presses send there. */
export default function ThankYouPage() {
  return (
    <SceneHero
      scene="/assets/cinematic/contact-arrive-end"
      kicker="Almost there"
      title="Press send in WhatsApp."
      lede={`Your brief is ready in WhatsApp, addressed to Omniwebora (${site.whatsapp.display}). Press send and we'll reply there.`}
    >
      <a href={whatsappLink()} target="_blank" rel="noopener" className="btn btn-primary btn-small">
        <Icon name="whatsapp" size={18} />
        Open WhatsApp
      </a>
      <Link href="/solutions">Explore Solutions</Link>
    </SceneHero>
  );
}
