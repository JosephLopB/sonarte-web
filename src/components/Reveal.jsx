import { useEffect, useRef } from "react";
import { gsap, prefiereMenosMovimiento } from "../lib/gsap.js";

const dirs = {
  up: { y: 44, x: 0 },
  down: { y: -44, x: 0 },
  left: { y: 0, x: 44 },
  right: { y: 0, x: -44 },
  scale: { y: 0, x: 0 },
};

/**
 * Aparición al hacer scroll con GSAP + ScrollTrigger.
 * Sustituye a Motion manteniendo el mismo lenguaje de entrada suave.
 */
export function Reveal({ children, dir = "up", delay = 0, className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefiereMenosMovimiento()) {
      gsap.set(el, { opacity: 1 });
      return;
    }
    const desde = { opacity: 0, ...(dirs[dir] ?? dirs.up) };
    if (dir === "scale") {
      desde.scale = 0.92;
    }
    const anim = gsap.fromTo(el, desde, {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      duration: 1,
      delay,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 85%" },
    });
    return () => {
      anim.scrollTrigger?.kill();
      anim.kill();
    };
  }, [dir, delay]);

  return (
    <div ref={ref} className={className} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}
