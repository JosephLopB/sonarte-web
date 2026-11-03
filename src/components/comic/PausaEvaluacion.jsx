import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, MessagesSquare, Minus, Plus, Sparkles } from "lucide-react";
import { gsap, prefiereMenosMovimiento } from "../../lib/gsap.js";
import { itemsDeEje } from "../../data/evaluacion.js";
import { Escala, PistaEscala } from "../evaluacion/Campos.jsx";

/** Preguntas opcionales al cierre de cada capítulo, en un panel no bloqueante. */
export function PausaEvaluacion({ pausas, respuestas, onResponder, onMinimizar }) {
  const [minimizada, setMinimizada] = useState(false);
  const [actualizacionNueva, setActualizacionNueva] = useState(false);
  const panel = useRef(null);
  const cuerpo = useRef(null);
  const pestana = useRef(null);
  const iconoPestana = useRef(null);
  const cantidadAnterior = useRef(pausas.length);
  const preguntas = useMemo(
    () => pausas.flatMap((pausa) => itemsDeEje(pausa.eje).map((item) => ({ ...item, capitulo: pausa.rotulo }))),
    [pausas],
  );
  const respondidas = preguntas.filter((pregunta) => respuestas[pregunta.id]).length;
  const necesitaListaDesplazable = preguntas.length >= 3;

  useLayoutEffect(() => {
    if (!panel.current || minimizada || prefiereMenosMovimiento()) return;
    const animacion = gsap.fromTo(
      panel.current,
      { x: 36, autoAlpha: 0 },
      { x: 0, autoAlpha: 1, duration: 0.48, ease: "power3.out", clearProps: "transform" },
    );
    return () => animacion.kill();
  }, [minimizada]);

  useLayoutEffect(() => {
    const cantidadActual = pausas.length;
    if (cantidadActual <= cantidadAnterior.current) return;
    cantidadAnterior.current = cantidadActual;

    if (minimizada) {
      setActualizacionNueva(true);
      const boton = pestana.current;
      const icono = iconoPestana.current;
      if (prefiereMenosMovimiento() || !boton) return;

      const rebote = gsap.timeline();
      rebote
        .to(boton, {
          yPercent: -50,
          y: -6,
          scale: 1.1,
          boxShadow: "0 0 22px 5px rgba(76, 220, 190, 0.48)",
          duration: 0.18,
          ease: "power2.out",
        })
        .to(boton, {
          yPercent: -50,
          y: 0,
          scale: 1,
          boxShadow: "0 0 0 0 rgba(76, 220, 190, 0)",
          duration: 0.55,
          ease: "bounce.out",
          clearProps: "transform,boxShadow",
        })
        .fromTo(
          icono,
          { rotate: -9, scale: 0.9 },
          { rotate: 0, scale: 1, duration: 0.42, ease: "elastic.out(1, 0.5)", clearProps: "transform" },
          0,
        );
      return () => rebote.kill();
    }

    const ultimaPausa = pausas[cantidadActual - 1];
    const seccion = panel.current?.querySelector(`[data-pausa-capitulo="${ultimaPausa.capitulo}"]`);
    if (!seccion || prefiereMenosMovimiento()) return;

    cuerpo.current?.scrollTo({ top: cuerpo.current.scrollHeight, behavior: "smooth" });
    const preguntasNuevas = seccion.querySelectorAll("[data-pregunta-item]");
    const entrada = gsap.timeline();
    entrada.fromTo(
      seccion,
      { x: 18, autoAlpha: 0, backgroundColor: "rgba(44, 196, 167, 0.13)" },
      { x: 0, autoAlpha: 1, backgroundColor: "rgba(44, 196, 167, 0)", duration: 0.48, ease: "power3.out", clearProps: "transform,opacity,visibility,backgroundColor" },
    );
    entrada.fromTo(
      preguntasNuevas,
      { y: 9, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.35, stagger: 0.07, ease: "power2.out", clearProps: "transform,opacity,visibility" },
      0.08,
    );
    return () => entrada.kill();
  }, [pausas.length, minimizada]);

  useEffect(() => {
    const tecla = (evento) => {
      if (evento.key === "Escape" && !minimizada) {
        evento.preventDefault();
        evento.stopPropagation();
        setMinimizada(true);
      }
    };
    window.addEventListener("keydown", tecla, true);
    return () => window.removeEventListener("keydown", tecla, true);
  }, [minimizada]);

  if (!pausas.length) return null;

  if (minimizada) {
    return (
      <button
        ref={pestana}
        type="button"
        onClick={() => { setActualizacionNueva(false); setMinimizada(false); }}
        aria-label={actualizacionNueva ? `Hay preguntas nuevas. ${respondidas} de ${preguntas.length} respondidas. Abrir preguntas del cómic.` : `Abrir preguntas del cómic: ${respondidas} de ${preguntas.length} respondidas`}
        className={`absolute right-0 top-1/2 z-[75] flex -translate-y-1/2 items-center gap-2 rounded-l-2xl border border-r-0 px-3 py-3 text-crema shadow-[-10px_12px_35px_-18px_rgba(0,0,0,.9)] backdrop-blur-md transition hover:px-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-turquesa ${actualizacionNueva ? "border-turquesa bg-[#24332f] ring-2 ring-turquesa/60 shadow-[0_0_22px_4px_rgba(76,220,190,0.35)]" : "border-turquesa/30 bg-[#171310]/95"}`}
      >
        <MessagesSquare ref={iconoPestana} className={`size-4 ${actualizacionNueva ? "text-[#a7ffe8]" : "text-turquesa"}`} aria-hidden="true" />
        <span className="text-xs font-bold tabular-nums text-turquesa">{respondidas}/{preguntas.length}</span>
        <Plus className="size-3.5 text-crema/55" aria-hidden="true" />
        {actualizacionNueva ? <span className="absolute -left-1 -top-1 size-2.5 rounded-full border-2 border-[#171310] bg-turquesa" aria-hidden="true" /> : null}
      </button>
    );
  }

  return (
    <aside
      ref={panel}
      aria-label="Preguntas sobre el cómic"
      className={`absolute bottom-[calc(4.5rem+env(safe-area-inset-bottom))] right-3 z-[75] grid max-h-[min(56svh,28rem)] w-[min(22rem,calc(100vw-1.5rem))] grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden rounded-[1.35rem] border border-turquesa/25 bg-[#171310]/95 text-crema shadow-[0_24px_70px_-28px_rgba(0,0,0,.95)] backdrop-blur-xl sm:bottom-auto sm:right-5 sm:top-1/2 sm:max-h-[min(70svh,38rem)] sm:-translate-y-1/2 ${necesitaListaDesplazable ? "h-[min(56svh,28rem)] sm:h-[min(70svh,38rem)]" : "h-auto"}`}
    >
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-crema/10 px-4 py-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-turquesa/15 text-turquesa">
            <MessagesSquare className="size-4" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-[11px] font-bold uppercase tracking-[0.12em]">Preguntas al margen</p>
            <p aria-live="polite" className="text-[10px] text-crema/45">{respondidas} de {preguntas.length} respuestas</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => { setMinimizada(true); onMinimizar?.(); }}
          aria-label="Minimizar preguntas"
          className="grid size-8 shrink-0 place-items-center rounded-full text-crema/55 transition hover:bg-crema/10 hover:text-crema focus-visible:outline focus-visible:outline-2 focus-visible:outline-turquesa"
        >
          <Minus className="size-4" aria-hidden="true" />
        </button>
      </header>

      <div
        ref={cuerpo}
        className="min-h-0 overflow-x-hidden overflow-y-auto overscroll-contain px-4 py-3"
      >
        <p className="mb-3 flex items-center gap-2 text-[10px] leading-relaxed text-crema/50">
          <Sparkles className="size-3 shrink-0 text-turquesa" aria-hidden="true" />
          Estas preguntas aparecen al terminar cada capítulo. Respóndelas ahora o minimiza la pestaña y sigue leyendo.
        </p>
        <div className="space-y-4">
          {pausas.map((pausa) => (
            <section key={pausa.capitulo} data-pausa-capitulo={pausa.capitulo} className="border-t border-crema/10 pt-3 first:border-0 first:pt-0">
              <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.18em] text-turquesa/75">{pausa.rotulo} · {pausa.titulo}</p>
              {itemsDeEje(pausa.eje).map((item) => (
                <div key={item.id} data-pregunta-item className="mb-3 last:mb-0">
                  <p className="mb-2 text-[12px] leading-relaxed text-crema/80">{item.texto}</p>
                  <Escala
                    id={item.id}
                    etiqueta={item.texto}
                    valor={respuestas[item.id]}
                    onElegir={onResponder}
                    tono="oscuro"
                    compacta
                  />
                </div>
              ))}
            </section>
          ))}
        </div>
        <PistaEscala tono="oscuro" className="mt-2 border-t border-crema/10 pt-2" />
      </div>

      <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-crema/10 px-4 py-3">
        <span className="text-[10px] text-crema/40">Tus respuestas se guardan en el recorrido.</span>
        <button
          type="button"
          onClick={() => setMinimizada(true)}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-turquesa px-3 py-2 text-[9px] font-bold uppercase tracking-[0.1em] text-marron transition hover:brightness-105"
        >
          Seguir <ArrowRight className="size-3" aria-hidden="true" />
        </button>
      </footer>
    </aside>
  );
}
