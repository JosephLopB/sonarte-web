import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Hammer, Images } from "lucide-react";
import { gsap, prefiereMenosMovimiento } from "../lib/gsap.js";
import { Reveal } from "../components/Reveal.jsx";
import { Espiral } from "../components/Espirales.jsx";
import { ETAPAS } from "../data/proceso.js";

function TarjetaEtapa({ etapa }) {
  const oscura = Number(etapa.numero) % 2 === 0;
  return (
    <article
      className={`flex h-[68vh] w-[86vw] shrink-0 flex-col overflow-hidden rounded-[2.25rem] p-8 sm:w-[34rem] sm:p-10 ${
        oscura
          ? "superficie-profunda text-crema sombra-flotante"
          : "border border-terracota/25 bg-crema text-marron sombra-suave"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <span className={`font-impacto text-6xl leading-none ${oscura ? "text-turquesa/70" : "texto-espiral"}`}>
          {etapa.numero}
        </span>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] ${
            oscura ? "bg-crema/10 text-turquesa" : "bg-terracota/10 text-terracota"
          }`}
        >
          <Hammer className="size-3.5" />
          {etapa.herramienta}
        </span>
      </div>

      <h2 className={`mt-5 font-serif text-3xl ${oscura ? "text-crema" : "text-marron"}`}>{etapa.titulo}</h2>
      <p className={`mt-3 flex-1 text-sm leading-relaxed ${oscura ? "text-crema/80" : "text-muted-foreground"}`}>
        {etapa.texto}
      </p>

      {etapa.imagenes.length > 0 ? (
        <div className={`mt-5 grid gap-3 ${etapa.imagenes.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
          {etapa.imagenes.map((src) => (
            <div key={src} className="overflow-hidden rounded-2xl border border-crema/20 bg-noche/5">
              <img
                src={src}
                alt={`${etapa.titulo} — material del proceso`}
                className="h-28 w-full object-contain sm:h-32"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      ) : (
        <div
          className={`mt-5 flex items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-5 text-center ${
            oscura ? "border-turquesa/40 text-crema/70" : "border-terracota/40 text-muted-foreground"
          }`}
        >
          <Images className="size-5 shrink-0 opacity-60" />
          <p className="text-xs leading-relaxed">{etapa.hueco}</p>
        </div>
      )}
    </article>
  );
}

export default function Proceso() {
  const wrap = useRef(null);
  const track = useRef(null);
  const barra = useRef(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();

    /* Escritorio: scroll vertical traducido a recorrido horizontal con pin */
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const recorrer = () => track.current.scrollWidth - window.innerWidth;
      const tween = gsap.to(track.current, {
        x: () => -recorrer(),
        ease: "none",
        scrollTrigger: {
          trigger: wrap.current,
          start: "top top",
          end: () => `+=${recorrer()}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => gsap.set(barra.current, { scaleX: self.progress }),
        },
      });
      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden bg-crema pt-40 pb-28">
      {/* Cabecera */}
      <div className="relative z-10 mx-auto max-w-5xl px-5">
        <Reveal dir="scale" className="text-center">
          <Espiral className="mx-auto size-14 text-terracota anim-girar-lento" />
          <h1 className="mt-6 font-serif text-5xl text-marron sm:text-6xl">
            El <span className="texto-espiral">proceso</span> creativo
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            De la memoria musical de Joe Arroyo a un universo transmedia: nueve etapas donde cada
            herramienta del proceso deja su huella en el resultado final.
          </p>
        </Reveal>
      </div>

      {/* Línea de tiempo horizontal (desktop, pinned) / vertical (móvil) */}
      <div ref={wrap} className="relative mt-16 md:h-screen md:overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-[calc(50%-2px)] hidden h-1 bg-terracota/15 md:block" aria-hidden="true" />
        <div
          ref={track}
          className="flex flex-col gap-8 px-5 md:h-screen md:w-max md:flex-row md:items-center md:gap-10 md:px-[8vw]"
        >
          {ETAPAS.map((etapa) => (
            <TarjetaEtapa key={etapa.id} etapa={etapa} />
          ))}

          {/* Cierre del recorrido */}
          <article className="flex h-[68vh] w-[86vw] shrink-0 flex-col items-center justify-center gap-6 rounded-[2.25rem] superficie-caribe p-10 text-center text-crema sombra-flotante sm:w-[30rem]">
            <Espiral className="size-16 anim-girar-lento" />
            <h2 className="font-serif text-3xl">El espiral vuelve a empezar</h2>
            <p className="max-w-xs text-sm leading-relaxed text-crema/90">
              Cada etapa alimenta a la siguiente: el resultado final vive en el cómic interactivo.
            </p>
            <Link
              to="/comic"
              className="inline-flex items-center gap-2 rounded-full bg-noche px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.16em] text-crema transition-all duration-500 hover:-translate-y-1"
            >
              Ver el cómic
              <ArrowRight className="size-4" />
            </Link>
          </article>
        </div>

        {/* Barra de progreso (desktop) */}
        <div className="pointer-events-none absolute inset-x-0 bottom-10 mx-auto hidden h-1.5 w-[60%] overflow-hidden rounded-full bg-crema/60 shadow-md md:block">
          <div ref={barra} className="h-full w-full origin-left scale-x-0 superficie-caribe" />
        </div>
      </div>
    </section>
  );
}
