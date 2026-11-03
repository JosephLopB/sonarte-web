import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger, prefiereMenosMovimiento } from "../lib/gsap.js";
import { asset } from "../lib/asset.js";

/** Escena del flyer compartida por la invitación del home y la página del cómic. */
export function ComicFondoSeccion({ children, className = "" }) {
  const seccionRef = useRef(null);
  const fondoRef = useRef(null);
  const imagenRef = useRef(null);

  useLayoutEffect(() => {
    const seccion = seccionRef.current;
    const fondo = fondoRef.current;
    const imagen = imagenRef.current;
    if (!seccion || !fondo || !imagen || prefiereMenosMovimiento()) return;

    const contexto = gsap.context(() => {
      gsap.fromTo(
        fondo,
        { scale: 0.92, borderRadius: "2rem" },
        {
          scale: 1,
          borderRadius: "0rem",
          ease: "none",
          scrollTrigger: {
            trigger: seccion,
            start: "top 108%",
            end: "center 50%",
            scrub: 0.9,
            invalidateOnRefresh: true,
          },
        },
      );

      gsap.fromTo(
        imagen,
        { scale: 1.04 },
        {
          scale: 1.12,
          ease: "none",
          scrollTrigger: {
            trigger: seccion,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );
    }, seccion);

    const medios = gsap.matchMedia(seccion);
    medios.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const parallax = gsap.fromTo(
        imagen,
        { yPercent: 27 },
        {
          yPercent: -27,
          ease: "none",
          scrollTrigger: {
            trigger: seccion,
            start: "top bottom",
            end: "bottom 98%",
            scrub: 0.35,
            invalidateOnRefresh: true,
          },
        },
      );

      return () => {
        parallax.scrollTrigger?.kill();
        parallax.kill();
      };
    });

    return () => {
      medios.revert();
      contexto.revert();
    };
  }, []);

  return (
    <section
      ref={seccionRef}
      className={`comic-flyer-seccion relative isolate overflow-hidden bg-crema ${className}`}
    >
      <div ref={fondoRef} className="comic-flyer-marco absolute inset-0 overflow-hidden" aria-hidden="true">
        <img
          ref={imagenRef}
          src={asset("/marca/flyer-comic.png")}
          alt=""
          className="comic-flyer-imagen absolute left-0 top-0 h-full w-full object-cover"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
        <span className="comic-flyer-sombra absolute inset-0" />
        <span className="comic-flyer-mezcla absolute inset-0" />
      </div>
      {children}
    </section>
  );
}
