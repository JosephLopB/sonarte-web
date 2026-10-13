/** Espiral inspirada en el isologo SonArte: sonido, ciclos y movimiento. */
export function Espiral({ className }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <path
        d="M50 88c-21 0-38-17-38-38S29 12 50 12s34 15 34 33-13 29-28 29-24-10-24-22 8-19 17-19 14 6 14 13-4 11-9 11-7-3-7-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="9"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Espiral doble: diálogo entre medios (transmedia). */
export function EspiralDoble({ className }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round">
        <path d="M34 74c-13 0-22-10-22-22s10-22 23-22 20 9 20 19-8 17-16 17-13-6-13-12 4-9 8-9" />
        <path d="M70 26c13 0 22 10 22 22s-10 22-23 22" opacity="0.55" />
      </g>
    </svg>
  );
}

/** Onda sonora en pulsos: el son y el folclore. */
export function PulsoSon({ className }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <g stroke="currentColor" strokeWidth="9" strokeLinecap="round">
        <path d="M12 50h6" />
        <path d="M30 32v36" />
        <path d="M48 20v60" />
        <path d="M66 34v32" />
        <path d="M84 44v12" />
      </g>
    </svg>
  );
}

/** Trazo de ilustración: pincel en espiral. */
export function TrazoPincel({ className }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 80c14 6 30 2 38-10 7-11 3-24-8-27-9-3-17 3-17 11 0 7 6 11 12 9" />
        <path d="M62 40 84 18" />
      </g>
    </svg>
  );
}

/** Viñeta de cómic con espiral interna. */
export function VinetaComic({ className }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 22h72v48H50L30 86V70H14z" />
        <path d="M58 38c-9-4-19 1-19 10 0 7 6 11 12 9" />
      </g>
    </svg>
  );
}

/** Onda continua tipo "son" para fondos y separadores. */
export function Onda({ className, opacity = 1 }) {
  return (
    <svg
      viewBox="0 0 1440 120"
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
      style={{ opacity }}
    >
      <path
        d="M0 64c120-40 240-40 360 0s240 40 360 0 240-40 360 0 240 40 360 0v56H0z"
        fill="currentColor"
      />
    </svg>
  );
}
