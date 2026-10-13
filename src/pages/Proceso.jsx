import { useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Boxes, FileText, Hammer, Maximize2, Play } from "lucide-react";
import { gsap } from "../lib/gsap.js";
import { Reveal } from "../components/Reveal.jsx";
import { Espiral } from "../components/Espirales.jsx";
import { ModalEtapa } from "../components/ModalEtapa.jsx";
import { ETAPAS } from "../data/proceso.js";

/** Icono del material que hay dentro del detalle, para las etapas sin miniaturas. */
const ICONOS_CHIP = {
  texto: FileText,
  video: Play,
  "3d": Boxes,
};

function TarjetaEtapa({ etapa, onAbrir }) {
  const oscura = Number(etapa.numero) % 2 === 0;
  const IconoChip = etapa.chip ? (ICONOS_CHIP[etapa.chip.icono] ?? FileText) : null;

  return (
    <article
      className={`flex h-[70vh] w-[86vw] shrink-0 flex-col overflow-hidden rounded-[2.25rem] p-7 sm:w-[34rem] sm:p-9 ${
        oscura
          ? "superficie-profunda text-crema sombra-flotante"
          : "border border-terracota/25 bg-crema text-marron sombra-suave"
      }`}
    >
      <div className="flex shrink-0 items-start justify-between gap-4">
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

      <h2 className={`mt-4 shrink-0 font-serif text-3xl ${oscura ? "text-crema" : "text-marron"}`}>
        {etapa.titulo}
      </h2>
      <p className={`mt-3 min-h-0 flex-1 overflow-hidden text-sm leading-relaxed ${oscura ? "text-crema/80" : "text-muted-foreground"}`}>
        {etapa.texto}
      </p>

      <div className="mt-5 shrink-0">
        {etapa.imagenes.length > 0 ? (
          <div className={`grid gap-3 ${etapa.imagenes.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
            {etapa.imagenes.map((src) => (
              <div key={src} className="overflow-hidden rounded-2xl border border-marron/15 bg-noche/5">
                <img
                  src={src}
                  alt={`${etapa.titulo} — material del proceso`}
                  className="h-24 w-full object-cover object-top sm:h-28"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        ) : IconoChip ? (
          <div
            className={`flex items-center gap-3 rounded-2xl border-2 border-dashed p-4 ${
              oscura ? "border-turquesa/40 text-crema/80" : "border-terracota/40 text-muted-foreground"
            }`}
          >
            <IconoChip className="size-5 shrink-0" />
            <p className="text-xs leading-relaxed">{etapa.chip.texto}</p>
          </div>
        ) : null}
      </div>

      <button
        type="button"
        onClick={() => onAbrir(etapa)}
        aria-haspopup="dialog"
        className={`mt-5 inline-flex shrink-0 items-center justify-center gap-2 rounded-full px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] transition-all duration-500 hover:-translate-y-0.5 ${
          oscura ? "bg-crema text-marron hover:bg-turquesa" : "superficie-caribe text-crema sombra-suave"
        }`}
      >
        Ver el detalle
        <Maximize2 className="size-4" />
      </button>
    </article>
  );
}

export default function Proceso() {
  const wrap = useRef(null);
  const track = useRef(null);
  const barra = useRef(null);
  const [abierta, setAbierta] = useState(null);

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
            herramienta del proceso deja su huella en el resultado final. Abre cualquier tarjeta para
            ver el material completo.
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
            <TarjetaEtapa key={etapa.id} etapa={etapa} onAbrir={setAbierta} />
          ))}

          {/* Cierre del recorrido */}
          <article className="flex h-[70vh] w-[86vw] shrink-0 flex-col items-center justify-center gap-6 rounded-[2.25rem] superficie-caribe p-10 text-center text-crema sombra-flotante sm:w-[30rem]">
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

      {abierta ? <ModalEtapa etapa={abierta} onCerrar={() => setAbierta(null)} /> : null}
    </section>
  );
}
