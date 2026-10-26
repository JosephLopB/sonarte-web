import { useEffect, useState } from "react";
import { Pause, Play } from "lucide-react";
import {
  actualizarMezcla,
  detenerMezcla,
  iniciarMezcla,
} from "../../lib/audioComic.js";

const PISTAS = [
  { id: "tambor", nombre: "Tambor", icono: "🥁", nota: "La raíz africana: el golpe que manda." },
  { id: "bajo", nombre: "Bajo", icono: "🎸", nota: "El tumbao que amarra la cadera." },
  { id: "piano", nombre: "Piano", icono: "🎹", nota: "El montuno que abre espacio a la voz." },
];

export function MesaJoeson() {
  const [activas, setActivas] = useState(["tambor"]);
  const [suena, setSuena] = useState(false);

  useEffect(() => () => detenerMezcla(), []);

  useEffect(() => {
    if (suena) actualizarMezcla(activas);
  }, [activas, suena]);

  const alternar = (pista) => {
    setActivas((prev) =>
      prev.includes(pista) ? prev.filter((x) => x !== pista) : [...prev, pista],
    );
  };

  const reproducir = () => {
    if (suena) {
      detenerMezcla();
      setSuena(false);
      return;
    }
    iniciarMezcla(activas);
    setSuena(true);
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-2.5 sm:grid-cols-3">
        {PISTAS.map((p) => {
          const on = activas.includes(p.id);
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => alternar(p.id)}
              aria-pressed={on}
              className={`rounded-2xl border-2 p-3 text-left transition ${
                on
                  ? "border-turquesa bg-turquesa/10"
                  : "border-crema/15 bg-crema/[0.03] hover:border-crema/30"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xl" aria-hidden="true">
                  {p.icono}
                </span>
                <span
                  className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${
                    on ? "text-turquesa" : "text-crema/40"
                  }`}
                >
                  {on ? "activa" : "muda"}
                </span>
              </div>
              <p className="mt-1.5 font-serif text-lg text-crema">{p.nombre}</p>
              <p className="mt-0.5 text-[11px] leading-snug text-crema/55">{p.nota}</p>
              <div className="mt-2 flex h-6 items-end gap-0.5" aria-hidden="true">
                {Array.from({ length: 12 }).map((_, i) => (
                  <span
                    key={i}
                    className={`w-full rounded-sm transition-all ${
                      on && suena ? "bg-turquesa/80" : "bg-crema/15"
                    }`}
                    style={{
                      height: `${on && suena ? 25 + ((i * 37) % 70) : 12}%`,
                      transitionDelay: `${i * 30}ms`,
                    }}
                  />
                ))}
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={reproducir}
          className="inline-flex items-center gap-2 rounded-full bg-turquesa px-5 py-2.5 text-sm font-semibold text-marron transition hover:brightness-105"
        >
          {suena ? <Pause className="size-4" /> : <Play className="size-4" />}
          {suena ? "Detener la mezcla" : "Sonar el Joesón"}
        </button>
        <p className="text-xs leading-relaxed text-crema/50">
          Enciende una sola pista para oírla aislada, o súmalas todas para armar el Joesón completo.
        </p>
      </div>
    </div>
  );
}
