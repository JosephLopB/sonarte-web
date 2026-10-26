import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { gsap, prefiereMenosMovimiento } from "../../lib/gsap.js";
import { ContenidoExtra } from "./ContenidoExtra.jsx";

/** Ventana de un extra descubierto en la exploración. */
export function ModalExtraComic({ extra, onCerrar }) {
  const fondo = useRef(null);
  const caja = useRef(null);
  const cerrar = useRef(null);
  const panel = useRef(null);

  useEffect(() => {
    if (!extra) return;
    const anterior = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    if (!prefiereMenosMovimiento()) {
      const tl = gsap.timeline();
      if (fondo.current) tl.fromTo(fondo.current, { opacity: 0 }, { opacity: 1, duration: 0.25 });
      if (caja.current) {
        tl.fromTo(
          caja.current,
          { opacity: 0, y: 26, scale: 0.97 },
          { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(1.35)" },
          "-=0.12",
        );
      }
    }

    const foco = window.setTimeout(() => cerrar.current?.focus(), 40);

    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        onCerrar();
        return;
      }
      if (e.key !== "Tab" || !panel.current) return;
      const focusables = panel.current.querySelectorAll(
        'button:not([disabled]), a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables.length) return;
      const primero = focusables[0];
      const ultimo = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === primero) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primero.focus();
      }
    };

    document.addEventListener("keydown", onKey, true);
    return () => {
      window.clearTimeout(foco);
      document.removeEventListener("keydown", onKey, true);
      document.body.style.overflow = overflow;
      anterior?.focus?.();
    };
  }, [extra, onCerrar]);

  if (!extra) return null;

  return (
    <div
      ref={fondo}
      role="dialog"
      aria-modal="true"
      aria-label={extra.titulo}
      className="fixed inset-0 z-[90] flex items-end justify-center bg-black/80 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCerrar();
      }}
    >
      <div
        ref={(nodo) => {
          caja.current = nodo;
          panel.current = nodo;
        }}
        className="flex max-h-[88svh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl border border-crema/15 bg-[#151210] shadow-2xl sm:rounded-3xl"
      >
        <header className="flex items-start justify-between gap-4 border-b border-crema/10 px-5 pb-3 pt-4 sm:px-6">
          <div className="min-w-0">
            <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-turquesa">
              {extra.etiqueta}
            </p>
            <h2 className="mt-1 font-serif text-2xl leading-tight text-crema sm:text-3xl">
              {extra.titulo}
            </h2>
          </div>
          <button
            ref={cerrar}
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar extra"
            className="grid size-9 shrink-0 place-items-center rounded-full border border-crema/20 text-crema/70 transition hover:bg-crema/10 hover:text-crema"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
          {extra.intro ? (
            <p className="mb-4 font-serif text-sm leading-relaxed text-crema/60 sm:text-base">
              {extra.intro}
            </p>
          ) : null}
          <ContenidoExtra extra={extra} />
        </div>

        <footer className="border-t border-crema/10 px-5 py-2.5 text-center text-[9px] uppercase tracking-[0.18em] text-crema/35 sm:px-6">
          Esc para cerrar · vuelve a la escena cuando quieras
        </footer>
      </div>
    </div>
  );
}
