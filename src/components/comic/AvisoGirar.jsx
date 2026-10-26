import { Maximize2, RotateCw } from "lucide-react";

export function AvisoGirar({ onIntentarHorizontal }) {
  return (
    <div className="aviso-girar fixed inset-0 z-[95] flex-col items-center justify-center bg-[#080706] px-8 text-center text-crema">
      <div className="relative">
        <svg viewBox="0 0 120 120" className="size-24 text-turquesa" aria-hidden="true">
          <rect
            x="39"
            y="16"
            width="42"
            height="76"
            rx="8"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            transform="rotate(-18 60 54)"
          />
          <path
            d="M87 82c11 4 17 10 17 17"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="m99 92 5 7 8-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <RotateCw className="absolute -right-1 top-1 size-5 text-salmon" aria-hidden="true" />
      </div>
      <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.3em] text-salmon">
        Mejor en horizontal
      </p>
      <h2 className="mt-2 font-serif text-3xl">Gira el teléfono</h2>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-crema/60">
        Las escenas fueron compuestas en 16:9. En horizontal se leen completas, con el texto al
        tamaño que les corresponde.
      </p>
      <button
        type="button"
        onClick={onIntentarHorizontal}
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-turquesa px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.16em] text-marron"
      >
        <Maximize2 className="size-3.5" />
        Intentar pantalla completa
      </button>
      <p className="mt-3 max-w-xs text-[10px] leading-relaxed text-crema/35">
        Si tu navegador no permite girar automáticamente, gira el teléfono a mano. El cómic no se
        recorta ni se reencuadra.
      </p>
    </div>
  );
}
