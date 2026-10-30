"use client";

import { useState } from "react";
import d from "@/components/demos/demo.module.css";
import s from "./ResponsiveBrowser.module.css";

/**
 * ILLUSTRATIVE DEMO: one small business site, shown at three widths. The site inside reflows with
 * CSS container queries (a real responsive layout, not three screenshots), and every state works:
 * the enquiry form validates, the catalogue filters and the booking picker holds a slot.
 */

const DEVICES = [
  { id: "desktop", label: "Desktop", width: "100%" },
  { id: "tablet", label: "Tablet", width: "620px" },
  { id: "phone", label: "Phone", width: "340px" },
] as const;

const PAGES = [
  { id: "home", label: "Home" },
  { id: "enquiry", label: "Enquiry form" },
  { id: "catalogue", label: "Catalogue" },
  { id: "booking", label: "Booking" },
] as const;

type PageId = (typeof PAGES)[number]["id"];
export type DeviceId = (typeof DEVICES)[number]["id"];

const PRODUCTS = [
  { name: "Starter package", cat: "Services", note: "Our most requested option" },
  { name: "Full service", cat: "Services", note: "Everything, handled for you" },
  { name: "Signature product", cat: "Products", note: "In stock · ships in 2 days" },
  { name: "Everyday product", cat: "Products", note: "In stock" },
  { name: "Annual care plan", cat: "Plans", note: "Priority support" },
  { name: "Gift voucher", cat: "Plans", note: "Any amount" },
];

/**
 * `embedded`: rendered on a display wall inside the Solutions film. The device width is chosen by
 * the camera's scroll position (`device` prop); pages inside stay fully interactive.
 */
export function ResponsiveBrowser({ embedded = false, device: deviceProp }: { embedded?: boolean; device?: DeviceId } = {}) {
  const [deviceState, setDevice] = useState<DeviceId>("desktop");
  const device = deviceProp ?? deviceState;
  const [page, setPage] = useState<PageId>("home");
  const width = DEVICES.find((x) => x.id === device)!.width;

  if (embedded) {
    return (
      <div className={s.embedded} data-device={device}>
        <div className={`${d.frame} ${s.browser} ${s.embeddedBrowser}`} style={{ width: device === "desktop" ? "100%" : device === "tablet" ? "52%" : "24%" }}>
          <div className={s.chrome}>
            <span className={d.dots} aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span className={s.url}>yourbusiness.com/{page === "home" ? "" : page}</span>
            <span className={d.illustrative}>Illustrative</span>
          </div>
          <div className={`${s.viewport} ${s.embeddedViewport}`}>
            <div className={s.site}>
              <nav className={s.siteNav} aria-label="Example site">
                <b className={s.brand}>Your Business</b>
                <span className={s.siteLinks}>
                  {PAGES.map((x) => (
                    <button key={x.id} type="button" onClick={() => setPage(x.id)} aria-current={page === x.id ? "page" : undefined}>
                      {x.id === "home" ? "Studio" : x.label.replace(" form", "")}
                    </button>
                  ))}
                </span>
              </nav>
              {page === "home" && <Home go={setPage} />}
              {page === "enquiry" && <Enquiry />}
              {page === "catalogue" && <Catalogue />}
              {page === "booking" && <Booking />}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={s.wrap}>
      <div className={s.controls}>
        <div className={d.segmented} role="group" aria-label="Screen width">
          {DEVICES.map((x) => (
            <button key={x.id} type="button" className={d.segment} aria-pressed={device === x.id} onClick={() => setDevice(x.id)}>
              {x.label}
            </button>
          ))}
        </div>
        <div className={d.segmented} role="group" aria-label="Page">
          {PAGES.map((x) => (
            <button key={x.id} type="button" className={d.segment} aria-pressed={page === x.id} onClick={() => setPage(x.id)}>
              {x.label}
            </button>
          ))}
        </div>
      </div>

      <div className={s.stage}>
        <div className={`${d.frame} ${s.browser}`} style={{ width }} data-device={device}>
          <div className={s.chrome}>
            <span className={d.dots} aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span className={s.url}>yourbusiness.com/{page === "home" ? "" : page}</span>
            <span className={d.illustrative}>Illustrative</span>
          </div>
          <div className={s.viewport}>
            <div className={s.site}>
              <nav className={s.siteNav} aria-label="Example site">
                <b className={s.brand}>Your Business</b>
                <span className={s.siteLinks}>
                  {PAGES.map((x) => (
                    <button key={x.id} type="button" onClick={() => setPage(x.id)} aria-current={page === x.id ? "page" : undefined}>
                      {x.id === "home" ? "Studio" : x.label.replace(" form", "")}
                    </button>
                  ))}
                </span>
              </nav>
              {page === "home" && <Home go={setPage} />}
              {page === "enquiry" && <Enquiry />}
              {page === "catalogue" && <Catalogue />}
              {page === "booking" && <Booking />}
            </div>
          </div>
        </div>
      </div>
      <p className={d.note}>An example for any business, built to show how one site adapts and works at each width.</p>
    </div>
  );
}

function Home({ go }: { go: (p: PageId) => void }) {
  return (
    <div className={s.hero}>
      <div className={s.heroCopy}>
        <p className={s.eyebrow}>Any business · example</p>
        <h3 className={s.heroTitle}>What you offer, explained in seconds.</h3>
        <p className={s.heroText}>Your services and products, why customers choose you, and the quickest way to enquire, order or book.</p>
        <div className={s.heroCtas}>
          <button type="button" className={d.button} onClick={() => go("booking")}>
            Book now
          </button>
          <button type="button" className={d.buttonGhost} onClick={() => go("catalogue")}>
            See what we offer
          </button>
        </div>
      </div>
      <div className={s.heroImage} />
    </div>
  );
}

function Enquiry() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  if (done)
    return (
      <div className={s.panel} role="status">
        <h3 className={s.panelTitle}>Form validated</h3>
        <p className={s.heroText}>On a real site this enquiry would now reach the business inbox or CRM. Nothing is sent from this demo.</p>
        <button type="button" className={d.buttonGhost} onClick={() => setDone(false)}>
          Try again
        </button>
      </div>
    );
  return (
    <form
      className={s.panel}
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        const next: Record<string, string> = {};
        if (String(f.get("n") ?? "").trim().length < 2) next.n = "Enter a name.";
        if (!/^\S+@\S+\.\S+$/.test(String(f.get("e") ?? ""))) next.e = "Enter an email like name@company.com.";
        if (String(f.get("m") ?? "").trim().length < 10) next.m = "Add a sentence about the room.";
        setErrors(next);
        if (Object.keys(next).length === 0) setDone(true);
      }}
    >
      <h3 className={s.panelTitle}>Tell us about your space</h3>
      <div className={s.fields}>
        <label>
          Name
          <input name="n" aria-invalid={!!errors.n} aria-describedby={errors.n ? "rb-n" : undefined} />
          {errors.n && <span id="rb-n" className={s.err}>{errors.n}</span>}
        </label>
        <label>
          Email
          <input name="e" type="email" aria-invalid={!!errors.e} aria-describedby={errors.e ? "rb-e" : undefined} />
          {errors.e && <span id="rb-e" className={s.err}>{errors.e}</span>}
        </label>
        <label className={s.wide}>
          About the room
          <textarea name="m" rows={3} aria-invalid={!!errors.m} aria-describedby={errors.m ? "rb-m" : undefined} />
          {errors.m && <span id="rb-m" className={s.err}>{errors.m}</span>}
        </label>
      </div>
      <button type="submit" className={d.button}>
        Send enquiry
      </button>
    </form>
  );
}

