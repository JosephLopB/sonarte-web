import { useEffect, useRef, useState } from "react";
import { Compass, X } from "lucide-react";
import { gsap, prefiereMenosMovimiento } from "../../lib/gsap.js";
import { paradaPorId, extraDeParada } from "../../data/exploracionComic.js";
import { EscenarioExplorable } from "./EscenarioExplorable.jsx";
import { PanelDivididoComic } from "./PanelDivididoComic.jsx";
import { ModalExtraComic } from "./ModalExtraComic.jsx";

/** Exploración contextual que se superpone al lector y vuelve a la pieza actual. */
export function ExploracionIntegrada({ grupo, extrasVistos = [], onMarcarExtra, onCerrar }) {
  const capa = useRef(null);
  const cerrarRef = useRef(onCerrar);
  const [extraId, setExtraId] = useState(null);
  const parada = paradaPorId(grupo.id);
  cerrarRef.current = onCerrar;

  useEffect(() => {
    if (prefiereMenosMovimiento() || !capa.current) return;
    const entrada = gsap.fromTo(
      capa.current,
      { autoAlpha: 0, scale: 0.99 },
      { autoAlpha: 1, scale: 1, duration: 0.42, ease: "power2.out", clearProps: "transform" },
    );
    return () => entrada.kill();
  }, []);

  useEffect(() => {
    const tecla = (evento) => {
      if (evento.key !== "Escape" || extraId) return;
      evento.preventDefault();
      evento.stopPropagation();
      cerrarRef.current?.();
    };
    window.addEventListener("keydown", tecla, true);
    return () => window.removeEventListener("keydown", tecla, true);
  }, [extraId]);

  if (!parada) return null;

  const abrirExtra = (id) => {
    if (!id) return;
    setExtraId(id);
    onMarcarExtra?.(id);
  };
  const extra = extraId ? extraDeParada(parada, extraId) : null;

  return (
    <section
      ref={capa}
      role="dialog"
      aria-modal="true"
      aria-label={`Exploración de ${grupo.titulo}`}
      className="fixed inset-0 z-[80] flex flex-col overflow-y-auto bg-[#0b0908]/[.98] text-crema backdrop-blur-xl"
    >
      <header className="mx-auto flex w-full max-w-[1500px] shrink-0 items-center gap-3 border-b border-crema/10 px-3 py-3 sm:px-6 sm:py-4">
        <span className="grid size-9 shrink-0 place-items-center rounded-full border border-turquesa/30 bg-turquesa/10 text-turquesa">
          <Compass className="size-4" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[9px] font-bold uppercase tracking-[0.22em] text-turquesa">Un detalle de esta historia</p>
          <h2 className="truncate font-serif text-base leading-tight sm:text-lg">{parada.titulo}</h2>
        </div>
        <button
          ref={(node) => { if (node && document.activeElement === document.body) node.focus(); }}
          type="button"
          onClick={onCerrar}
          className="inline-flex shrink-0 items-center gap-2 rounded-full border border-crema/20 px-3 py-2 text-[9px] font-bold uppercase tracking-[0.14em] text-crema/75 transition hover:border-turquesa/60 hover:text-turquesa sm:px-4"
        >
          <span className="hidden sm:inline">Volver a la lectura</span>
          <X className="size-4" aria-label="Cerrar exploración" />
        </button>
      </header>

      <div className="mx-auto flex w-full max-w-[1500px] flex-1 flex-col justify-center px-3 py-4 sm:px-6 sm:py-6">
        <p className="mb-3 text-center text-xs leading-relaxed text-crema/55 sm:mb-4 sm:text-sm">{parada.pista}</p>
        <div className="relative mx-auto aspect-video w-full max-w-6xl overflow-hidden rounded-xl border border-crema/10 bg-black shadow-[0_30px_100px_-35px_rgba(0,0,0,.95)] sm:rounded-2xl">
          {parada.modo === "dividido" ? (
            <PanelDivididoComic
              key={parada.id}
              parada={parada}
              extrasVistos={extrasVistos}
              onAbrirExtra={abrirExtra}
              onContinuar={onCerrar}
            />
          ) : (
            <EscenarioExplorable
              key={parada.id}
              parada={parada}
              extrasVistos={extrasVistos}
              onAbrirExtra={abrirExtra}
            />
          )}
        </div>
        <p className="mt-3 text-center text-[9px] uppercase tracking-[0.16em] text-crema/35 sm:mt-4">
          Explora a tu ritmo · al cerrar, la historia sigue donde la dejaste
        </p>
      </div>

      <ModalExtraComic extra={extra} onCerrar={() => setExtraId(null)} />
    </section>
  );
}
