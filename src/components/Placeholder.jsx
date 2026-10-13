import { Espiral } from "./Espirales.jsx";

/**
 * Hueco elegante para material pendiente: indica qué archivo se espera
 * sin romper el diseño mientras el material no se copie a /public/media.
 */
export function Placeholder({ titulo = "Material pendiente", nota, alto = "aspect-video" }) {
  return (
    <div
      className={`relative flex ${alto} w-full flex-col items-center justify-center gap-3 overflow-hidden rounded-[1.75rem] border-2 border-dashed border-terracota/40 bg-card/60 p-6 text-center`}
    >
      <Espiral className="size-10 text-terracota/50 anim-girar-lento" />
      <p className="font-serif text-lg text-marron">{titulo}</p>
      {nota ? <p className="max-w-md text-sm text-muted-foreground">{nota}</p> : null}
      <span className="mt-1 rounded-full border border-terracota/30 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-terracota/80">
        Espacio reservado
      </span>
    </div>
  );
}