function Catalogue() {
  const [cat, setCat] = useState("All");
  const [basket, setBasket] = useState<string[]>([]);
  const list = PRODUCTS.filter((p) => cat === "All" || p.cat === cat);
  return (
    <div className={s.panel}>
      <div className={s.catHead}>
        <div className={d.segmented} role="group" aria-label="Category">
          {["All", "Services", "Products", "Plans"].map((c) => (
            <button key={c} type="button" className={d.segment} aria-pressed={cat === c} onClick={() => setCat(c)}>
              {c}
            </button>
          ))}
        </div>
        <span className={d.chip} data-tone="info" aria-live="polite">
          Basket: {basket.length}
        </span>
      </div>
      <ul className={s.products}>
        {list.map((p) => (
          <li key={p.name} className={s.product}>
            <span className={s.productImg} data-cat={p.cat} />
            <b>{p.name}</b>
            <span>{p.note}</span>
            <button type="button" className={d.buttonGhost} onClick={() => setBasket((b) => [...b, p.name])}>
              Add
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Booking() {
  const [day, setDay] = useState(0);
  const [slot, setSlot] = useState<string | null>(null);
  const days = ["Mon 3", "Tue 4", "Wed 5", "Thu 6"];
  const slots = ["10:00", "11:30", "14:00", "16:30"];
  const taken = (dIdx: number, t: string) => (dIdx + t.length) % 3 === 0 && t !== "16:30";
  return (
    <div className={s.panel}>
      <h3 className={s.panelTitle}>Book a studio visit</h3>
      <div className={d.segmented} role="group" aria-label="Day">
        {days.map((x, i) => (
          <button
            key={x}
            type="button"
            className={d.segment}
            aria-pressed={day === i}
            onClick={() => {
              setDay(i);
              setSlot(null);
            }}
          >
            {x}
          </button>
        ))}
      </div>
      <div className={s.slots}>
        {slots.map((t) =>
          taken(day, t) ? (
            <span key={t} className={s.slotTaken}>
              {t} · taken
            </span>
          ) : (
            <button key={t} type="button" className={s.slot} aria-pressed={slot === t} onClick={() => setSlot(t)}>
              {t}
            </button>
          ),
        )}
      </div>
      <p className={s.heroText} aria-live="polite">
        {slot ? `Holding ${days[day]} at ${slot}. A real site would confirm by email or WhatsApp.` : "Choose a time to hold it."}
      </p>
    </div>
  );
}
