import { useEffect, useRef, useState } from "react";
import {
  BookOpen,
  Check,
  ChevronDown,
  Sparkles,
  X,
} from "lucide-react";
import { CAPITULOS, ESTADOS_GUION } from "../../data/comicExperiencia.js";
import { ContenidoExtra } from "./ContenidoExtra.jsx";

function Estado({ estado }) {
  const info = ESTADOS_GUION[estado] ?? ESTADOS_GUION.escena;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.16em] ring-1 ${info.clase}`}
    >
      {info.etiqueta}
    </span>
  );
}

export function PanelComic({
  abierto,
  pestanaInicial = "guion",
  grupo,
  extraInicial = null,
  onCerrar,
  extrasVistos = [],
  onMarcarExtra,
}) {
  const [pestana, setPestana] = useState(pestanaInicial);
  const [extraAbierto, setExtraAbierto] = useState(null);
  const panel = useRef(null);
  const cerrar = useRef(null);

  useEffect(() => {
    if (!abierto) return;
    setPestana(pestanaInicial);
    setExtraAbierto(extraInicial);
    if (extraInicial) onMarcarExtra?.(extraInicial);
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
  }, [abierto, pestanaInicial, extraInicial, onCerrar]);

  if (!abierto || !grupo) return null;

  const capitulo = CAPITULOS.find((c) => c.id === grupo.capitulo);
  const extras = grupo.extras ?? [];
  const cuenta = grupo.guion.reduce(
    (acc, g) => {
      acc[g.estado] = (acc[g.estado] ?? 0) + 1;
      return acc;
    },
    {},
  );

  const abrirExtra = (extra) => {
    const nuevo = extraAbierto === extra.id ? null : extra.id;
    setExtraAbierto(nuevo);
    if (nuevo) onMarcarExtra?.(extra.id);
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-black/75 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCerrar();
      }}
    >
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={`Guion y extras de ${grupo.titulo}`}
        className="flex max-h-[90svh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl border border-crema/15 bg-[#151210] shadow-2xl sm:rounded-3xl"
      >
        <header className="flex items-start justify-between gap-3 border-b border-crema/10 px-5 pb-3 pt-4 sm:px-6">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-turquesa">
              {capitulo?.nombre} · {grupo.titulo}
            </p>
            <h2 className="mt-1 font-serif text-2xl text-crema sm:text-3xl">Guion y extras</h2>
            <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-crema/40">{grupo.epoca}</p>
          </div>
          <button
            ref={cerrar}
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar guion y extras"
            className="grid size-9 shrink-0 place-items-center rounded-full border border-crema/20 text-crema/70 transition hover:bg-crema/10 hover:text-crema"
          >
            <X className="size-4" />
          </button>
        </header>

        <div className="flex gap-1 border-b border-crema/10 px-4 sm:px-6" role="tablist">
          {[
            { id: "guion", label: "Guion", icon: BookOpen },
            { id: "extras", label: `Extras (${extras.length})`, icon: Sparkles },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={pestana === id}
              onClick={() => setPestana(id)}
              className={`relative flex items-center gap-2 px-3 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] transition ${
                pestana === id ? "text-turquesa" : "text-crema/45 hover:text-crema/75"
              }`}
            >
              <Icon className="size-3.5" aria-hidden="true" />
              {label}
              {pestana === id ? (
                <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-turquesa" />
              ) : null}
            </button>
          ))}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
          {pestana === "guion" ? (
            <div className="space-y-4">
              <div className="rounded-2xl border border-terracota/25 bg-terracota/[0.08] p-3.5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-salmon">
                  La pieza
                </p>
                <p className="mt-1 font-serif text-sm leading-relaxed text-crema/80">{grupo.resumen}</p>
              </div>

              <div className="rounded-2xl border border-crema/10 bg-crema/[0.03] p-3.5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-crema/45">
                  Cobertura de esta pieza
                </p>
                <p className="mt-1 font-serif text-sm leading-relaxed text-crema/75">
                  {grupo.guion.length} escena{grupo.guion.length === 1 ? "" : "s"} del guion.{" "}
                  {cuenta.extra ? "Una se recupera como extra. " : ""}
                  {cuenta.puente ? "Una se recupera como puente antes de la escena. " : ""}
                  {grupo.guion.some((g) => g.estado === "escena-extra")
                    ? "Las demás están en la pieza audiovisual y ampliadas con extras."
                    : "Las demás están en la pieza audiovisual."}
                </p>
              </div>

              {grupo.guion.map((escena, i) => (
                <article key={escena.id} className="rounded-2xl border border-crema/10 bg-crema/[0.025] p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="grid size-6 place-items-center rounded-full bg-crema/10 text-[10px] font-semibold text-crema/70">
                      {i + 1}
                    </span>
                    <h3 className="font-serif text-lg text-crema">{escena.titulo}</h3>
                    <Estado estado={escena.estado} />
                  </div>
                  {escena.narracion ? (
                    <p className="mt-2 font-serif text-sm italic leading-relaxed text-crema/55">
                      {escena.narracion}
                    </p>
                  ) : null}
                  <div className="mt-3 space-y-2">
                    {escena.lineas.map((linea) => (
                      <p key={`${linea.voz}-${linea.texto}`} className="text-sm leading-relaxed text-crema/85">
                        <span className="mr-1.5 font-semibold uppercase tracking-[0.12em] text-salmon">
                          {linea.voz}
                        </span>
                        {linea.acotacion ? (
                          <span className="mr-1.5 text-[11px] italic text-crema/45">({linea.acotacion})</span>
                        ) : null}
                        {linea.texto}
                      </p>
                    ))}
                  </div>
                  {escena.acotacion ? (
                    <p className="mt-2.5 border-l-2 border-crema/15 pl-2.5 font-serif text-xs italic leading-relaxed text-crema/50">
                      {escena.acotacion}
                    </p>
                  ) : null}
                  {escena.interactivo ? (
                    <p className="mt-3 rounded-xl bg-turquesa/10 px-3 py-2 text-[11px] leading-relaxed text-turquesa/90">
                      <strong className="mr-1 uppercase tracking-[0.16em]">⚡ Interactivo</strong>
                      {escena.interactivo}
                    </p>
                  ) : null}
                  {escena.nota ? (
                    <p className="mt-2 text-[11px] leading-relaxed text-crema/45">{escena.nota}</p>
                  ) : null}
                </article>
              ))}
            </div>
          ) : (
            <div className="space-y-2.5">
              {extras.map((extra) => {
                const activo = extraAbierto === extra.id;
                const visto = extrasVistos.includes(extra.id);
                return (
                  <div
                    key={extra.id}
                    className={`overflow-hidden rounded-2xl border transition ${
                      activo ? "border-turquesa/40 bg-crema/[0.05]" : "border-crema/10 bg-crema/[0.025]"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => abrirExtra(extra)}
                      aria-expanded={activo}
                      className="flex w-full items-start gap-3 p-3.5 text-left"
                    >
                      <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-terracota/25 text-crema/80">
                        {visto ? <Check className="size-3.5" aria-hidden="true" /> : <Sparkles className="size-3.5" aria-hidden="true" />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[9px] font-semibold uppercase tracking-[0.22em] text-turquesa/80">
                          {extra.etiqueta}
                        </span>
                        <span className="mt-0.5 block font-serif text-[15px] text-crema">{extra.titulo}</span>
                        <span className="mt-0.5 block text-xs leading-relaxed text-crema/50">{extra.intro}</span>
                      </span>
                      <ChevronDown
                        className={`mt-1 size-4 shrink-0 text-crema/40 transition-transform ${activo ? "rotate-180" : ""}`}
                        aria-hidden="true"
                      />
                    </button>
                    {activo ? (
                      <div className="border-t border-crema/10 px-3.5 pb-4 pt-3">
                        <ContenidoExtra extra={extra} />
                      </div>
                    ) : null}
                  </div>
                );
              })}
              {extras.length === 0 ? (
                <p className="rounded-2xl border border-crema/10 p-4 text-sm text-crema/50">
                  Esta pieza no tiene extras adicionales.
                </p>
              ) : null}
            </div>
          )}
        </div>

        <footer className="border-t border-crema/10 px-5 py-2.5 text-center text-[10px] uppercase tracking-[0.2em] text-crema/35 sm:px-6">
          Esc para cerrar · el audio de la escena sigue sonando detrás
        </footer>
      </div>
    </div>
  );
}
