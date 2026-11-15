import { site } from "@/content/site";
import { whatsappLink } from "@/lib/whatsapp";
import styles from "./ContactLinks.module.css";

/**
 * Direct contact: WhatsApp only (O09; owner, 2026-11-15: no email).
 * Nothing is shown for a channel that is not confirmed.
 */
export function ContactLinks({ className }: { className?: string }) {
  const wa = site.whatsapp.verified ? site.whatsapp.value : "";
  if (!wa) return null;
  return (
    <ul className={`${styles.links} ${className ?? ""}`} aria-label="Contact Omniwebora on WhatsApp">
      {wa && (
        <li>
          <a href={whatsappLink("Hello Omniwebora, I'd like to talk about a project.")} target="_blank" rel="noopener">
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M12 3.2a8.7 8.7 0 0 0-7.5 13.2L3.3 20.8l4.5-1.2A8.7 8.7 0 1 0 12 3.2Zm0 1.6a7.1 7.1 0 1 1-3.6 13.2l-.3-.2-2.6.7.7-2.5-.2-.3A7.1 7.1 0 0 1 12 4.8Zm-3 3.3c-.2 0-.5 0-.7.3-.3.3-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.8 2.8 4.4 3.8 2.2.9 2.6.7 3.1.6.5 0 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.2-.2-.5-.3l-1.8-.9c-.3-.1-.4-.1-.6.1l-.8 1c-.2.2-.3.2-.6.1a5.8 5.8 0 0 1-2.9-2.5c-.2-.4.2-.4.6-1.2.1-.1 0-.3 0-.4l-.8-2c-.2-.5-.4-.4-.6-.4H9Z"
                fill="currentColor"
              />
            </svg>
            WhatsApp {site.whatsapp.display}
          </a>
        </li>
      )}
    </ul>
  );
}
