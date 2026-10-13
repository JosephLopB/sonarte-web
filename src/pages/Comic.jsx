import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { gsap, prefiereMenosMovimiento } from "../lib/gsap.js";
import { Reveal } from "../components/Reveal.jsx";
import { FondoGrafico } from "../components/FondoGrafico.jsx";
import { VideoAutodetectado } from "../components/VideoAutodetectado.jsx";
import { ESCENARIOS } from "../data/escenarios.js";
import { PERSONAJES } from "../data/personajes.js";
import { MARCA } from "../data/marca.js";

export default function Comic() {
  const [cargando, setCargando] = useState(true);
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const figura = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setCargando(false), 1900);
    return () => clearTimeout(t);
  }, []);

  const total = ESCENARIOS.length;
  const ir = (paso) => {
    setDir(paso);
    setI((v) => (v + paso + total) % total);
  };
  const escena = ESCENARIOS[i] ?? ESCENARIOS[0];

  /* Transición GSAP del carrusel */
  useLayoutEffect(() => {
    if (cargando || !figura.current || prefiereMenosMovimiento()) return;
    const anim = gsap.fromTo(
      figura.current,
      { opacity: 0, x: dir * 90, scale: 0.97 },
      { opacity: 1, x: 0, scale: 1, duration: 0.85, ease: "power3.out" },
    );
    return () => anim.kill();
  }, [i, cargando, dir]);

  return (
    <section className="relative min-h-screen overflow-hidden bg-salmon pt-36 pb-24">
      <FondoGrafico densidad={5} />

      <div className="relative z-10 mx-auto max-w-5xl px-5">
        <Reveal>
          <h1 className="text-center font-serif text-5xl text-marron sm:text-6xl">
            El cómic <span className="text-verde-oscuro">SonArte</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-center text-lg leading-relaxed text-marron/80">
            «Joe Arroyo: El Centurión de la Noche» — prólogo y tres capítulos en un cómic digital
            interactivo transmedia. Explora, escucha y profundiza mientras lees.
          </p>
        </Reveal>

        {/* Teaser */}
        <Reveal dir="scale" delay={0.1} className="mt-12">
          <VideoAutodetectado
            ruta="/media/teaser/teaser.mp4"
            titulo="Teaser del proyecto"
            nota="Pega tu video en public/media/teaser/teaser.mp4 y aparecerá aquí automáticamente."
          />
        </Reveal>
      </div>

      {/* Carrusel de escenarios a sangre: ocupa todo el ancho, sin marco */}
      <Reveal delay={0.15} className="relative z-10 mt-12 w-full">
        <div className="relative aspect-[16/10] max-h-[78vh] w-full sm:aspect-[21/9]">
          <figure ref={figura} className="absolute inset-0">
            <img
              src={escena.src}
              alt={`Escenario del cómic SonArte: ${escena.titulo}`}
              className="h-full w-full object-cover"
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-marron via-marron/75 to-transparent pb-9 pt-24">
              <div className="mx-auto max-w-5xl px-5">
                <h2 className="font-serif text-3xl text-crema sm:text-4xl">{escena.titulo}</h2>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-crema/85 sm:text-base">
                  {escena.texto}
                </p>
              </div>
            </figcaption>
          </figure>

          {cargando ? (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-6 bg-salmon">
              <div className="anim-rebote-logo">
                <img
                  src="/img/logo-icon.png"
                  alt="Cargando el cómic SonArte"
                  className="w-24 rounded-full bg-crema p-3 sombra-flotante"
                />
              </div>
              <span className="text-xs font-semibold uppercase tracking-[0.35em] text-marron/70">
                Afinando instrumentos
              </span>
            </div>
          ) : null}
        </div>
      </Reveal>

      <div className="relative z-10 mx-auto max-w-5xl px-5">
        {!cargando ? (
          <div className="mt-8 flex items-center justify-center gap-5">
            <button
              type="button"
              onClick={() => ir(-1)}
              aria-label="Escenario anterior"
              className="grid size-12 place-items-center rounded-full border-2 border-marron/30 text-marron transition-all duration-500 hover:-translate-x-1 hover:border-verde-oscuro hover:text-verde-oscuro"
            >
              <ChevronLeft className="size-5" />
            </button>
            <div className="flex items-center gap-2.5">
              {ESCENARIOS.map((e, k) => (
                <button
                  key={e.titulo}
                  type="button"
                  onClick={() => {
                    setDir(k > i ? 1 : -1);
                    setI(k);
                  }}
                  aria-label={`Ir al escenario ${e.titulo}`}
                  aria-current={k === i}
                  className={`h-2.5 rounded-full transition-all duration-500 ${
                    k === i ? "w-10 bg-verde-oscuro" : "w-2.5 bg-marron/30 hover:bg-marron/50"
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => ir(1)}
              aria-label="Escenario siguiente"
              className="grid size-12 place-items-center rounded-full border-2 border-marron/30 text-marron transition-all duration-500 hover:translate-x-1 hover:border-verde-oscuro hover:text-verde-oscuro"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        ) : null}

        {/* Personajes */}
        <Reveal className="mt-20">
          <h2 className="text-center font-serif text-4xl text-marron">Los tres Joe</h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-marron/75">
            Una misma vida en tres edades y tres maneras de habitar la música.
          </p>
        </Reveal>
        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {PERSONAJES.map((p, k) => (
            <Reveal key={p.nombre} dir="up" delay={k * 0.12} className="h-full">
              <article className="group flex h-full flex-col rounded-[1.5rem] border-[3px] border-marron bg-crema p-6 text-center shadow-[6px_6px_0_0_var(--color-marron)] transition-transform duration-300 hover:-translate-y-1.5">
                <img
                  src={p.src}
                  alt={`${p.nombre} del cómic SonArte`}
                  className="mx-auto h-64 w-auto object-contain drop-shadow-[0_18px_22px_oklch(0.08_0.02_42/0.35)] transition-transform duration-700 group-hover:-translate-y-2"
                  loading="lazy"
                />
                <h3 className="mt-5 font-serif text-2xl text-marron">{p.nombre}</h3>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-terracota">{p.edad}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.nota}</p>
              </article>
            </Reveal>
          ))}
        </div>

        {/* CTA al cómic interactivo */}
        <Reveal dir="scale" delay={0.1} className="mt-20">
          <div className="rounded-[2.5rem] superficie-profunda p-10 text-center sombra-flotante sm:p-14">
            <p className="font-serif text-sm uppercase tracking-[0.35em] text-crema/85">La experiencia completa</p>
            <h2 className="mt-4 font-serif text-4xl text-crema sm:text-5xl">Ábrelo y sube el volumen</h2>
            <p className="mx-auto mt-4 max-w-xl text-crema/90">
              17 escenas con sonido, exploración libre y ventanas transmedia. El cómic interactivo
              se abre en una experiencia a pantalla completa.
            </p>
            <a
              href={MARCA.comicUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex items-center gap-3 rounded-full bg-crema px-10 py-4 font-serif text-lg text-marron transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl"
            >
              Entrar al cómic interactivo
              <ExternalLink className="size-5" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
