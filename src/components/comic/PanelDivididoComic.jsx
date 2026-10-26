import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, RotateCcw } from "lucide-react";
import { gsap, prefiereMenosMovimiento } from "../../lib/gsap.js";
import { FondoEscena } from "./EscenarioExplorable.jsx";
import { extraDeParada } from "../../data/exploracionComic.js";

/**
 * Encrucijada: dos paneles reales, Seminario y Tesca. Se abren en cualquier
 * orden y, cuando están los dos, se funden en una sola viñeta.
 */
export function PanelDivididoComic({
  parada,
  extrasVistos = [],
  onAbrirExtra,
  onContinuar,
  onFusionado,
}) {
  const izquierda = useRef(null);
  const derecha = useRef(null);
  const fusionRef = useRef(null);
  const [vistos, setVistos] = useState([]);
  const [fusionado, setFusionado] = useState(false);
  const refs = { 0: izquierda, 1: derecha };

  const elegir = (indice) => {
    if (vistos.includes(indice)) return;
    setVistos((actual) => [...actual, indice]);
  };

  useEffect(() => {
    if (vistos.length < 2 || fusionado) return;
    const a = izquierda.current;
    const b = derecha.current;
    if (!a || !b) {
      setFusionado(true);
      return;
    }

    if (prefiereMenosMovimiento()) {
      gsap.set([a, b], { opacity: 0.15 });
      setFusionado(true);
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => setFusionado(true),
    });
    tl.to(a, { xPercent: -7, opacity: 0.16, duration: 0.85, ease: "power3.inOut" }, 0)
      .to(b, { xPercent: 7, opacity: 0.16, duration: 0.85, ease: "power3.inOut" }, 0);

    return () => {
      tl.kill();
    };
  }, [vistos, fusionado]);

  useEffect(() => {
    if (!fusionado || !fusionRef.current) return;
    onFusionado?.(true);
    if (prefiereMenosMovimiento()) {
      gsap.set(fusionRef.current, { opacity: 1 });
      return;
    }
    const tl = gsap.fromTo(
      fusionRef.current,
      { opacity: 0, y: 18, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "power3.out" },
    );
    return () => tl.kill();
  }, [fusionado]);

  const reiniciar = () => {
    setVistos([]);
    setFusionado(false);
    onFusionado?.(false);
    gsap.set([izquierda.current, derecha.current], { xPercent: 0, opacity: 1 });
  };

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#0b0908]">
      <div className="flex h-full w-full">
        {parada.paneles.map((panel, indice) => {
          const visto = vistos.includes(indice);
          return (
            <button
              key={panel.id}
              ref={refs[indice]}
              type="button"
              onClick={() => elegir(indice)}
              aria-pressed={visto}
              aria-label={`${panel.titulo}. ${visto ? "Visto" : "Toca para abrir este lado"}`}
              className={`group relative min-w-0 flex-1 overflow-hidden text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-turquesa ${
                indice > 0 ? "border-l-2 border-crema/25" : ""
              } ${visto || fusionado ? "cursor-default" : "cursor-pointer"}`}
            >
              <FondoEscena fondo={panel.fondo} className="h-full w-full" />
              <div
                className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${
                  visto ? "bg-[#080706]/20" : "bg-[#080706]/45 group-hover:bg-[#080706]/25"
                }`}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080706]/90 via-transparent to-[#080706]/45" />

              <div className="absolute inset-x-0 top-12 z-20 px-3 sm:top-16 sm:px-5">
                <p className="w-fit rounded-md border border-crema/15 bg-[#080706]/65 px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.2em] text-turquesa backdrop-blur-sm sm:text-[9px]">
                  {panel.titulo}
                </p>
                <p className="mt-1 w-fit max-w-[90%] text-[10px] leading-snug text-crema/70 sm:text-xs">
                  {panel.nota}
                </p>
              </div>

              <div className="absolute inset-x-0 bottom-0 z-20 p-3 sm:p-5">
                <p
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] sm:text-[10px] ${
                    visto
                      ? "bg-turquesa text-marron"
                      : "bg-salmon text-marron anim-flotar"
                  }`}
                >
                  {visto ? (
                    <>
                      <Check className="size-3" aria-hidden="true" /> Visto
                    </>
                  ) : (
                    "Toca para entrar"
                  )}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {vistos.length === 1 && !fusionado ? (
        <p className="pointer-events-none absolute inset-x-0 top-1/2 z-30 mx-auto w-fit -translate-y-1/2 rounded-full border border-crema/15 bg-[#080706]/70 px-3 py-1.5 text-center text-[10px] text-crema/75 backdrop-blur-sm">
          Falta el otro lado. Los dos terminan uniéndose.
        </p>
      ) : null}

      {fusionado ? (
        <div
          ref={fusionRef}
          className="absolute inset-0 z-40 grid place-items-center bg-[#080706]/55 px-5 text-center backdrop-blur-[2px]"
        >
          <div className="max-w-md">
            <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-turquesa">
              La encrucijada
            </p>
            <h3 className="mt-2 font-serif text-3xl leading-tight text-crema sm:text-4xl">
              {parada.fusion.titulo}
            </h3>
            <p className="mt-3 font-serif text-sm leading-relaxed text-crema/75 sm:text-base">
              {parada.fusion.texto}
            </p>

            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {parada.fusion.extras.map((id) => {
                const extra = extraDeParada(parada, id);
                if (!extra) return null;
                const visto = extrasVistos.includes(id);
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => onAbrirExtra?.(id)}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.14em] transition ${
                      visto
                        ? "border-turquesa/70 bg-turquesa/15 text-turquesa"
                        : "border-crema/25 text-crema/75 hover:border-salmon hover:text-salmon"
                    }`}
                  >
                    {visto ? <Check className="size-3" aria-hidden="true" /> : null}
                    {extra.titulo}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={onContinuar}
                className="inline-flex items-center gap-2 rounded-full bg-turquesa px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.16em] text-marron transition hover:brightness-105"
              >
                Seguir el recorrido
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={reiniciar}
                className="inline-flex items-center gap-1.5 rounded-full border border-crema/15 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-crema/45 transition hover:border-crema/35 hover:text-crema/75"
              >
                <RotateCcw className="size-3" aria-hidden="true" />
                Volver a elegir
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
