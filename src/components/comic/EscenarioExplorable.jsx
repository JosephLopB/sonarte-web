import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Check, SkipForward } from "lucide-react";
import { gsap, prefiereMenosMovimiento } from "../../lib/gsap.js";
import { asset } from "../../lib/asset.js";

/** Fondo de una escena: video real detenido en un fotograma o una imagen original. */
export function FondoEscena({ fondo, className = "" }) {
  const videoRef = useRef(null);
  const [listo, setListo] = useState(fondo.tipo !== "video");

  const colocarFotograma = () => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration) || !video.duration) return;
    const t = Math.min(Math.max(fondo.tiempo ?? 1, 0.05), Math.max(0.05, video.duration - 0.1));
    if (Math.abs(video.currentTime - t) > 0.05) video.currentTime = t;
    setListo(true);
  };

  if (fondo.tipo === "video") {
    return (
      <div className={`relative h-full w-full overflow-hidden bg-[#0b0908] ${className}`}>
        <video
          ref={videoRef}
          src={asset(fondo.src)}
          muted
          playsInline
          preload="metadata"
          aria-hidden="true"
          className="h-full w-full object-cover"
          onLoadedMetadata={colocarFotograma}
          onSeeked={() => setListo(true)}
        />
        {!listo ? (
          <span className="absolute inset-0 grid place-items-center bg-[#0b0908]">
            <span className="h-px w-24 overflow-hidden rounded-full bg-crema/10">
              <span className="block h-full w-1/3 animate-pulse rounded-full bg-turquesa/70" />
            </span>
          </span>
        ) : null}
      </div>
    );
  }

  return (
    <img
      src={asset(fondo.src)}
      alt={fondo.alt ?? ""}
      className={`h-full w-full object-cover ${className}`}
      draggable={false}
    />
  );
}

/** Puntos interactivos sobre una escena real. */
function Hotspots({ hotspots = [], extrasVistos = [], onAbrirExtra, onAcercar, visible = true }) {
  if (!visible) return null;

  return (
    <>
      {hotspots.map((hotspot) => {
        const visto = extrasVistos.includes(hotspot.extraId);
        const Icono = hotspot.icono;
        return (
          <button
            key={hotspot.id}
            type="button"
            data-hotspot
            onClick={() => onAbrirExtra?.(hotspot.extraId)}
            onMouseEnter={() => onAcercar?.(hotspot)}
            onFocus={() => onAcercar?.(hotspot)}
            aria-label={`${hotspot.etiqueta}: abrir extra`}
            className="group absolute z-30 -translate-x-1/2 -translate-y-1/2 focus-visible:outline-none"
            style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
          >
            <span
              className={`relative grid size-11 place-items-center rounded-full border-2 text-lg shadow-[0_8px_24px_-10px_rgba(0,0,0,0.9)] backdrop-blur-sm transition duration-300 sm:size-14 sm:text-2xl ${
                visto
                  ? "border-turquesa/80 bg-[#0b0908]/75 text-turquesa"
                  : "anim-pulso-halo border-salmon/70 bg-[#0b0908]/65 text-crema group-hover:scale-110 group-hover:border-salmon group-hover:bg-crema group-hover:text-marron group-focus-visible:scale-110 group-focus-visible:border-salmon group-focus-visible:bg-crema group-focus-visible:text-marron"
              }`}
            >
              {visto ? (
                <Check className="size-4 sm:size-5" aria-hidden="true" />
              ) : (
                <Icono className="size-4 sm:size-5" aria-hidden="true" />
              )}
            </span>
            <span
              className={`pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] transition group-hover:opacity-100 group-focus-visible:opacity-100 sm:text-[10px] ${
                visto
                  ? "bg-turquesa/15 text-turquesa opacity-70"
                  : "bg-salmon text-marron opacity-0"
              }`}
            >
              {hotspot.etiqueta}
            </span>
          </button>
        );
      })}
    </>
  );
}

/** Pausa sin botones que se resuelve sola, con opción de saltarla. */
function PausaEscena({ segundos = 5, onCompletar }) {
  const barra = useRef(null);
  const [restante, setRestante] = useState(segundos);
  const [hecho, setHecho] = useState(false);
  const completo = useRef(onCompletar);
  completo.current = onCompletar;

  useEffect(() => {
    if (prefiereMenosMovimiento()) {
      setHecho(true);
      completo.current?.();
      return;
    }

    let vivo = true;
    const tl = gsap.timeline({
      onComplete: () => {
        if (!vivo) return;
        setHecho(true);
        completo.current?.();
      },
    });
    if (barra.current) {
      tl.fromTo(barra.current, { width: "0%" }, { width: "100%", duration: segundos, ease: "none" });
    }
    const reloj = window.setInterval(() => {
      if (vivo) setRestante((n) => Math.max(0, n - 1));
    }, 1000);

    return () => {
      vivo = false;
      tl.kill();
      window.clearInterval(reloj);
    };
  }, [segundos]);

  if (hecho) return null;

  return (
    <div className="absolute inset-0 z-40 grid place-items-center bg-[#080706]/55 px-6 text-center backdrop-blur-[2px]">
      <div className="max-w-md">
        <p className="text-[10px] font-semibold uppercase tracking-[0.38em] text-turquesa">Silencio</p>
        <p className="mt-3 font-serif text-2xl leading-snug text-crema sm:text-3xl">
          Aquí no hay nada que tocar. Solo esperar con la familia.
        </p>
        <div className="mx-auto mt-6 h-1.5 w-48 overflow-hidden rounded-full bg-crema/15">
          <div ref={barra} className="h-full rounded-full bg-turquesa" />
        </div>
        <p className="mt-3 text-[10px] uppercase tracking-[0.2em] text-crema/40">
          {restante > 0 ? `${restante}s` : "..."}
        </p>
        <button
          type="button"
          onClick={() => completo.current?.()}
          className="mt-5 inline-flex items-center gap-2 rounded-full border border-crema/20 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-crema/65 transition hover:border-crema/45 hover:text-crema"
        >
          <SkipForward className="size-3.5" aria-hidden="true" />
          Saltar el silencio
        </button>
      </div>
    </div>
  );
}

