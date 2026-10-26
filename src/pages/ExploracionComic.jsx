import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Compass,
  ExternalLink,
} from "lucide-react";
import { gsap, prefiereMenosMovimiento } from "../lib/gsap.js";
import { asset } from "../lib/asset.js";
import { CAPITULOS } from "../data/comicExperiencia.js";
import {
  PARADAS,
  extrasDeParada,
  extraDeParada,
  grupoDeParada,
} from "../data/exploracionComic.js";
import { useProgresoComic } from "../hooks/useProgresoComic.js";
import { EscenarioExplorable } from "../components/comic/EscenarioExplorable.jsx";
import { PanelDivididoComic } from "../components/comic/PanelDivididoComic.jsx";
import { ModalExtraComic } from "../components/comic/ModalExtraComic.jsx";

export default function ExploracionComic() {
  const navigate = useNavigate();
  const { progreso, marcarExtra } = useProgresoComic();
  const [indice, setIndice] = useState(0);
  const [extraId, setExtraId] = useState(null);
  const [fusionado, setFusionado] = useState(false);
  const escenarioRef = useRef(null);
  const tituloRef = useRef(null);

  const parada = PARADAS[indice] ?? PARADAS[0];
  const grupo = useMemo(() => grupoDeParada(parada), [parada]);
  const extras = useMemo(() => extrasDeParada(parada), [parada]);
  const extraActual = useMemo(
    () => (extraId ? extraDeParada(parada, extraId) : null),
    [extraId, parada],
  );
  const capitulo = CAPITULOS.find((c) => c.id === parada.capitulo);
  const vistos = extras.filter((e) => progreso.extrasVistos.includes(e.id)).length;

  const irA = useCallback((nuevo) => {
    const destino = Math.max(0, Math.min(PARADAS.length - 1, nuevo));
    setExtraId(null);
    setFusionado(false);
    setIndice(destino);
  }, []);

  const abrirExtra = useCallback(
    (id) => {
      if (!id) return;
      setExtraId(id);
      marcarExtra(id);
    },
    [marcarExtra],
  );

  useEffect(() => {
    document.title = `${parada.titulo} · Exploración — SonArte`;
  }, [parada]);

  /* Entrada de la parada: solo transformaciones y opacidad. */
  useLayoutEffect(() => {
    const cont = escenarioRef.current;
    if (!cont) return;
    if (prefiereMenosMovimiento()) {
      gsap.set(cont, { opacity: 1, scale: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cont,
        { opacity: 0, scale: 1.015 },
        { opacity: 1, scale: 1, duration: 0.65, ease: "power3.out" },
      );
      if (tituloRef.current) {
        gsap.fromTo(
          tituloRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.5, delay: 0.08, ease: "power2.out" },
        );
      }
      const puntos = cont.querySelectorAll("[data-hotspot]");
      if (puntos.length) {
        gsap.fromTo(
          puntos,
          { opacity: 0, scale: 0.82 },
          { opacity: 1, scale: 1, duration: 0.4, delay: 0.18, stagger: 0.06, ease: "back.out(1.4)" },
        );
      }
    }, cont);

    return () => ctx.revert();
  }, [parada.id]);

  /* Navegación por teclado; el modal se lleva Escape y Tab. */
  useEffect(() => {
    const onKey = (e) => {
      if (extraId) return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        irA(indice + 1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        irA(indice - 1);
      } else if (e.key === "Escape") {
        e.preventDefault();
        navigate("/comic/experiencia");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [extraId, indice, irA, navigate]);

  return (
    <div className="relative flex h-svh flex-col overflow-hidden bg-[#080706] text-crema">
      <header className="shrink-0 border-b border-crema/10 bg-[#0b0908]/95 px-3 py-2.5 backdrop-blur-md sm:px-5">
        <div className="mx-auto flex max-w-[1500px] items-center gap-3">
          <Link
            to="/comic/experiencia"
            aria-label="Volver al cómic interactivo"
            className="grid size-9 shrink-0 place-items-center rounded-full border border-crema/15 text-crema/60 transition hover:border-crema/40 hover:text-crema"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
          </Link>

          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1.5 truncate text-[9px] font-semibold uppercase tracking-[0.24em] text-turquesa">
              <Compass className="size-3" aria-hidden="true" />
              Modo exploración · {indice + 1}/{PARADAS.length}
            </p>
            <p className="truncate font-serif text-sm leading-tight text-crema/85 sm:text-base">
              {parada.titulo}
            </p>
          </div>

          <Link
            to={`/comic/experiencia/${parada.grupoId}`}
            className="hidden shrink-0 items-center gap-1.5 rounded-full border border-crema/20 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-crema/60 transition hover:border-turquesa hover:text-turquesa sm:inline-flex"
          >
            Ver la pieza
            <ExternalLink className="size-3" aria-hidden="true" />
          </Link>
        </div>
      </header>

      <main className="min-h-0 flex-1 overflow-hidden">
        <div className="flex h-full flex-col">
          <div className="relative flex min-h-0 flex-1 flex-col items-center justify-center gap-3 px-2 py-2 sm:px-4">
            <div
              className="relative mx-auto aspect-video max-h-full overflow-hidden rounded-xl bg-black shadow-[0_28px_70px_-30px_rgba(0,0,0,0.95)] ring-1 ring-crema/10"
              style={{ width: "min(100%, calc((100svh - 13rem) * 16 / 9))" }}
            >
              <div ref={escenarioRef} className="h-full w-full">
                {parada.modo === "dividido" ? (
                  <PanelDivididoComic
                    key={parada.id}
                    parada={parada}
                    extrasVistos={progreso.extrasVistos}
                    onAbrirExtra={abrirExtra}
                    onContinuar={() => irA(indice + 1)}
                    onFusionado={setFusionado}
                  />
                ) : (
                  <EscenarioExplorable
                    key={parada.id}
                    parada={parada}
                    extrasVistos={progreso.extrasVistos}
                    onAbrirExtra={abrirExtra}
                  />
                )}
              </div>

              <div
                ref={tituloRef}
                className="pointer-events-none absolute inset-x-0 top-0 z-30 hidden items-start justify-between gap-3 bg-gradient-to-b from-[#080706]/75 via-[#080706]/10 to-transparent px-3 pb-8 pt-3 sm:flex sm:px-5 sm:pb-10 sm:pt-4"
              >
                <div className="min-w-0">
                  <p className="text-[8px] font-semibold uppercase tracking-[0.28em] text-turquesa sm:text-[9px]">
                    {capitulo?.nombre} · {parada.epoca}
                  </p>
                  <h1 className="mt-0.5 truncate font-serif text-xl leading-tight text-crema sm:text-3xl">
                    {parada.titulo}
                  </h1>
                </div>
                <span className="hidden shrink-0 rounded-full border border-crema/15 bg-[#080706]/55 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-crema/55 backdrop-blur-sm sm:inline-flex">
                  {vistos}/{extras.length} descubiertos
                </span>
              </div>

              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 hidden items-end justify-between gap-3 bg-gradient-to-t from-[#080706]/85 via-[#080706]/20 to-transparent px-3 pb-3 pt-8 sm:flex sm:px-5 sm:pb-4">
                <p className="max-w-[75%] text-[10px] leading-snug text-crema/70 sm:max-w-xl sm:text-xs">
                  {parada.modo === "dividido" && fusionado
                    ? "Los dos lados ya conviven en la misma escena. Sigue cuando quieras."
                    : parada.pista}
                </p>
                <span className="hidden shrink-0 items-center gap-1 text-[9px] uppercase tracking-[0.14em] text-crema/35 sm:flex">
                  <ChevronLeft className="size-3" aria-hidden="true" />
                  <ChevronRight className="size-3" aria-hidden="true" />
                  cambia de parada
                </span>
              </div>
            </div>

            {/* En vertical el escenario se queda en 16:9: aquí va la pista, legible. */}
            <div className="flex w-full max-w-[560px] items-start justify-between gap-3 rounded-xl border border-crema/10 bg-[#0b0908]/95 px-3.5 py-3 sm:hidden">
              <div className="min-w-0">
                <p className="text-[8px] font-semibold uppercase tracking-[0.2em] text-turquesa">
                  {capitulo?.nombre} · {parada.epoca}
                </p>
                <p className="mt-1 text-[11px] leading-snug text-crema/70">
                  {parada.modo === "dividido" && fusionado
                    ? "Los dos lados ya conviven en la misma escena. Sigue cuando quieras."
                    : parada.pista}
                </p>
              </div>
              <span className="shrink-0 rounded-full border border-crema/15 px-2 py-1 text-[9px] font-semibold text-crema/55">
                {vistos}/{extras.length}
              </span>
            </div>
          </div>

          <nav
            aria-label="Paradas de exploración"
            className="shrink-0 border-t border-crema/10 bg-[#0b0908]/95 px-2 py-2 backdrop-blur-md sm:px-5 sm:py-3"
          >
            <div className="mx-auto flex max-w-[1500px] items-center gap-2">
              <button
                type="button"
                onClick={() => irA(indice - 1)}
                disabled={indice === 0}
                aria-label="Parada anterior"
                className="grid size-8 shrink-0 place-items-center rounded-full border border-crema/15 text-crema/55 transition hover:border-crema/35 hover:text-crema disabled:cursor-not-allowed disabled:opacity-25 sm:size-9"
              >
                <ChevronLeft className="size-4" aria-hidden="true" />
              </button>

              <div className="flex min-w-0 flex-1 gap-1.5 overflow-x-auto py-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {PARADAS.map((p, i) => {
                  const activa = i === indice;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => irA(i)}
                      aria-current={activa ? "step" : undefined}
                      aria-label={`Parada ${i + 1}: ${p.titulo}`}
                      className={`group flex shrink-0 items-center gap-2 rounded-lg border px-2.5 py-1.5 text-left transition sm:min-w-[130px] ${
                        activa
                          ? "border-turquesa/60 bg-turquesa/10"
                          : "border-crema/10 bg-crema/[0.025] hover:border-crema/25 hover:bg-crema/[0.05]"
                      }`}
                    >
                      <span
                        className={`grid size-6 shrink-0 place-items-center rounded-full text-[9px] font-bold ${
                          activa ? "bg-turquesa text-marron" : "bg-crema/10 text-crema/55"
                        }`}
                      >
                        {i + 1}
                      </span>
                      <span className="min-w-0">
                        <span
                          className={`block truncate text-[9px] uppercase tracking-[0.14em] ${
                            activa ? "text-turquesa" : "text-crema/35"
                          }`}
                        >
                          {CAPITULOS.find((c) => c.id === p.capitulo)?.nombre}
                        </span>
                        <span
                          className={`block max-w-[100px] truncate text-[11px] ${
                            activa ? "text-crema" : "text-crema/60"
                          }`}
                        >
                          {p.titulo}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => irA(indice + 1)}
                disabled={indice === PARADAS.length - 1}
                aria-label="Parada siguiente"
                className="grid size-8 shrink-0 place-items-center rounded-full border border-crema/15 text-crema/55 transition hover:border-crema/35 hover:text-crema disabled:cursor-not-allowed disabled:opacity-25 sm:size-9"
              >
                <ChevronRight className="size-4" aria-hidden="true" />
              </button>
            </div>

            <div className="mx-auto mt-2 flex max-w-[1500px] items-center justify-between gap-3">
              <Link
                to="/comic/experiencia"
                className="text-[9px] font-semibold uppercase tracking-[0.16em] text-crema/30 transition hover:text-crema/60"
              >
                Volver al cómic
              </Link>
              <p className="hidden text-[9px] uppercase tracking-[0.16em] text-crema/25 sm:block">
                Flechas ← → para cambiar de parada · Esc para salir
              </p>
              <Link
                to={grupo ? `/comic/experiencia/${grupo.id}` : "/comic/experiencia"}
                className="inline-flex items-center gap-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-turquesa/70 transition hover:text-turquesa sm:hidden"
              >
                Ver la pieza
                <ArrowRight className="size-3" aria-hidden="true" />
              </Link>
            </div>
          </nav>
        </div>
      </main>

      {extraActual ? (
        <ModalExtraComic extra={extraActual} onCerrar={() => setExtraId(null)} />
      ) : null}

      {/* El logo se usa solo como marca de agua; no aporta información nueva. */}
      <img
        src={asset("/img/logo-icon.png")}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute bottom-24 right-3 hidden size-10 opacity-15 lg:block"
      />
    </div>
  );
}
