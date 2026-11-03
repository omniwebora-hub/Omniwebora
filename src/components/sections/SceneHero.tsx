import s from "./SceneHero.module.css";

/**
 * A single full-screen scene from the building's world with the page's words resting on it. Tall
 * screens get the scene's portrait (9:16) frame when it has one (public/assets/cinematic/portrait).
 */
export function SceneHero({ scene, kicker, title, lede, children, id = "page-title" }: { scene: string; kicker: string; title: string; lede: string; children?: React.ReactNode; id?: string }) {
  const tall = PORTRAIT_SCENES.has(scene) ? scene.replace("/assets/cinematic/", "/assets/cinematic/portrait/") : null;
  return (
    <section className={s.scene} data-scene aria-labelledby={id}>
      <picture>
        {tall && <source media="(max-aspect-ratio: 1/1)" srcSet={`${tall}-720.webp 720w, ${tall}-1080.webp 1080w, ${tall}-1440.webp 1440w`} sizes="max(100vw, 56.25vh)" />}
        <img className={s.img} src={`${scene}-1920.webp`} srcSet={`${scene}-1280.webp 1280w, ${scene}-1920.webp 1920w, ${scene}-2560.webp 2560w`} sizes="100vw" alt="" fetchPriority="high" />
      </picture>
      <span className={s.shade} aria-hidden="true" />
      <div className={`container ${s.copy}`}>
        <p className={s.kicker}>{kicker}</p>
        <h1 id={id} className={s.title}>
          {title}
        </h1>
        <p className={s.lede}>{lede}</p>
        {children && <div className={s.actions}>{children}</div>}
      </div>
    </section>
  );
}

/** Scenes that also have a portrait frame. */
const PORTRAIT_SCENES = new Set(["/assets/cinematic/k1-draw", "/assets/cinematic/contact-arrive-end"]);