function EscenaSimple({ parada, extrasVistos, onAbrirExtra }) {
  const escenario = useRef(null);
  const capa = useRef(null);
  const luz = useRef(null);
  const [pausaCompleta, setPausaCompleta] = useState(parada.modo !== "pausa");

  useLayoutEffect(() => {
    const el = escenario.current;
    const fondo = capa.current;
    const punto = luz.current;
    if (!el || !fondo || !punto) return;

    gsap.set(fondo, { scale: 1.035 });
    const rect = el.getBoundingClientRect();
    gsap.set(punto, {
      x: rect.width * 0.5,
      y: rect.height * 0.5,
      opacity: 0,
      xPercent: -50,
      yPercent: -50,
    });

    if (prefiereMenosMovimiento() || window.matchMedia("(pointer: coarse)").matches) return;

    const qx = gsap.quickTo(punto, "x", { duration: 0.55, ease: "power3.out" });
    const qy = gsap.quickTo(punto, "y", { duration: 0.55, ease: "power3.out" });
    const fx = gsap.quickTo(fondo, "x", { duration: 1.1, ease: "power3.out" });
    const fy = gsap.quickTo(fondo, "y", { duration: 1.1, ease: "power3.out" });
    let visible = false;

    const mover = (e) => {
      if (e.pointerType === "touch") return;
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      if (!visible) {
        visible = true;
        gsap.to(punto, { opacity: 1, duration: 0.35 });
      }
      qx(x);
      qy(y);
      const nx = x / Math.max(1, r.width) - 0.5;
      const ny = y / Math.max(1, r.height) - 0.5;
      fx(nx * -6);
      fy(ny * -4);
    };

    const salir = () => {
      visible = false;
      gsap.to(punto, { opacity: 0, duration: 0.35 });
      fx(0);
      fy(0);
    };

    const acercar = (hotspot) => {
      const r = el.getBoundingClientRect();
      qx((hotspot.x / 100) * r.width);
      qy((hotspot.y / 100) * r.height);
      gsap.to(punto, { opacity: 1, duration: 0.25 });
    };

    el.addEventListener("pointermove", mover);
    el.addEventListener("pointerleave", salir);
    el._acercarExploracion = acercar;

    return () => {
      el.removeEventListener("pointermove", mover);
      el.removeEventListener("pointerleave", salir);
      delete el._acercarExploracion;
      qx.tween.kill();
      qy.tween.kill();
      fx.tween.kill();
      fy.tween.kill();
    };
  }, [parada.id]);

  const acercar = (hotspot) => escenario.current?._acercarExploracion?.(hotspot);

  return (
    <div
      ref={escenario}
      className="relative h-full w-full overflow-hidden bg-[#0b0908]"
      aria-label={parada.fondo.alt}
    >
      <div ref={capa} className="absolute inset-0 will-change-transform">
        <FondoEscena fondo={parada.fondo} className="h-full w-full" />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080706]/80 via-[#080706]/10 to-[#080706]/45" />
      <div className="pointer-events-none absolute inset-0 bg-[#080706]/20" />

      <div
        ref={luz}
        className="pointer-events-none absolute left-0 top-0 hidden aspect-square w-[52%] rounded-full bg-[radial-gradient(circle,rgba(255,241,207,0.26),rgba(255,241,207,0.08)_42%,transparent_70%)] mix-blend-screen md:block"
        aria-hidden="true"
      />

      <Hotspots
        hotspots={parada.hotspots}
        extrasVistos={extrasVistos}
        onAbrirExtra={onAbrirExtra}
        onAcercar={acercar}
        visible={pausaCompleta}
      />

      {parada.modo === "pausa" && !pausaCompleta ? (
        <PausaEscena segundos={parada.pausa ?? 5} onCompletar={() => setPausaCompleta(true)} />
      ) : null}
    </div>
  );
}

function EscenaDoble({ parada, extrasVistos, onAbrirExtra }) {
  return (
    <div className="flex h-full w-full overflow-hidden bg-[#0b0908]">
      {parada.paneles.map((panel, indice) => (
        <section
          key={panel.id}
          className={`relative min-w-0 flex-1 overflow-hidden ${
            indice > 0 ? "border-l-2 border-crema/25" : ""
          }`}
          aria-label={panel.titulo}
        >
          <FondoEscena fondo={panel.fondo} className="h-full w-full" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080706]/85 via-[#080706]/15 to-[#080706]/45" />

          <div className="pointer-events-none absolute inset-x-0 top-12 z-20 px-3 sm:top-16 sm:px-5">
            <p className="w-fit rounded-md border border-crema/15 bg-[#080706]/65 px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.2em] text-turquesa backdrop-blur-sm sm:text-[9px]">
              {panel.titulo}
            </p>
            <p className="mt-1 w-fit max-w-[90%] text-[10px] leading-snug text-crema/70 sm:text-xs">
              {panel.nota}
            </p>
          </div>

          <Hotspots
            hotspots={panel.hotspots}
            extrasVistos={extrasVistos}
            onAbrirExtra={onAbrirExtra}
          />
        </section>
      ))}
    </div>
  );
}

export function EscenarioExplorable(props) {
  if (props.parada.modo === "doble") return <EscenaDoble {...props} />;
  return <EscenaSimple {...props} />;
}
