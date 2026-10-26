import { useCallback, useEffect, useRef, useState } from "react";

const CLAVE = "sonarte:comic:progreso:v1";
const INICIAL = {
  escenaId: null,
  completadas: [],
  extrasVistos: [],
  modoCine: false,
  actualizado: null,
};

function leer() {
  if (typeof window === "undefined") return INICIAL;
  try {
    const crudo = JSON.parse(window.localStorage.getItem(CLAVE) || "null");
    if (!crudo || typeof crudo !== "object") return INICIAL;
    return {
      escenaId: typeof crudo.escenaId === "string" ? crudo.escenaId : null,
      completadas: Array.isArray(crudo.completadas) ? crudo.completadas.filter((x) => typeof x === "string") : [],
      extrasVistos: Array.isArray(crudo.extrasVistos) ? crudo.extrasVistos.filter((x) => typeof x === "string") : [],
      modoCine: Boolean(crudo.modoCine),
      actualizado: typeof crudo.actualizado === "string" ? crudo.actualizado : null,
    };
  } catch {
    return INICIAL;
  }
}

/** Progreso del cómic en localStorage: pieza actual, completadas y extras vistos. */
export function useProgresoComic() {
  const [progreso, setProgreso] = useState(leer);
  const primera = useRef(true);

  useEffect(() => {
    if (primera.current) {
      primera.current = false;
      return;
    }
    try {
      window.localStorage.setItem(CLAVE, JSON.stringify(progreso));
    } catch {
      /* almacenamiento no disponible: la experiencia sigue sin persistir */
    }
  }, [progreso]);

  const visitar = useCallback((escenaId) => {
    setProgreso((p) => ({ ...p, escenaId, actualizado: new Date().toISOString() }));
  }, []);

  const completar = useCallback((escenaId) => {
    setProgreso((p) =>
      p.completadas.includes(escenaId)
        ? p
        : { ...p, completadas: [...p.completadas, escenaId], actualizado: new Date().toISOString() },
    );
  }, []);

  const marcarExtra = useCallback((extraId) => {
    setProgreso((p) =>
      p.extrasVistos.includes(extraId)
        ? p
        : { ...p, extrasVistos: [...p.extrasVistos, extraId], actualizado: new Date().toISOString() },
    );
  }, []);

  const fijarModoCine = useCallback((modoCine) => {
    setProgreso((p) => ({ ...p, modoCine }));
  }, []);

  const reiniciar = useCallback(() => {
    setProgreso({ ...INICIAL, actualizado: new Date().toISOString() });
  }, []);

  return { progreso, visitar, completar, marcarExtra, fijarModoCine, reiniciar };
}
