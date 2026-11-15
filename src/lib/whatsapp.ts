import { site } from "@/content/site";

/** A wa.me link to the owner's WhatsApp (O09), optionally with a prefilled message. */
export function whatsappLink(text?: string) {
  const n = site.whatsapp.value;
  return `https://wa.me/${n}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}
