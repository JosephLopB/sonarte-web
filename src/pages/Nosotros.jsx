import { useEffect, useRef } from "react";
import { Star } from "lucide-react";
import { gsap, prefiereMenosMovimiento } from "../lib/gsap.js";
import { Reveal } from "../components/Reveal.jsx";
import { Espiral } from "../components/Espirales.jsx";
import { MARCA, VALORES, EQUIPO, IDENTIDAD } from "../data/marca.js";
import { asset } from "../lib/asset.js";

/** Bloques de color de la paleta para la rejilla de valores. */
const bloques = [
  { fondo: "bg-terracota", barra: "bg-salmon" },
  { fondo: "bg-turquesa-medio", barra: "bg-turquesa" },
  { fondo: "bg-verde-oscuro", barra: "bg-turquesa" },
  { fondo: "bg-marron", barra: "bg-salmon" },
];

/**
 * Cada integrante conserva su lenguaje (Yurany: menta, rosa y Akira; Joseph:
 * papel crema, terracota y Garamond), pero ambos comparten la misma retícula:
 * retrato circular del mismo tamaño, nombre, rol, divisor, texto y firma.
 */
const LOOKS = {
  Joseph: {
    fondo: "var(--color-crema)",
    borde: "color-mix(in oklab, var(--color-marron) 22%, transparent)",
    nombre: "font-serif font-semibold text-marron",
    rol: "text-terracota",
    divisor: "bg-terracota",
    firma: "text-terracota/90",
    anillo: "var(--color-terracota)",
    sello: "bg-terracota text-crema",
    motivo: "espiral",
    retrato: "50% 8%",
  },
  Yurany: {
    fondo: "#C4F7E1",
    borde: "var(--color-marron)",
    nombre: "font-impacto text-marron",
    rol: "text-[#8E3F6B]",
    divisor: "bg-[#D8A0C6]",
    firma: "text-[#8E3F6B]",
    anillo: "#D8A0C6",
    sello: "bg-[#D8A0C6] text-marron",
    motivo: "estrella",
    retrato: "38% 22%",
  },
};

/** Card de integrante con tilt 3D según el cursor (GSAP). */
function CardIntegrante({ p }) {
  const card = useRef(null);
  const img = useRef(null);
  const cuerpo = useRef(null);
  const look = LOOKS[p.nombre] ?? LOOKS.Joseph;
  const Estrella = look.motivo === "estrella";

  useEffect(() => {
    if (prefiereMenosMovimiento()) return;
    const el = card.current;
    const rotX = gsap.quickTo(el, "rotationX", { duration: 0.7, ease: "power3.out" });
    const rotY = gsap.quickTo(el, "rotationY", { duration: 0.7, ease: "power3.out" });
    const mx = gsap.quickTo(img.current, "x", { duration: 0.9, ease: "power3.out" });
    const my = gsap.quickTo(img.current, "y", { duration: 0.9, ease: "power3.out" });
    const tx = gsap.quickTo(cuerpo.current, "x", { duration: 0.9, ease: "power3.out" });

    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
      const ny = ((e.clientY - r.top) / r.height) * 2 - 1;
      rotY(nx * 7);
      rotX(-ny * 7);
      mx(nx * 16);
      my(ny * 12);
      tx(nx * 7);
    };
    const reset = () => {
      rotX(0); rotY(0); mx(0); my(0); tx(0);
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", reset);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", reset);
    };
  }, []);

  return (
    <article
      ref={card}
      className="group relative flex h-full flex-col items-center overflow-hidden rounded-[2rem] border-2 p-6 text-center sombra-suave sm:p-7"
      style={{
        backgroundColor: look.fondo,
        borderColor: look.borde,
        transformStyle: "preserve-3d",
        perspective: 900,
      }}
    >
      {/* Motivo de identidad: estrella para Yurany, espiral para Joseph. */}
      <span
        className="pointer-events-none absolute -right-10 -top-10 opacity-[0.13]"
        aria-hidden="true"
      >
        {Estrella ? (
          <Star className="size-40" style={{ fill: look.anillo, color: look.anillo }} />
        ) : (
          <Espiral className="size-40" style={{ color: "var(--color-turquesa-medio)" }} />
        )}
      </span>

      <div className="relative shrink-0">
        <img
          ref={img}
          src={p.img}
          alt={`Retrato de ${p.nombre}, equipo SonArte`}
          width="480"
          height="480"
          loading="lazy"
          className="size-40 rounded-full border-4 bg-crema object-cover"
          style={{ borderColor: look.anillo, objectPosition: look.retrato }}
        />
        <span
          className={`absolute -bottom-1 -right-1 grid size-10 place-items-center rounded-full border-2 transition-transform duration-500 group-hover:rotate-12 ${look.sello}`}
          style={{ borderColor: look.borde }}
          aria-hidden="true"
        >
          {Estrella ? (
            <Star className="size-5" style={{ fill: "currentColor" }} />
          ) : (
            <Espiral className="size-5" />
          )}
        </span>
      </div>

      <div ref={cuerpo} className="relative flex w-full flex-1 flex-col items-center">
        <h3 className={`mt-5 text-[2rem] leading-none ${look.nombre}`}>{p.nombre}</h3>
        <p
          className={`mt-3 flex min-h-10 items-center justify-center text-xs font-semibold uppercase leading-snug tracking-[0.16em] ${look.rol}`}
        >
          {p.rol}
        </p>
        <span className={`mt-4 h-[3px] w-16 shrink-0 rounded-full ${look.divisor}`} aria-hidden="true" />
        <p className="mt-4 flex-1 text-[15px] leading-relaxed text-marron/80">{p.texto}</p>
        <p className={`mt-5 font-marca text-2xl leading-none ${look.firma}`} aria-hidden="true">
          {p.nombre}
        </p>
      </div>
    </article>
  );
}

