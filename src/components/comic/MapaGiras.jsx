import { useState } from "react";
import { MapPin } from "lucide-react";
import { asset } from "../../lib/asset.js";

export function MapaGiras({ ciudades = [] }) {
  const [activa, setActiva] = useState(ciudades[0]?.id ?? null);
  const ciudad = ciudades.find((c) => c.id === activa) ?? ciudades[0];

  return (
    <div className="space-y-4">
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-crema/15 bg-marron/40">
        <img
          src={asset("/escenarios/esc-mapa.jpg")}
          alt="Mapa de las giras internacionales de Joe Arroyo"
          className="absolute inset-0 h-full w-full object-cover opacity-80"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0908]/75 via-transparent to-[#0b0908]/30" />

        {ciudades.map((c) => {
          const on = c.id === activa;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setActiva(c.id)}
              aria-pressed={on}
              aria-label={`Ver ${c.nombre}`}
              className="group absolute -translate-x-1/2 -translate-y-1/2 focus-visible:outline-none"
              style={{ left: `${c.x}%`, top: `${c.y}%` }}
            >
              <span
                className={`relative grid size-8 place-items-center rounded-full border-2 transition-all sm:size-9 ${
                  on
                    ? "scale-110 border-crema bg-terracota text-crema shadow-[0_0_0_6px_oklch(0.7447_0.1272_42.8/0.2)]"
                    : "border-crema/70 bg-marron/90 text-crema/80 group-hover:border-turquesa group-hover:text-turquesa"
                }`}
              >
                <MapPin className="size-4" aria-hidden="true" />
              </span>
              <span
                className={`absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] transition ${
                  on ? "bg-crema text-marron" : "bg-[#0b0908]/70 text-crema/75"
                }`}
              >
                {c.nombre}
              </span>
            </button>
          );
        })}
      </div>

      {ciudad ? (
        <div className="rounded-2xl border border-crema/15 bg-crema/[0.04] p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-turquesa">
            {ciudad.nombre}
          </p>
          <p className="mt-1.5 font-serif text-[15px] leading-relaxed text-crema/80">{ciudad.nota}</p>
        </div>
      ) : null}
    </div>
  );
}
