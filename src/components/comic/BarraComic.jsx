import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Compass,
  Home,
  LayoutGrid,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { CAPITULOS } from "../../data/comicExperiencia.js";
import { gsap, prefiereMenosMovimiento } from "../../lib/gsap.js";

function Boton({ etiqueta, onClick, children, activo = false, disabled = false, destacado = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={etiqueta}
      title={etiqueta}
      className={`grid size-9 shrink-0 place-items-center rounded-full border transition sm:size-10 ${
        destacado
          ? "border-turquesa bg-turquesa text-marron hover:brightness-105"
          : activo
            ? "border-turquesa/50 bg-turquesa/10 text-turquesa"
            : "border-crema/15 text-crema/65 hover:border-crema/35 hover:bg-crema/5 hover:text-crema"
      } disabled:cursor-not-allowed disabled:opacity-30`}
    >
      {children}
    </button>
  );
}

export function BarraComic({
  grupo,
  indice,
  total,
  completadas = [],
  onAnterior,
  onSiguiente,
  onIndice,
  onGuion,
  onExplorar,
  explorando = false,
  onPantalla,
  pantallaCompleta,
  listo,
  puenteVisible = false,
}) {
  const botonExplorar = useRef(null);
  const escenaAnterior = useRef(grupo.id);
  const capitulo = CAPITULOS.find((c) => c.id === grupo.capitulo);

  useLayoutEffect(() => {
    if (escenaAnterior.current === grupo.id) return;
    escenaAnterior.current = grupo.id;
    const boton = botonExplorar.current;
    if (!boton || prefiereMenosMovimiento()) return;

    const pulso = gsap.timeline();
    pulso
      .to(boton, {
        scale: 1.15,
        boxShadow: "0 0 0 5px rgba(76, 220, 190, 0.28), 0 0 24px rgba(76, 220, 190, 0.5)",
        duration: 0.2,
        ease: "power2.out",
      })
      .to(boton, { scale: 0.97, duration: 0.14, ease: "power2.in" })
      .to(boton, {
        scale: 1.08,
        boxShadow: "0 0 0 3px rgba(76, 220, 190, 0.2), 0 0 16px rgba(76, 220, 190, 0.35)",
        duration: 0.18,
        ease: "power2.out",
      })
      .to(boton, {
        scale: 1,
        boxShadow: "0 0 0 0 rgba(76, 220, 190, 0)",
        duration: 0.38,
        ease: "bounce.out",
        clearProps: "transform,boxShadow",
      });

    return () => pulso.kill();
  }, [grupo.id]);

  return (
    <footer className="relative z-40 shrink-0 border-t border-crema/10 bg-[#0d0b09]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1500px] items-center gap-2 px-2.5 py-2 sm:gap-4 sm:px-5">
        <Link
          to="/comic"
          aria-label="Volver a la página del cómic"
          className="hidden size-9 shrink-0 place-items-center rounded-full border border-crema/15 text-crema/55 transition hover:border-crema/35 hover:text-crema sm:grid"
        >
          <Home className="size-4" />
        </Link>

        <div className="min-w-0 flex-1">
          <p className="truncate text-[9px] font-semibold uppercase tracking-[0.24em] text-turquesa/80">
            {capitulo?.nombre} · {capitulo?.titulo}
            {grupo.capitulo === 2 ? " · y Cap. III" : ""}
          </p>
          <p className="truncate font-serif text-sm leading-tight text-crema/90 sm:text-base">
            {grupo.titulo}
          </p>
        </div>

        <div className="hidden items-center gap-1 md:flex" aria-label={`Progreso: ${indice + 1} de ${total}`}>
          {Array.from({ length: total }).map((_, i) => {
            const vista = completadas.includes(grupo.id) && i === indice;
            const pasada = i < indice;
            return (
              <button
                key={i}
                type="button"
                onClick={onIndice}
                aria-label={`Abrir índice, pieza ${i + 1} de ${total}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === indice
                    ? "w-7 bg-turquesa"
                    : pasada || vista
                      ? "w-2.5 bg-turquesa/45 hover:bg-turquesa/70"
                      : "w-2.5 bg-crema/20 hover:bg-crema/40"
                }`}
              />
            );
          })}
        </div>

        <span className="hidden shrink-0 text-[10px] font-semibold uppercase tracking-[0.16em] text-crema/35 lg:inline">
          {indice + 1}/{total}
        </span>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <Boton etiqueta="Pieza anterior" onClick={onAnterior} disabled={indice === 0}>
            <ChevronLeft className="size-4" />
          </Boton>

          <Boton etiqueta="Abrir índice" onClick={onIndice} activo={false}>
            <LayoutGrid className="size-4" />
          </Boton>

          <Boton etiqueta="Abrir guion y extras" onClick={onGuion} activo={false}>
            <BookOpen className="size-4" />
          </Boton>

          <button
            ref={botonExplorar}
            type="button"
            onClick={onExplorar}
            aria-label="Explorar esta escena"
            title="Explorar esta escena"
            aria-pressed={explorando}
            className={`grid size-9 shrink-0 place-items-center rounded-full border transition sm:size-10 ${
              explorando
                ? "border-turquesa/50 bg-turquesa/10 text-turquesa"
                : "border-crema/15 text-crema/65 hover:border-crema/35 hover:bg-crema/5 hover:text-crema"
            }`}
          >
            <Compass className="size-4" aria-hidden="true" />
          </button>

          <Boton
            etiqueta={pantallaCompleta ? "Salir de pantalla completa" : "Pantalla completa"}
            onClick={onPantalla}
            activo={pantallaCompleta}
          >
            {pantallaCompleta ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
          </Boton>

          <button
            type="button"
            onClick={onSiguiente}
            aria-label={
              puenteVisible
                ? "Siguiente diálogo"
                : indice === total - 1
                  ? "Terminar el cómic"
                  : "Siguiente pieza"
            }
            className={`ml-0.5 inline-flex h-9 items-center gap-1 rounded-full bg-turquesa px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-marron transition hover:brightness-105 sm:h-10 sm:px-4 ${
              listo ? "ring-2 ring-salmon ring-offset-2 ring-offset-[#0d0b09]" : ""
            }`}
          >
            {puenteVisible ? "Siguiente" : indice === total - 1 ? "Finalizar" : "Siguiente"}
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
