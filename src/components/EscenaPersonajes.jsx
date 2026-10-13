import { PERSONAJES } from "../data/personajes.js";
import { useParallaxCursor } from "../hooks/useParallaxCursor.jsx";

const profundidad = [26, 46, 34];
const escala = ["w-[22%] max-w-[155px]", "w-[30%] max-w-[205px]", "w-[42%] max-w-[285px]"];

/** Escena de los tres Joe con parallax según el puntero (GSAP quickTo). */
export function EscenaPersonajes() {
  const { ref, registrar } = useParallaxCursor();

  return (
    <div ref={ref} className="relative flex items-end justify-center gap-2 sm:gap-8">
      {PERSONAJES.map((p, i) => (
        <figure
          key={p.nombre}
          ref={(el) => registrar(el, profundidad[i] ?? 30)}
          className={`group relative ${escala[i] ?? "w-1/3 max-w-[240px]"}`}
        >
          <img
            src={p.src}
            alt={`${p.nombre} — Joe Arroyo ilustrado por SonArte`}
            className="h-auto w-full drop-shadow-[0_24px_28px_oklch(0.3324_0.0747_42.13/0.35)] transition-transform duration-700 ease-out group-hover:-translate-y-3"
            loading="lazy"
          />
          <figcaption className="mt-3 text-center">
            <span className="block font-serif text-lg text-marron">{p.nombre}</span>
            <span className="block text-xs uppercase tracking-[0.18em] text-terracota">{p.edad}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
