import { useEffect, useState } from "react";
import { Espiral } from "./Espirales.jsx";

/**
 * Visor 3D de un personaje con <model-viewer>.
 *
 * El paquete pesa más que todo el resto del sitio, así que se carga solo
 * cuando alguien abre de verdad el detalle de la etapa 3D (import dinámico).
 * El custom element se registra una única vez, aunque se abra el modal varias veces.
 */
let carga = null;
function cargarModelViewer() {
  if (!carga) carga = import("@google/model-viewer");
  return carga;
}

export function Visor3D({ src, alt, nota }) {
  const [listo, setListo] = useState(false);

  useEffect(() => {
    let vivo = true;
    cargarModelViewer()
      .then(() => {
        if (vivo) setListo(true);
      })
      .catch(() => {
        if (vivo) setListo(false);
      });
    return () => {
      vivo = false;
    };
  }, []);

  return (
    <figure className="overflow-hidden rounded-[1.75rem] border-4 border-marron/15 bg-noche/5">
      <div className="relative h-[22rem] w-full sm:h-[28rem]">
        {listo ? (
          <model-viewer
            src={src}
            alt={alt}
            camera-controls
            auto-rotate
            auto-rotate-delay="1500"
            rotation-per-second="18deg"
            shadow-intensity="1"
            exposure="1.05"
            environment-image="neutral"
            camera-orbit="0deg 78deg 105%"
            min-camera-orbit="auto auto 60%"
            max-camera-orbit="auto auto 220%"
            touch-action="pan-y"
            style={{ width: "100%", height: "100%", display: "block", backgroundColor: "transparent" }}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3">
            <Espiral className="size-10 text-terracota anim-girar-lento" />
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-marron/60">
              Cargando visor 3D
            </p>
          </div>
        )}
      </div>
      {nota ? (
        <figcaption className="border-t border-terracota/15 bg-crema px-4 py-3 text-center text-xs text-muted-foreground">
          {nota}
        </figcaption>
      ) : null}
    </figure>
  );
}
