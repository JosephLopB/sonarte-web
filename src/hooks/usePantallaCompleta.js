import { useCallback, useEffect, useRef, useState } from "react";

/** Pantalla completa nativa, con el contenedor de la experiencia como objetivo. */
export function usePantallaCompleta() {
  const ref = useRef(null);
  const [activa, setActiva] = useState(false);

  useEffect(() => {
    const actualizar = () => setActiva(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", actualizar);
    actualizar();
    return () => document.removeEventListener("fullscreenchange", actualizar);
  }, []);

  const alternar = useCallback(async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        return;
      }
      const el = ref.current;
      if (!el) return;
      await el.requestFullscreen();
    } catch {
      /* El navegador puede bloquearlo (iOS, iframe, permisos). */
    }
  }, []);

  const salir = useCallback(async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
    } catch {
      /* sin pantalla completa nativa */
    }
  }, []);

  return { ref, activa, alternar, salir };
}
