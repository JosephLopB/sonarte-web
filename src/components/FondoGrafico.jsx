import { Espiral } from "./Espirales.jsx";

const piezas = [
  { top: "8%", left: "6%", size: 90, dur: "9s", delay: "0s", tone: "text-salmon/45" },
  { top: "22%", left: "82%", size: 130, dur: "11s", delay: "1.2s", tone: "text-turquesa/50" },
  { top: "58%", left: "12%", size: 70, dur: "8s", delay: "0.6s", tone: "text-turquesa-medio/40" },
  { top: "72%", left: "72%", size: 110, dur: "12s", delay: "2s", tone: "text-terracota/25" },
  { top: "40%", left: "48%", size: 55, dur: "10s", delay: "1.7s", tone: "text-salmon/30" },
  { top: "88%", left: "34%", size: 80, dur: "9.5s", delay: "0.3s", tone: "text-verde-oscuro/25" },
];

/** Capa decorativa: espirales flotantes de la iconografía SonArte. */
export function FondoGrafico({ densidad = 6 }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {piezas.slice(0, densidad).map((p, i) => (
        <div
          key={i}
          className={`absolute anim-flotar ${p.tone}`}
          style={{ top: p.top, left: p.left, width: p.size, height: p.size, animationDuration: p.dur, animationDelay: p.delay }}
        >
          <Espiral className="h-full w-full anim-girar-lento" />
        </div>
      ))}
    </div>
  );
}

/** Bandas de olas superpuestas que se desplazan de forma continua. */
export function OlasFlotantes({ className = "" }) {
  return (
    <div className={`pointer-events-none absolute inset-x-0 bottom-0 ${className}`} aria-hidden="true">
      {[
        { color: "text-turquesa/40", h: "h-24", dur: "26s", y: "translate-y-2" },
        { color: "text-turquesa-medio/35", h: "h-32", dur: "38s", y: "translate-y-6" },
        { color: "text-salmon/25", h: "h-20", dur: "31s", y: "translate-y-10" },
      ].map((o, i) => (
        <div key={i} className={`absolute inset-x-0 bottom-0 ${o.y}`}>
          <div
            className="flex w-[200%] anim-deriva"
            style={{ animationDuration: o.dur, animationDirection: i % 2 ? "reverse" : "normal" }}
          >
            {[0, 1].map((k) => (
              <svg
                key={k}
                viewBox="0 0 1440 120"
                preserveAspectRatio="none"
                className={`${o.h} w-1/2 shrink-0 ${o.color}`}
              >
                <path d="M0 60c120-44 240-44 360 0s240 44 360 0 240-44 360 0 240 44 360 0v60H0z" fill="currentColor" />
              </svg>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
