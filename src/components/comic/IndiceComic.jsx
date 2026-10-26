import { useEffect, useRef, useState } from "react";
import { Check, Clock, Film, Play, RotateCcw, Route, X } from "lucide-react";
import { asset } from "../../lib/asset.js";
import { CAPITULOS, GRUPOS } from "../../data/comicExperiencia.js";

export function IndiceComic({
  abierto,
  grupoActual,
  completadas = [],
  onIr,
  onCerrar,
  onReiniciar,
  modoCine = false,
  onModoCine,
}) {
  const panel = useRef(null);
  const cerrar = useRef(null);
  const [confirmarReinicio, setConfirmarReinicio] = useState(false);

  useEffect(() => {
    if (!abierto) return;
    setConfirmarReinicio(false);
    const anterior = document.activeElement;
    const foco = window.setTimeout(() => cerrar.current?.focus(), 40);

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
  }, [abierto, onCerrar]);

  if (!abierto) return null;

  return (
    <div
      className="fixed inset-0 z-[75] flex items-end justify-center bg-black/80 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCerrar();
      }}
    >
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label="Índice del cómic"
        className="flex max-h-[92svh] w-full max-w-4xl flex-col overflow-hidden rounded-t-3xl border border-crema/15 bg-[#151210] shadow-2xl sm:rounded-3xl"
      >
        <header className="flex items-start justify-between gap-4 border-b border-crema/10 px-5 py-4 sm:px-7">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-turquesa">
              Prólogo + 3 capítulos · {GRUPOS.length} piezas
            </p>
            <h2 className="mt-1 font-serif text-3xl text-crema">Índice del cómic</h2>
            <p className="mt-1 text-xs text-crema/45">
              Salta a cualquier pieza. Las escenas ya vistas quedan marcadas en este dispositivo.
            </p>
          </div>
          <button
            ref={cerrar}
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar índice"
            className="grid size-9 shrink-0 place-items-center rounded-full border border-crema/20 text-crema/70 transition hover:bg-crema/10 hover:text-crema"
          >
            <X className="size-4" />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-7">
          {CAPITULOS.map((cap) => {
            const piezas = GRUPOS.filter((g) => g.capitulo === cap.id);
            if (!piezas.length) return null;
            return (
              <section key={cap.id} className="mb-7 last:mb-2">
                <div className="mb-2.5 flex items-baseline justify-between gap-3">
                  <h3 className="font-serif text-xl text-crema">
                    <span className="mr-2 text-[10px] font-semibold uppercase tracking-[0.26em] text-salmon">
                      {cap.nombre}
                    </span>
                    {cap.titulo}
                  </h3>
                  <span className="text-[10px] uppercase tracking-[0.18em] text-crema/35">
                    {piezas.length} {piezas.length === 1 ? "pieza" : "piezas"}
                  </span>
                </div>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {piezas.map((g) => {
                    const actual = grupoActual?.id === g.id;
                    const vista = completadas.includes(g.id);
                    return (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => onIr(g)}
                        aria-current={actual ? "step" : undefined}
                        className={`group flex overflow-hidden rounded-2xl border text-left transition ${
                          actual
                            ? "border-turquesa bg-turquesa/[0.08]"
                            : "border-crema/10 bg-crema/[0.025] hover:border-crema/30 hover:bg-crema/[0.05]"
                        }`}
                      >
                        <div className="relative h-24 w-24 shrink-0 overflow-hidden sm:h-28 sm:w-32">
                          <img
                            src={asset(g.poster)}
                            alt=""
                            className="h-full w-full object-cover opacity-80 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
                            loading="lazy"
                          />
                          <span className="absolute inset-0 bg-gradient-to-r from-transparent to-[#151210]/70" />
                          <span className="absolute bottom-1.5 left-1.5 grid size-6 place-items-center rounded-full bg-[#0b0908]/75 text-crema/80">
                            {vista ? <Check className="size-3.5 text-turquesa" /> : <Play className="size-3 fill-current" />}
                          </span>
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col justify-center p-3">
                          <div className="flex flex-wrap items-center gap-1.5">
                            {actual ? (
                              <span className="rounded-full bg-turquesa px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.16em] text-marron">
                                Actual
                              </span>
                            ) : null}
                            {g.puente ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-terracota/25 px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-[0.14em] text-crema/75">
                                <Route className="size-2.5" /> Puente
                              </span>
                            ) : null}
                          </div>
                          <p className="mt-1 line-clamp-2 font-serif text-[15px] leading-tight text-crema">
                            {g.titulo}
                          </p>
                          <p className="mt-1 flex items-center gap-1 text-[10px] uppercase tracking-[0.14em] text-crema/35">
                            <Clock className="size-2.5" />
                            {g.duracion}
                            {g.capitulo === 2 ? " · hasta Cap. III" : ""}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-crema/10 px-5 py-3 sm:px-7">
          <p className="text-[10px] uppercase tracking-[0.18em] text-crema/30">
            Esc para cerrar · el progreso se guarda en este navegador
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onModoCine?.(!modoCine)}
              aria-pressed={modoCine}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] transition ${
                modoCine
                  ? "border-turquesa bg-turquesa/10 text-turquesa"
                  : "border-crema/15 text-crema/45 hover:border-crema/35 hover:text-crema/75"
              }`}
            >
              <Film className="size-3" />
              {modoCine ? "Modo cine activo" : "Modo cine"}
            </button>
            <button
              type="button"
              onClick={() => {
                if (!confirmarReinicio) {
                  setConfirmarReinicio(true);
                  return;
                }
                onReiniciar?.();
                setConfirmarReinicio(false);
              }}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] transition ${
                confirmarReinicio
                  ? "border-salmon bg-salmon/15 text-salmon"
                  : "border-crema/15 text-crema/45 hover:border-crema/35 hover:text-crema/75"
              }`}
            >
              <RotateCcw className="size-3" />
              {confirmarReinicio ? "Confirmar reinicio" : "Reiniciar recorrido"}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
