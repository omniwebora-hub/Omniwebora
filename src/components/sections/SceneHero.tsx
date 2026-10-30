import s from "./SceneHero.module.css";

/** A single full-screen scene from the building's world with the page's words resting on it. */
export function SceneHero({ scene, kicker, title, lede, children, id = "page-title" }: { scene: string; kicker: string; title: string; lede: string; children?: React.ReactNode; id?: string }) {
  return (
    <section className={s.scene} data-scene aria-labelledby={id}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={s.img} src={`${scene}-1920.webp`} srcSet={`${scene}-1280.webp 1280w, ${scene}-1920.webp 1920w, ${scene}-2560.webp 2560w`} sizes="100vw" alt="" fetchPriority="high" />
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
