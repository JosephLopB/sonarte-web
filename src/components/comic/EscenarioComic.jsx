import { useEffect, useState } from "react";
import { AlertTriangle, Play, RotateCcw } from "lucide-react";
import { asset } from "../../lib/asset.js";
import { Espiral } from "../Espirales.jsx";

export function EscenarioComic({
  grupo,
  iframeRef,
  onIframeLoad,
  videoRef,
  onVideoEnded,
  onVideoError,
  onVideoLoaded,
  cargando,
  error,
  tardando = false,
  onReintentar,
  onAbrirAparte,
}) {
  const [reproducido, setReproducido] = useState(false);

  useEffect(() => {
    setReproducido(false);
  }, [grupo.id]);

  if (grupo.tipo === "video") {
    return (
      <div className="relative h-full w-full overflow-hidden bg-black">
        <video
          ref={videoRef}
          key={grupo.id}
          src={asset(grupo.video)}
          poster={asset(grupo.poster)}
          controls={reproducido}
          playsInline
          preload="metadata"
          className="h-full w-full object-contain"
          onPlay={() => setReproducido(true)}
          onLoadedData={onVideoLoaded}
          onEnded={onVideoEnded}
          onError={onVideoError}
        />

        {!reproducido && !error ? (
          <button
            type="button"
            onClick={() => videoRef.current?.play()}
            className="absolute inset-0 z-10 grid place-items-center bg-gradient-to-t from-black/70 via-black/10 to-black/30 text-crema transition hover:bg-black/40"
            aria-label={`Reproducir ${grupo.titulo}`}
          >
            <span className="flex flex-col items-center gap-3">
              <span className="grid size-16 place-items-center rounded-full border-2 border-crema/60 bg-[#0b0908]/70 backdrop-blur-sm transition hover:scale-105 hover:border-turquesa hover:text-turquesa sm:size-20">
                <Play className="size-7 fill-current sm:size-8" />
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.26em] text-crema/70">
                Reproducir la escena
              </span>
            </span>
          </button>
        ) : null}

        {error ? <MensajeError onReintentar={onReintentar} onAbrirAparte={onAbrirAparte} /> : null}
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-black">
      <iframe
        ref={iframeRef}
        key={grupo.id}
        src={asset(grupo.ruta)}
        title={`${grupo.titulo} — escena interactiva de SonArte`}
        className="absolute inset-0 h-full w-full border-0 bg-black"
        allow="autoplay; fullscreen; picture-in-picture"
        onLoad={onIframeLoad}
      />

      {cargando && !error ? (
        <div className="pointer-events-none absolute inset-0 z-10 grid place-items-center bg-[#080706]">
          <div className="flex flex-col items-center gap-4">
            <Espiral className="size-10 animate-spin text-turquesa/80" />
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-crema/45">
              Preparando la escena
            </p>
            {tardando ? (
              <a
                href={onAbrirAparte}
                target="_blank"
                rel="noreferrer"
                className="pointer-events-auto rounded-full border border-crema/20 px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-crema/55 transition hover:border-turquesa hover:text-turquesa"
              >
                Abrir en pestaña nueva
              </a>
            ) : null}
          </div>
        </div>
      ) : null}

      {error ? <MensajeError onReintentar={onReintentar} onAbrirAparte={onAbrirAparte} /> : null}
    </div>
  );
}

function MensajeError({ onReintentar, onAbrirAparte }) {
  return (
    <div className="absolute inset-0 z-20 grid place-items-center bg-[#080706]/95 p-6">
      <div className="max-w-md text-center">
        <AlertTriangle className="mx-auto size-8 text-salmon" />
        <p className="mt-3 font-serif text-2xl text-crema">La escena no cargó</p>
        <p className="mt-2 text-sm leading-relaxed text-crema/55">
          Revisa la conexión e inténtalo de nuevo. Si el problema sigue, puedes abrir esta pieza
          en una pestaña aparte.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={onReintentar}
            className="inline-flex items-center gap-2 rounded-full bg-turquesa px-5 py-2.5 text-xs font-bold uppercase tracking-[0.16em] text-marron"
          >
            <RotateCcw className="size-3.5" />
            Reintentar
          </button>
          {onAbrirAparte ? (
            <a
              href={onAbrirAparte}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-crema/20 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-crema/60 transition hover:border-crema/40 hover:text-crema"
            >
              Abrir aparte
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}
