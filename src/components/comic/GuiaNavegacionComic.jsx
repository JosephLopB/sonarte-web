import { useEffect, useRef } from "react";
import {
  BookOpen,
  ChevronRight,
  Compass,
  Home,
  LayoutGrid,
  Maximize2,
  X,
} from "lucide-react";

const CONTROLES = [
  {
    icono: ChevronRight,
    titulo: "Avanza o vuelve",
    descripcion: "Usa las flechas de la barra para pasar de pieza o regresar a la anterior.",
  },
  {
    icono: LayoutGrid,
    titulo: "Elige una escena",
    descripcion: "Abre el índice para saltar a cualquier pieza y consultar tu progreso.",
  },
  {
    icono: BookOpen,
    titulo: "Lee el guion y los extras",
    descripcion: "Encuentra el guion, contexto y contenidos adicionales de cada escena.",
  },
  {
    icono: Compass,
    titulo: "Explora los escenarios",
    descripcion: "Entra al recorrido interactivo para descubrir detalles de los espacios.",
  },
  {
    icono: Maximize2,
    titulo: "Amplía la experiencia",
    descripcion: "Activa o desactiva la pantalla completa desde el botón de expandir.",
  },
  {
    icono: Home,
    titulo: "Vuelve al inicio",
    descripcion: "Usa el icono de casa en la barra (visible en pantallas grandes).",
  },
];

export function GuiaNavegacionComic({ onCerrar }) {
  const panel = useRef(null);
  const botonCerrar = useRef(null);

  useEffect(() => {
    const anterior = document.activeElement;
    const foco = window.setTimeout(() => botonCerrar.current?.focus(), 0);

    const onKeyDown = (e) => {
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

    document.addEventListener("keydown", onKeyDown, true);
    return () => {
      window.clearTimeout(foco);
      document.removeEventListener("keydown", onKeyDown, true);
      anterior?.focus?.();
    };
  }, [onCerrar]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/80 p-0 backdrop-blur-sm sm:items-center sm:p-5"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCerrar();
      }}
    >
      <section
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="guia-comic-titulo"
        aria-describedby="guia-comic-descripcion"
        className="flex max-h-[92svh] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl border border-crema/15 bg-[#151210] text-crema shadow-2xl sm:rounded-3xl"
      >
        <header className="flex items-start justify-between gap-4 border-b border-crema/10 px-5 pb-4 pt-5 sm:px-7 sm:pt-6">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-turquesa">
              Antes de empezar
            </p>
            <h2 id="guia-comic-titulo" className="mt-1 font-serif text-3xl leading-tight sm:text-4xl">
              Navega el cómic a tu ritmo
            </h2>
            <p
              id="guia-comic-descripcion"
              className="mt-2 max-w-xl text-sm leading-relaxed text-crema/65 sm:text-base"
            >
              Usa la barra inferior para recorrer la historia, consultar el guion o explorar cada
              escenario. Puedes volver a cualquier pieza cuando quieras.
            </p>
          </div>
          <button
            ref={botonCerrar}
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar guía"
            className="grid size-10 shrink-0 place-items-center rounded-full border border-crema/20 text-crema/70 transition hover:bg-crema/10 hover:text-crema"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 sm:px-7">
          <div className="grid gap-2.5 sm:grid-cols-2">
            {CONTROLES.map(({ icono: Icono, titulo, descripcion }) => (
              <article
                key={titulo}
                className="flex gap-3 rounded-2xl border border-crema/10 bg-crema/[0.035] p-3.5"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-turquesa/10 text-turquesa">
                  <Icono className="size-4" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-semibold text-crema">{titulo}</h3>
                  <p className="mt-0.5 text-xs leading-relaxed text-crema/55 sm:text-sm">
                    {descripcion}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-3 rounded-2xl border border-turquesa/15 bg-turquesa/[0.06] px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-turquesa">
              Atajos de teclado
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-crema/70 sm:text-sm">
              <kbd className="font-semibold text-crema">←</kbd> /{" "}
              <kbd className="font-semibold text-crema">→</kbd> anterior / siguiente
              <span className="mx-2 text-crema/30">·</span>
              <kbd className="font-semibold text-crema">I</kbd> índice
              <span className="mx-2 text-crema/30">·</span>
              <kbd className="font-semibold text-crema">G</kbd> guion
              <span className="mx-2 text-crema/30">·</span>
              <kbd className="font-semibold text-crema">X</kbd> extras
              <span className="mx-2 text-crema/30">·</span>
              <kbd className="font-semibold text-crema">F</kbd> pantalla completa
              <span className="mx-2 text-crema/30">·</span>
              <kbd className="font-semibold text-crema">Esc</kbd> cerrar panel
            </p>
          </div>
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-crema/10 px-5 py-4 sm:px-7">
          <p className="text-xs text-crema/40">
            En la última pieza, «Siguiente» termina la experiencia.
          </p>
          <button
            type="button"
            onClick={onCerrar}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-turquesa px-5 text-xs font-bold uppercase tracking-[0.14em] text-marron transition hover:brightness-105"
          >
            Entendido, empezar a leer
            <ChevronRight className="size-4" aria-hidden="true" />
          </button>
        </footer>
      </section>
    </div>
  );
}
