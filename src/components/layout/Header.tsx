"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { primaryCta, primaryNav } from "@/content/navigation";
import { searchEntries } from "@/content/searchIndex";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "./Logo";
import { track } from "@/lib/analytics";
import styles from "./Header.module.css";

/** Routes whose hero is dark (ink): the transparent header uses light text until scrolled. */
const DARK_HERO_ROUTES = new Set<string>(["/solutions/business-automation"]);

const isActive = (pathname: string, href: string) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`));

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDialogElement>(null);
  const searchRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close overlays and menus on navigation.
  useEffect(() => {
    menuRef.current?.close();
    searchRef.current?.close();
  }, [pathname]);

  const openSearch = useCallback(() => {
    menuRef.current?.close();
    searchRef.current?.showModal();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const typing = target.closest("input, textarea, select, [contenteditable]");
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        openSearch();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openSearch]);

  const solid = scrolled;
  const onDark = !solid && DARK_HERO_ROUTES.has(pathname);
  const glass = !solid && pathname === "/";

  return (
    <header className={`${styles.header} ${solid ? styles.scrolled : ""} ${onDark ? styles.onDark : ""} ${glass ? styles.glass : ""}`}>
      <div className={`container ${styles.bar}`}>
        <Logo onDark={onDark} />

        <nav aria-label="Primary" className={styles.nav}>
          <ul>
            {primaryNav.map((item) =>
              item.children ? (
                // Solutions: a click goes to the start of the gallery; hovering (or keyboard focus)
                // shows a small list of the six rooms, names only, so nothing on the page is blocked.
                <li key={item.href} className={styles.group}>
                  <Link
                    href={item.href}
                    className={styles.navLink}
                    aria-current={isActive(pathname, item.href) ? "page" : undefined}
                    onClick={() => {
                      if (pathname === item.href) {
                        history.replaceState(null, "", item.href);
                        window.scrollTo({ top: 0 });
                      }
                    }}
                  >
                    {item.label}
                    <svg className={styles.caret} width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
                      <path d="M2 3.5 5 6.5 8 3.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  </Link>
                  <ul className={styles.mini} aria-label={`${item.label} rooms`}>
                    {item.children.map((c) => (
                      <li key={c.href}>
                        <Link href={c.href} onClick={() => track("nav_service_click", { href: c.href, location: "header" })}>
                          {c.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ) : (
                <li key={item.href}>
                  <Link href={item.href} className={styles.navLink} aria-current={isActive(pathname, item.href) ? "page" : undefined}>
                    {item.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className={styles.actions}>
          <button type="button" className={styles.iconButton} onClick={openSearch} aria-label="Search the site">
            <Icon name="search" size={20} />
          </button>
          <Link href={primaryCta.href} className={`btn btn-primary btn-small ${styles.cta}`} onClick={() => track("project_cta_click", { location: "header" })}>
            {primaryCta.label}
            <Icon name="arrow-right" size={18} className="btn-arrow" />
          </Link>
          <button
            type="button"
            className={`${styles.iconButton} ${styles.menuButton}`}
            aria-label="Open menu"
            aria-haspopup="dialog"
            onClick={() => menuRef.current?.showModal()}
          >
            <Icon name="menu" size={22} />
          </button>
        </div>
      </div>

      <dialog ref={menuRef} className={styles.menu} aria-label="Menu" onClick={(e) => e.target === menuRef.current && menuRef.current?.close()}>
        <div className={styles.menuInner}>
          <div className={styles.menuTop}>
            <Logo />
            <button type="button" className={styles.iconButton} aria-label="Close menu" onClick={() => menuRef.current?.close()}>
              <Icon name="close" size={22} />
            </button>
          </div>
          <nav aria-label="Mobile">
            <ul className={styles.menuList}>
              {primaryNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} aria-current={pathname === item.href ? "page" : undefined} onClick={() => menuRef.current?.close()}>
                    {item.label}
                  </Link>
                  {item.children && (
                    <ul className={styles.menuSub}>
                      {item.children
                        .filter((c) => c.href !== item.href)
                        .map((c) => (
                          <li key={c.href}>
                            <Link href={c.href} aria-current={pathname === c.href ? "page" : undefined} onClick={() => menuRef.current?.close()}>
                              {c.label}
                            </Link>
                          </li>
                        ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </nav>
          <div className={styles.menuFoot}>
            <Link href="/contact" className="btn btn-primary" onClick={() => track("project_cta_click", { location: "mobile_menu" })}>
              Contact Us
              <Icon name="arrow-right" size={18} className="btn-arrow" />
            </Link>
            <button type="button" className="btn btn-ghost" onClick={openSearch}>
              <Icon name="search" size={18} /> Search
            </button>
          </div>
        </div>
      </dialog>

      <SearchDialog dialogRef={searchRef} />
    </header>
  );
}

function SearchDialog({ dialogRef }: { dialogRef: React.RefObject<HTMLDialogElement | null> }) {
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const router = useRouter();
  const listId = useId();
  const results = searchEntries(query);

  const go = (href: string) => {
    dialogRef.current?.close();
    router.push(href);
  };

  return (
    <dialog
      ref={dialogRef}
      className={styles.search}
      aria-label="Search"
      onClick={(e) => e.target === dialogRef.current && dialogRef.current?.close()}
      onClose={() => {
        setQuery("");
        setCursor(0);
      }}
    >
      <div className={styles.searchInner}>
        <div className={styles.searchField}>
          <Icon name="search" size={20} />
          <label htmlFor={`${listId}-input`} className="visually-hidden">
            Search pages and services
          </label>
          <input
            id={`${listId}-input`}
            type="search"
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-activedescendant={results[cursor] ? `${listId}-${cursor}` : undefined}
            autoComplete="off"
            placeholder="Search pages and services"
            value={query}
            autoFocus
            onChange={(e) => {
              setQuery(e.target.value);
              setCursor(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setCursor((c) => Math.min(c + 1, results.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setCursor((c) => Math.max(c - 1, 0));
              } else if (e.key === "Enter" && results[cursor]) {
                e.preventDefault();
                go(results[cursor].href);
              }
            }}
          />
          <button type="button" className={styles.iconButton} aria-label="Close search" onClick={() => dialogRef.current?.close()}>
            <Icon name="close" size={20} />
          </button>
        </div>
        <ul id={listId} role="listbox" aria-label="Results" className={styles.results}>
          {results.length === 0 && <li className={styles.empty}>No pages match “{query}”. Try “automation”, “apps” or “process”.</li>}
          {results.map((r, i) => (
            <li key={r.href} id={`${listId}-${i}`} role="option" aria-selected={i === cursor}>
              <Link href={r.href} onClick={(e) => { e.preventDefault(); go(r.href); }} onMouseEnter={() => setCursor(i)} tabIndex={-1}>
                <span className={styles.resultTitle}>{r.title}</span>
                <span className={styles.resultDesc}>{r.description}</span>
                <span className={styles.resultGroup}>{r.group}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </dialog>
  );
}
