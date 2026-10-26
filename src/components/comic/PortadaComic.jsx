import { Link } from "react-router-dom";
import { ArrowLeft, Compass, LayoutGrid, Play, Sparkles } from "lucide-react";
import { asset } from "../../lib/asset.js";
import { CAPITULOS, GRUPOS, grupoPorId } from "../../data/comicExperiencia.js";

export function PortadaComic({ progreso, onEmpezar, onContinuar, onIndice }) {
  const ultimo = grupoPorId(progreso?.escenaId);
  const completadas = progreso?.completadas ?? [];
  const hayProgreso = Boolean(ultimo && progreso?.escenaId);

  return (
    <div className="relative min-h-svh overflow-x-hidden overflow-y-auto bg-[#0b0908] text-crema">
      <div className="absolute inset-0">
        <img
          src={asset("/marca/portada.png")}
          alt=""
          className="h-full w-full object-cover opacity-45"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b0908]/85 via-[#0b0908]/60 to-[#0b0908]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_25%,oklch(0.5375_0.1098_42.28/0.25),transparent_55%)]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-svh max-w-6xl flex-col px-5 py-5 sm:px-8 sm:py-7">
        <header className="flex items-center justify-between gap-4">
          <Link
            to="/comic"
            className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-crema/55 transition hover:text-crema"
          >
            <ArrowLeft className="size-3.5" />
            Volver al sitio
          </Link>
          <div className="rounded-full border border-crema/15 bg-crema/5 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.22em] text-crema/60">
            SonArte · Cómic interactivo
          </div>
        </header>

        <div className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-14 lg:py-12">
          <div>
            <div className="w-fit rounded-3xl bg-crema px-5 py-3 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.8)]">
              <img
                src={asset("/img/logo-full.png")}
                alt="SonArte"
                className="h-12 w-auto sm:h-14"
              />
            </div>

            <p className="mt-8 text-[10px] font-semibold uppercase tracking-[0.42em] text-turquesa">
              Cómic digital interactivo
            </p>
            <h1 className="mt-3 font-serif text-5xl leading-[0.92] tracking-tight text-crema sm:text-6xl lg:text-7xl">
              Joe Arroyo
              <span className="mt-2 block text-turquesa">El Centurión de la Noche</span>
            </h1>

            <p className="mt-6 max-w-xl border-l-2 border-terracota/70 pl-4 font-serif text-lg leading-relaxed text-crema/75 sm:text-xl">
              «Yo soy la sombra que guarda el ritmo. Y esto que estás por ver no es solo una
              historia... es la anatomía de un trueno.»
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={hayProgreso ? onContinuar : onEmpezar}
                className="group inline-flex items-center gap-3 rounded-full bg-turquesa px-7 py-3.5 text-sm font-bold uppercase tracking-[0.18em] text-marron shadow-[0_18px_40px_-18px_oklch(0.7965_0.1164_174.08/0.7)] transition hover:-translate-y-0.5 hover:brightness-105"
              >
                <Play className="size-4 fill-current" />
                {hayProgreso ? `Continuar: ${ultimo.titulo}` : "Abrir el telón"}
              </button>

              <button
                type="button"
                onClick={onIndice}
                className="inline-flex items-center gap-2 rounded-full border border-crema/25 px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-crema/75 transition hover:border-crema/50 hover:bg-crema/5 hover:text-crema"
              >
                <LayoutGrid className="size-4" />
                Ver capítulos
              </button>

              <Link
                to="/comic/experiencia/explorar"
                className="inline-flex items-center gap-2 rounded-full border border-turquesa/35 bg-turquesa/[0.06] px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-turquesa transition hover:border-turquesa/70 hover:bg-turquesa/10 hover:text-crema"
              >
                <Compass className="size-4" />
                Explorar escenarios
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-crema/40">
              <span>Prólogo + 3 capítulos</span>
              <span className="size-1 rounded-full bg-crema/30" />
              <span>{GRUPOS.length} piezas</span>
              <span className="size-1 rounded-full bg-crema/30" />
              <span>≈ 8–10 min</span>
              <span className="size-1 rounded-full bg-crema/30" />
              <span className="inline-flex items-center gap-1.5 text-turquesa/80">
                <Sparkles className="size-3" />
                Con sonido
              </span>
            </div>

            {hayProgreso ? (
              <p className="mt-4 text-[11px] text-crema/40">
                {completadas.length} de {GRUPOS.length} piezas completadas en este dispositivo.
                {ultimo ? ` Te quedaste en «${ultimo.titulo}».` : ""}
              </p>
            ) : null}
          </div>

          <aside className="relative lg:pl-6">
            <div className="rounded-3xl border border-crema/15 bg-[#14110f]/80 p-5 backdrop-blur-md sm:p-6">
              <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-salmon">
                El recorrido
              </p>
              <p className="mt-2 font-serif text-2xl leading-tight text-crema">
                Del barrio Nariño a la estatua del Parque de los Músicos.
              </p>
              <p className="mt-2 text-sm leading-relaxed text-crema/55">
                Una vida en ocho piezas: la calle, el Seminario, Radio Vigía, Fruko, La Verdad,
                el hospital, el mundo y la voz que sigue sonando.
              </p>

              <ol className="mt-5 space-y-2.5">
                {CAPITULOS.map((cap, i) => {
                  const piezas = GRUPOS.filter((g) => g.capitulo === cap.id);
                  const hechas = piezas.filter((g) => completadas.includes(g.id)).length;
                  return (
                    <li key={cap.id} className="flex items-center gap-3">
                      <span className="grid size-7 shrink-0 place-items-center rounded-full border border-crema/15 text-[10px] font-semibold text-crema/55">
                        {i === 0 ? "P" : i}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-serif text-sm text-crema/85">
                          {cap.titulo}
                        </span>
                        <span className="block text-[9px] uppercase tracking-[0.18em] text-crema/35">
                          {piezas.length} {piezas.length === 1 ? "pieza" : "piezas"} · {hechas} vistas
                        </span>
                      </span>
                      <span className="h-1 w-10 overflow-hidden rounded-full bg-crema/10">
                        <span
                          className="block h-full rounded-full bg-turquesa/70"
                          style={{ width: `${piezas.length ? (hechas / piezas.length) * 100 : 0}%` }}
                        />
                      </span>
                    </li>
                  );
                })}
              </ol>

              <p className="mt-5 border-t border-crema/10 pt-4 text-[10px] leading-relaxed text-crema/35">
                Puedes saltar, volver y reanudar. El progreso se guarda solo en este navegador.
              </p>
            </div>

            <div className="pointer-events-none absolute -right-6 -top-6 hidden rotate-6 rounded-2xl border border-terracota/40 bg-terracota/15 px-4 py-3 text-[9px] font-semibold uppercase tracking-[0.22em] text-crema/80 backdrop-blur-sm lg:block">
              Proyecto transmedia
              <span className="mt-0.5 block font-serif text-base normal-case tracking-normal text-crema">
                SonArte
              </span>
            </div>
          </aside>
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-crema/10 pt-4 text-[9px] uppercase tracking-[0.18em] text-crema/30">
          <span>SonArte · Editorial web multimedia · {new Date().getFullYear()}</span>
          <span>Inspirado en la vida y la música de Joe Arroyo</span>
        </footer>
      </div>
    </div>
  );
}