export default function Nosotros() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-crema pt-40 pb-28">
      {/* Fondo estilo lámpara de lava */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-32 top-10 size-[26rem] rounded-full bg-terracota/25 blur-3xl anim-lava" />
        <div className="absolute right-[-8rem] top-1/3 size-[30rem] rounded-full bg-turquesa/30 blur-3xl anim-lava" style={{ animationDelay: "4s", animationDuration: "22s" }} />
        <div className="absolute bottom-0 left-1/3 size-[24rem] rounded-full bg-salmon/25 blur-3xl anim-lava" style={{ animationDelay: "8s", animationDuration: "26s" }} />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-5">
        <Reveal dir="scale">
          <Espiral className="mx-auto size-16 text-terracota anim-girar-lento" />
          <h1 className="mt-7 text-center font-serif text-5xl text-marron sm:text-6xl">Nosotros</h1>
          <p className="mx-auto mt-5 max-w-2xl text-center text-lg leading-relaxed text-muted-foreground">
            SonArte nace del cruce entre la ilustración y la música tropical: un espiral que crece, gira y vuelve siempre a su raíz.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-7 md:grid-cols-2">
          <Reveal dir="right">
            <div className="h-full rounded-[2rem] superficie-caribe p-8 text-crema sombra-suave">
              <h2 className="font-serif text-3xl">Misión</h2>
              <p className="mt-4 leading-relaxed text-crema/90">{MARCA.mision}</p>
            </div>
          </Reveal>
          <Reveal dir="left">
            <div className="h-full rounded-[2rem] bg-verde-oscuro p-8 text-crema sombra-suave">
              <h2 className="font-serif text-3xl">Visión</h2>
              <p className="mt-4 leading-relaxed text-crema/90">{MARCA.vision}</p>
            </div>
          </Reveal>
        </div>

        <Reveal className="mt-20">
          <h2 className="text-center font-serif text-4xl text-marron">Valores</h2>
        </Reveal>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALORES.map((v, i) => {
            const bloque = bloques[i % bloques.length];
            return (
              <Reveal key={v.titulo} delay={i * 0.1} className="h-full">
                <article
                  className={`group relative flex h-full flex-col overflow-hidden rounded-tl-[2.5rem] rounded-br-[2.5rem] rounded-tr-lg rounded-bl-lg p-7 text-crema sombra-suave transition-transform duration-500 hover:-translate-y-2 ${bloque.fondo}`}
                >
                  <span className={`absolute inset-y-0 left-0 w-1.5 ${bloque.barra}`} aria-hidden="true" />
                  <span className="grid size-12 place-items-center rounded-full bg-crema/20">
                    <Espiral className="size-7 anim-girar-lento" />
                  </span>
                  <h3 className="mt-5 font-serif text-2xl">{v.titulo}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-crema/85">{v.texto}</p>
                </article>
              </Reveal>
            );
          })}
        </div>

        {/* Identidad de marca */}
        <Reveal className="mt-20">
          <h2 className="text-center font-serif text-4xl text-marron">Nuestra identidad</h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-muted-foreground">
            La paleta, las tipografías y el espiral: todo el sistema visual quedó sistematizado en nuestro Manual de marca.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-10 grid gap-4 sm:grid-cols-4 lg:grid-cols-8">
            {IDENTIDAD.paleta.map((c) => (
              <div key={c.hex} className="overflow-hidden rounded-2xl border border-marron/15 bg-crema sombra-suave">
                <div className="h-16 w-full" style={{ backgroundColor: c.hex }} />
                <div className="p-3">
                  <p className="text-xs font-semibold text-marron">{c.nombre}</p>
                  <p className="text-[11px] text-muted-foreground">{c.hex}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {IDENTIDAD.tipografias.map((t) => (
            <Reveal key={t.nombre} delay={0.05}>
              <div className="h-full rounded-[1.75rem] border border-terracota/20 bg-crema/85 p-6">
                <p className={`${t.clase} text-3xl text-marron`}>{t.nombre}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.18em] text-terracota">{t.uso}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15}>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a
              href={asset("/docs/manual-de-marca.pdf")}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full superficie-caribe px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.16em] text-crema sombra-suave transition-all duration-500 hover:-translate-y-1 hover:sombra-flotante"
            >
              Manual de marca (PDF)
            </a>
          </div>
        </Reveal>

        {/* Equipo */}
        <Reveal className="mt-20">
          <h2 className="text-center font-serif text-4xl text-marron">Quiénes lo hacemos</h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-muted-foreground">Dos personas, un mismo compás.</p>
        </Reveal>
        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          {EQUIPO.map((p, i) => (
            <Reveal key={p.nombre} dir="up" delay={i * 0.12} className="h-full">
              <CardIntegrante p={p} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
