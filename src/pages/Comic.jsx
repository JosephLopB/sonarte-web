import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { gsap, prefiereMenosMovimiento } from "../lib/gsap.js";
import { Reveal } from "../components/Reveal.jsx";
import { ComicFondoSeccion } from "../components/ComicFondoSeccion.jsx";
import { FondoGrafico } from "../components/FondoGrafico.jsx";
import { VideoAutodetectado } from "../components/VideoAutodetectado.jsx";
import { ESCENARIOS } from "../data/escenarios.js";
import { PERSONAJES } from "../data/personajes.js";
import { asset } from "../lib/asset.js";

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
    <section className="relative min-h-screen overflow-hidden bg-crema pt-36 pb-24">
      <FondoGrafico densidad={5} />

      {/* El ingreso al cómic abre la página antes del teaser y los escenarios. */}
      <ComicFondoSeccion className="min-h-[min(820px,88svh)] px-5 py-24 text-crema sm:py-32">
        <div className="relative z-10 mx-auto grid min-h-[min(520px,62svh)] max-w-6xl items-center gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(16rem,0.7fr)] lg:gap-24">
          <Reveal>
            <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.3em] text-turquesa">
              <span className="h-px w-10 rounded-full bg-turquesa/60" aria-hidden="true" />
              La experiencia completa
            </p>
            <h2 className="mt-5 max-w-2xl font-serif text-5xl leading-[0.98] text-crema sm:text-6xl lg:text-7xl">
              Ábrelo y sube el <span className="text-turquesa">volumen</span>
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-crema/85">
              Prólogo y tres capítulos con sonido, exploración libre y ventanas transmedia. Entra a
              una historia que se escucha, se recorre y se toca.
            </p>
            <Link
              to="/comic/experiencia"
              className="mt-8 inline-flex items-center gap-3 rounded-full bg-turquesa px-8 py-4 font-serif text-lg text-marron shadow-[0_18px_45px_-20px_oklch(0.08_0.02_42/0.9)] transition-all duration-500 hover:-translate-y-1 hover:brightness-105"
            >
              <Play className="size-4 fill-current" />
              Entrar al cómic interactivo
              <ArrowRight className="size-5" aria-hidden="true" />
            </Link>
            <div className="mt-6">
              <Link
                to="/comic/evaluacion"
                className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-crema/65 underline decoration-crema/30 decoration-2 underline-offset-4 transition-colors hover:text-crema"
              >
                Ya lo leíste: cuéntanos cómo te fue
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.12} className="lg:justify-self-end">
            <ul className="space-y-5 border-l border-crema/35 pl-6 sm:pl-8">
              <li>
                <span className="block font-serif text-3xl text-crema">8 piezas</span>
                <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.2em] text-crema/65">
                  Prólogo y tres capítulos
                </span>
              </li>
              <li>
                <span className="block font-serif text-3xl text-crema">8–10 min</span>
                <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.2em] text-crema/65">
                  Una vida, de principio a fin
                </span>
              </li>
              <li>
                <span className="block font-serif text-3xl text-crema">Con sonido</span>
                <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.2em] text-crema/65">
                  Escenas y detalles para explorar
                </span>
              </li>
            </ul>
          </Reveal>
        </div>
      </ComicFondoSeccion>

      <div className="relative z-10 mx-auto max-w-5xl px-5">
        <Reveal>
          <h1 className="text-center font-serif text-5xl text-marron sm:text-6xl">
            El cómic <span className="text-verde-oscuro">SonArte</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-center text-lg leading-relaxed text-marron/80">
            «Joe Arroyo: El Centurión de la Noche» — prólogo y tres capítulos en un cómic digital
            interactivo transmedia. Explora, escucha y profundiza mientras lees.
          </p>
          <div className="mt-7 flex justify-center">
            <Link
              to="/comic/experiencia"
              className="inline-flex items-center gap-2.5 rounded-full bg-verde-oscuro px-7 py-3.5 text-sm font-bold uppercase tracking-[0.16em] text-crema shadow-[0_16px_36px_-20px_oklch(0.08_0.02_42/0.9)] transition hover:-translate-y-0.5 hover:brightness-110"
            >
              <Play className="size-4 fill-current" />
              Vivir la experiencia
            </Link>
          </div>
        </Reveal>

        {/* Teaser */}
        <Reveal dir="scale" delay={0.1} className="mt-12">
          <VideoAutodetectado
            ruta={asset("/media/teaser/teaser.mp4")}
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
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-6 bg-turquesa-medio">
              <div className="anim-rebote-logo">
                <img
                  src={asset("/img/logo-icon.png")}
                  alt="Cargando el cómic SonArte"
                  className="w-24 rounded-full bg-crema p-3 sombra-flotante"
                />
              </div>
              <span className="text-xs font-semibold uppercase tracking-[0.35em] text-marron/80">
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
      </div>

    </section>
  );
}
