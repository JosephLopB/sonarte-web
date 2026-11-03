import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { gsap, ScrollTrigger, prefiereMenosMovimiento } from "../lib/gsap.js";
import { Reveal } from "../components/Reveal.jsx";
import { TeaserComic } from "../components/TeaserComic.jsx";
import { ComicFondoSeccion } from "../components/ComicFondoSeccion.jsx";
import { leerProgreso } from "../hooks/useProgresoComic.js";
import { GRUPOS, grupoPorId } from "../data/comicExperiencia.js";
import { FondoGrafico, OlasFlotantes } from "../components/FondoGrafico.jsx";
import { EscenaPersonajes } from "../components/EscenaPersonajes.jsx";
import { Espiral, EspiralDoble, PulsoSon, TrazoPincel, VinetaComic, Onda } from "../components/Espirales.jsx";
import { MARCA, QUE_HACEMOS } from "../data/marca.js";

const iconos = {
  vineta: VinetaComic,
  pulso: PulsoSon,
  pincel: TrazoPincel,
  "espiral-doble": EspiralDoble,
};

const tonos = ["text-terracota", "text-turquesa-medio", "text-salmon", "text-verde-oscuro"];

export default function Home() {
  const heroRef = useRef(null);
  const logoRef = useRef(null);
  /* Lectura única: si alguien está a mitad del cómic, el inicio se lo recuerda. */
  const [progreso] = useState(leerProgreso);
  const ultimaPieza = progreso.escenaId ? grupoPorId(progreso.escenaId) : null;

  useEffect(() => {
    if (prefiereMenosMovimiento()) {
      gsap.set(heroRef.current?.querySelectorAll("[data-anim]") ?? [], { opacity: 1, y: 0 });
      return;
    }

    /* Entrada del hero */
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(
      heroRef.current.querySelectorAll("[data-anim]"),
      { opacity: 0, y: 38 },
      { opacity: 1, y: 0, duration: 0.95, stagger: 0.14 },
    );

    /* Parallax de scroll sobre el logo */
    const st = ScrollTrigger.create({
      trigger: heroRef.current,
      start: "top top",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        gsap.set(logoRef.current, {
          y: self.progress * 140,
          scale: 1 - self.progress * 0.18,
          opacity: 1 - self.progress * 1.2,
        });
      },
    });

    return () => {
      tl.kill();
      st.kill();
    };
  }, []);

  return (
    <>
      {/* Sección 1 — Editorial web multimedia */}
      <section ref={heroRef} className="relative flex min-h-screen items-center overflow-hidden bg-crema pt-32 pb-40">
        <FondoGrafico />
        <OlasFlotantes />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent via-crema/70 to-crema" aria-hidden="true" />

        <div className="relative z-10 mx-auto max-w-3xl px-5 text-center">
          <img
            data-anim
            ref={logoRef}
            src={MARCA.espiral}
            alt="Espiral SonArte"
            width="391"
            height="288"
            className="mx-auto w-64 max-w-full anim-flotar sm:w-80"
            style={{ opacity: 0 }}
          />
          <h1 data-anim className="mt-8 font-serif text-4xl leading-tight text-marron sm:text-5xl" style={{ opacity: 0 }}>
            El folclore colombiano vuelve a sonar, <span className="texto-espiral">dibujado</span>.
          </h1>
          <p data-anim className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground" style={{ opacity: 0 }}>
            {MARCA.intro}
          </p>
          <div data-anim className="mt-9 flex flex-wrap justify-center gap-4" style={{ opacity: 0 }}>
            <Link
              to="/comic/experiencia"
              className="group inline-flex items-center gap-2 rounded-full superficie-caribe px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.16em] text-crema sombra-suave transition-all duration-500 hover:-translate-y-1 hover:sombra-flotante"
            >
              Abrir el cómic
              <Espiral className="size-4 transition-transform duration-700 group-hover:rotate-180" />
            </Link>
            <Link
              to="/proceso"
              className="inline-flex items-center gap-2 rounded-full border-2 border-terracota px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.16em] text-terracota transition-all duration-500 hover:-translate-y-1 hover:bg-terracota hover:text-crema"
            >
              Ver el proceso
            </Link>
          </div>

          <div data-anim className="mt-5" style={{ opacity: 0 }}>
            <Link
              to="/comic"
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-marron/55 underline decoration-terracota/30 decoration-2 underline-offset-4 transition-colors hover:text-terracota"
            >
              Ver las ocho piezas, el guion y los extras
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          </div>

          {ultimaPieza ? (
            <div data-anim className="mt-7 flex justify-center" style={{ opacity: 0 }}>
              <Link
                to={`/comic/experiencia/${progreso.escenaId}`}
                className="group inline-flex max-w-full items-center gap-3 rounded-full border border-terracota/30 bg-crema/85 px-5 py-2.5 text-left backdrop-blur-sm transition-all duration-500 hover:-translate-y-0.5 hover:border-terracota/60 hover:sombra-suave"
              >
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-terracota/10 text-terracota">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4" aria-hidden="true">
                    <path d="M3 12a9 9 0 1 0 3-6.7" strokeLinecap="round" />
                    <path d="M3 4v5h5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="min-w-0">
                  <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-terracota">
                    Seguir donde ibas
                  </span>
                  <span className="block truncate font-serif text-base text-marron">
                    «{ultimaPieza.titulo}»
                  </span>
                </span>
                <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.16em] text-marron/45">
                  {progreso.completadas.length} de {GRUPOS.length}
                </span>
              </Link>
            </div>
          ) : null}
        </div>
      </section>

      {/* Sección 1b — La invitación: la viñeta que se mueve */}
      <ComicFondoSeccion className="py-24 text-crema sm:py-28">
        <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-14 px-5 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
          <Reveal>
            <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.3em] text-turquesa">
              <span className="h-px w-10 rounded-full bg-turquesa/50" aria-hidden="true" />
              El cómic
            </p>
            <h2 className="mt-5 font-serif text-4xl leading-[1.05] text-crema sm:text-5xl">
              Ocho piezas para una vida que <span className="text-turquesa">se toca</span>
            </h2>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-crema/70">
              El barrio, el Seminario, Radio Vigía, el hospital, el mundo. «Joe Arroyo: El Centurión
              de la Noche» se recorre en menos de diez minutos, con sonido, luces que responden al
              cursor y decisiones que cambian lo que sigue.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-crema/45">
              <span>Prólogo + 3 capítulos</span>
              <span className="size-1 rounded-full bg-crema/25" aria-hidden="true" />
              <span>≈ 8–10 min</span>
              <span className="size-1 rounded-full bg-crema/25" aria-hidden="true" />
              <span>Con sonido</span>
            </div>

            <Link
              to="/comic"
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-crema/25 px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-crema/80 transition-all duration-500 hover:-translate-y-0.5 hover:border-crema/50 hover:bg-crema/5 hover:text-crema"
            >
              Ver el índice completo
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Reveal>

          <Reveal dir="scale" delay={0.12} className="pt-6">
            <TeaserComic />
          </Reveal>
        </div>
      </ComicFondoSeccion>

      {/* Sección 2 — ¿Qué hacemos? */}
      <section className="relative overflow-hidden superficie-mar py-28">
        <FondoGrafico densidad={3} />
        <div className="relative z-10 mx-auto max-w-6xl px-5">
          <Reveal>
            <h2 className="text-center font-serif text-4xl text-marron sm:text-5xl">¿Qué hacemos?</h2>
            <p className="mx-auto mt-5 max-w-2xl text-center text-lg text-marron/75">
              Creamos contenidos que celebran lo nuestro: un puente entre las raíces culturales del país y quienes hoy leen en pantalla.
            </p>
          </Reveal>

          <div className="mt-16 grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {QUE_HACEMOS.map((t, i) => {
              const Icono = iconos[t.icon] ?? Espiral;
              return (
                <Reveal key={t.titulo} dir="up" delay={i * 0.1} className="h-full">
                  <article className="group relative flex h-full flex-col overflow-hidden rounded-[1.25rem] border-[3px] border-marron bg-crema p-6 pt-8 shadow-[7px_7px_0_0_var(--color-marron)] transition-all duration-300 hover:-translate-y-1.5 hover:rotate-[-1deg] hover:shadow-[9px_9px_0_0_var(--color-terracota)]">
                    <span className="trama-benday pointer-events-none absolute inset-x-0 top-0 h-24 opacity-35" aria-hidden="true" />
                    <span className="absolute right-5 top-5 font-impacto text-3xl leading-none text-marron/20">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className={`relative grid size-14 shrink-0 place-items-center rounded-full border-[3px] border-marron bg-crema ${tonos[i % tonos.length]}`}>
                      <Icono className="size-7" />
                    </span>
                    <h3 className="relative mt-5 font-serif text-2xl text-marron">{t.titulo}</h3>
                    <p className="relative mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{t.texto}</p>
                    <span className="relative mt-5 block h-1.5 w-12 rounded-full superficie-caribe transition-all duration-500 group-hover:w-24" />
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Sección 3 — Revista SonArte */}
      <section className="relative overflow-hidden textura-espuma pt-40 pb-44">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-turquesa-medio to-transparent" aria-hidden="true" />
        <div className="relative z-10 mx-auto max-w-5xl px-5">
          <Reveal dir="scale">
            <h2 className="text-center font-serif text-4xl text-verde-oscuro sm:text-5xl">Revista SonArte</h2>
            <p className="mx-auto mt-5 max-w-2xl text-center text-lg text-verde-oscuro/85">
              Nuestra publicación digital: entrevistas, ilustración, memoria musical y el detrás de cámaras del universo SonArte.
            </p>
          </Reveal>

          <Reveal dir="up" delay={0.15}>
            <div className="mt-12 overflow-hidden rounded-[2rem] border-4 border-crema bg-crema sombra-flotante">
              <iframe
                title="Revista SonArte"
                src={MARCA.revistaUrl}
                className="h-[62vh] min-h-[420px] w-full"
                allowFullScreen
                loading="lazy"
              />
            </div>
          </Reveal>

          <Reveal delay={0.25}>
            <div className="mt-9 text-center">
              <Link
                to="/revista"
                className="inline-flex items-center gap-2 rounded-full bg-verde-oscuro px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.16em] text-crema transition-all duration-500 hover:-translate-y-1 hover:bg-marron"
              >
                Ver la revista completa
              </Link>
            </div>
          </Reveal>
        </div>
        <Onda className="absolute inset-x-0 bottom-24 h-16 w-full text-crema/40" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-b from-transparent via-crema/70 to-crema" aria-hidden="true" />
      </section>

      {/* Sección 4 — Más sobre nosotros con parallax de personajes */}
      <section className="relative overflow-hidden bg-crema py-28">
        <FondoGrafico densidad={4} />
        <div className="relative z-10 mx-auto max-w-5xl px-5">
          <Reveal>
            <h2 className="text-center font-serif text-4xl text-marron sm:text-5xl">Más sobre nosotros</h2>
            <p className="mx-auto mt-5 max-w-2xl text-center text-lg text-muted-foreground">
              Detrás de cada trazo hay una investigación sobre Joe Arroyo, Cartagena y el son que cruzó el Caribe. Mueve el cursor: los personajes te siguen.
            </p>
          </Reveal>

          <Reveal dir="scale" delay={0.15} className="mt-14">
            <EscenaPersonajes />
          </Reveal>

          <Reveal delay={0.25}>
            <div className="mt-14 flex flex-wrap justify-center gap-4">
              <Link
                to="/nosotros"
                className="inline-flex items-center gap-2 rounded-full border-2 border-terracota px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.16em] text-terracota transition-all duration-500 hover:-translate-y-1 hover:bg-terracota hover:text-crema"
              >
                Conoce la marca
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
