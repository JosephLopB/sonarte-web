import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { Espiral } from "./Espirales.jsx";
import { Visor3D } from "./Visor3D.jsx";

/**
 * Lightbox de una etapa del proceso.
 * Se abre desde cada tarjeta de la línea de tiempo de /proceso y amplía la
 * información con textos, listas, galerías, videos y el visor 3D.
 */

const COLUMNAS = {
  1: "",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
};

function TituloBloque({ children }) {
  if (!children) return null;
  return <h3 className="font-serif text-2xl text-marron">{children}</h3>;
}

function BloqueTexto({ bloque }) {
  return (
    <section>
      <TituloBloque>{bloque.titulo}</TituloBloque>
      {bloque.parrafos.map((parrafo, i) => (
        <p key={i} className={`leading-relaxed text-marron/80 ${bloque.titulo || i > 0 ? "mt-3" : ""}`}>
          {parrafo}
        </p>
      ))}
    </section>
  );
}

function BloqueLista({ bloque }) {
  return (
    <section>
      <TituloBloque>{bloque.titulo}</TituloBloque>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {bloque.items.map((item) => (
          <li
            key={item}
            className="flex gap-3 rounded-2xl border border-terracota/15 bg-card/60 p-4 text-sm leading-relaxed text-marron/85"
          >
            <Espiral className="mt-0.5 size-4 shrink-0 text-terracota" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function TarjetaMedia({ item, alto = "h-64", ajuste = "cover" }) {
  return (
    <figure className="flex h-full flex-col overflow-hidden rounded-2xl border border-terracota/20 bg-card/50">
      <div className={`${alto} w-full shrink-0 overflow-hidden bg-noche/5`}>
        <img
          src={item.src}
          alt={item.alt}
          loading="lazy"
          className={`h-full w-full ${ajuste === "contain" ? "object-contain" : "object-cover object-top"}`}
        />
      </div>
      {item.caption ? (
        <figcaption className="flex-1 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
          {item.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

function BloqueGaleria({ bloque }) {
  const { items, columnas = 2, alto = "h-64", ajuste = "cover" } = bloque;

  if (columnas === "carrusel") {
    return (
      <section>
        <TituloBloque>{bloque.titulo}</TituloBloque>
        <div className="-mx-2 mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-2 pb-3">
          {items.map((item) => (
            <div key={item.src} className="w-[14rem] shrink-0 snap-start sm:w-[17rem]">
              <TarjetaMedia item={item} alto={alto} ajuste={ajuste} />
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">Desliza para ver todas las pantallas.</p>
      </section>
    );
  }

  return (
    <section>
      <TituloBloque>{bloque.titulo}</TituloBloque>
      <div className={`mt-4 grid gap-4 ${COLUMNAS[columnas] ?? COLUMNAS[2]}`}>
        {items.map((item) => (
          <TarjetaMedia key={item.src} item={item} alto={alto} ajuste={ajuste} />
        ))}
      </div>
    </section>
  );
}

function BloqueVideos({ bloque }) {
  return (
    <section>
      <TituloBloque>{bloque.titulo}</TituloBloque>
      <div className="mt-4 grid gap-5 lg:grid-cols-2">
        {bloque.items.map((video) => {
          const bucle = Boolean(video.bucle);
          return (
            <figure key={video.src} className="overflow-hidden rounded-[1.5rem] border-4 border-marron/15 bg-noche">
              <video
                src={video.src}
                controls={!bucle}
                autoPlay={bucle}
                loop={bucle}
                muted={bucle}
                playsInline
                preload="metadata"
                className="aspect-video w-full object-contain"
              />
              <figcaption className="bg-crema px-4 py-3">
                <p className="font-serif text-lg text-marron">{video.titulo}</p>
                {video.nota ? (
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{video.nota}</p>
                ) : null}
              </figcaption>
            </figure>
          );
        })}
      </div>
    </section>
  );
}

function Bloque3D({ bloque }) {
  return (
    <section>
      <TituloBloque>{bloque.titulo}</TituloBloque>
      <div className="mt-4">
        <Visor3D src={bloque.src} alt={bloque.alt} nota={bloque.nota} />
      </div>
    </section>
  );
}

function Bloque({ bloque }) {
  switch (bloque.tipo) {
    case "texto":
      return <BloqueTexto bloque={bloque} />;
    case "lista":
      return <BloqueLista bloque={bloque} />;
    case "galeria":
      return <BloqueGaleria bloque={bloque} />;
    case "videos":
      return <BloqueVideos bloque={bloque} />;
    case "modelo3d":
      return <Bloque3D bloque={bloque} />;
    default:
      return null;
  }
}

export function ModalEtapa({ etapa, onCerrar }) {
  const panel = useRef(null);
  const [visible, setVisible] = useState(false);

  /* Pequeña entrada animada del panel */
  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  /* Bloqueo de scroll, cierre con Escape, foco y trampa de tabulación */
  useEffect(() => {
    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.current?.focus();

    const onTecla = (evento) => {
      if (evento.key === "Escape") {
        onCerrar();
        return;
      }
      if (evento.key !== "Tab" || !panel.current) return;
      const focales = Array.from(
        panel.current.querySelectorAll(
          'button:not([disabled]), [href], video, model-viewer, input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (focales.length === 0) return;
      const primero = focales[0];
      const ultimo = focales[focales.length - 1];
      if (evento.shiftKey && document.activeElement === primero) {
        evento.preventDefault();
        ultimo.focus();
      } else if (!evento.shiftKey && document.activeElement === ultimo) {
        evento.preventDefault();
        primero.focus();
      }
    };

    document.addEventListener("keydown", onTecla);
    return () => {
      document.body.style.overflow = overflowAnterior;
      document.removeEventListener("keydown", onTecla);
    };
  }, [onCerrar]);

  return (
    <div className="fixed inset-0 z-[90] flex items-stretch justify-center" role="presentation">
      <button
        type="button"
        tabIndex={-1}
        aria-label="Cerrar el detalle"
        onClick={onCerrar}
        className={`absolute inset-0 cursor-default bg-noche/75 backdrop-blur-sm transition-opacity duration-300 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`detalle-${etapa.id}`}
        tabIndex={-1}
        className={`relative z-10 flex max-h-full w-full max-w-4xl flex-col overflow-hidden bg-crema sombra-flotante outline-none transition-all duration-300 ease-out sm:my-6 sm:max-h-[92vh] sm:rounded-[2rem] ${
          visible ? "translate-y-0 scale-100 opacity-100" : "translate-y-4 scale-[0.98] opacity-0"
        }`}
      >
        <header className="flex shrink-0 items-start gap-4 superficie-profunda px-5 py-5 text-crema sm:px-8 sm:py-6">
          <span className="font-impacto text-4xl leading-none text-turquesa/80">{etapa.numero}</span>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-turquesa">
              {etapa.herramienta}
            </p>
            <h2 id={`detalle-${etapa.id}`} className="mt-1 font-serif text-3xl">
              {etapa.titulo}
            </h2>
            {etapa.modal.subtitulo ? (
              <p className="mt-2 text-sm leading-relaxed text-crema/80">{etapa.modal.subtitulo}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar el detalle"
            className="grid size-10 shrink-0 place-items-center rounded-full border border-crema/25 transition-colors duration-300 hover:bg-crema/10"
          >
            <X className="size-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-7 sm:px-8 sm:py-9">
          <div className="flex flex-col gap-9">
            {etapa.modal.bloques.map((bloque, i) => (
              <Bloque key={`${etapa.id}-${i}`} bloque={bloque} />
            ))}
          </div>
        </div>

        <footer className="flex shrink-0 items-center justify-between gap-4 border-t border-terracota/20 px-5 py-4 sm:px-8">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-terracota/80">
            Etapa {etapa.numero} · {etapa.titulo}
          </span>
          <button
            type="button"
            onClick={onCerrar}
            className="rounded-full border-2 border-terracota px-5 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-terracota transition-colors duration-300 hover:bg-terracota hover:text-crema"
          >
            Cerrar
          </button>
        </footer>
      </div>
    </div>
  );
}
