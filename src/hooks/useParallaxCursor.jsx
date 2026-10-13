import { useEffect, useRef } from "react";
import { gsap, prefiereMenosMovimiento } from "../lib/gsap.js";

/**
 * Parallax de capas según el puntero, con GSAP quickTo (suavizado por muelle).
 * Devuelve el ref del contenedor y una función para registrar cada capa.
 */
export function useParallaxCursor() {
  const cont = useRef(null);
  const capas = useRef([]);

  const registrar = (el, profundidad) => {
    if (!el) return;
    const existente = capas.current.find((c) => c.el === el);
    if (existente) {
      existente.profundidad = profundidad;
      return;
    }
    capas.current.push({ el, profundidad });
  };

  useEffect(() => {
    const el = cont.current;
    if (!el || prefiereMenosMovimiento()) return;

    const tweenPorCapa = capas.current.map(({ el: capa, profundidad }) => ({
      x: gsap.quickTo(capa, "x", { duration: 0.9, ease: "power3.out" }),
      y: gsap.quickTo(capa, "y", { duration: 0.9, ease: "power3.out" }),
      profundidad,
    }));

    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
      const ny = ((e.clientY - r.top) / r.height) * 2 - 1;
      tweenPorCapa.forEach((t) => {
        t.x(nx * t.profundidad);
        t.y(ny * t.profundidad * 0.45);
      });
    };
    const reset = () => tweenPorCapa.forEach((t) => { t.x(0); t.y(0); });

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", reset);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", reset);
    };
  }, []);

  return { ref: cont, registrar };
}
