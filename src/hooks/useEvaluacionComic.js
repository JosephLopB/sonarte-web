import { useCallback, useEffect, useRef, useState } from "react";
import { itemsDeEje, PAUSAS } from "../data/evaluacion.js";

const CLAVE = "sonarte:comic:evaluacion:v1";
const VACIO = { respuestas: {}, pausas: {} };

/** Respuestas guardadas, sin suscribirse: la página de evaluación las reutiliza. */
export function leerEvaluacion() {
  if (typeof window === "undefined") return VACIO;
  try {
    const crudo = JSON.parse(window.localStorage.getItem(CLAVE) || "null");
    if (!crudo || typeof crudo !== "object") return VACIO;

    const respuestas = {};
    if (crudo.respuestas && typeof crudo.respuestas === "object") {
      Object.entries(crudo.respuestas).forEach(([id, valor]) => {
        if (typeof valor === "string" && valor) respuestas[id] = valor;
      });
    }

    const pausas = {};
    if (crudo.pausas && typeof crudo.pausas === "object") {
      Object.entries(crudo.pausas).forEach(([capitulo, estado]) => {
        if (estado === "respondida" || estado === "saltada") pausas[capitulo] = estado;
      });
    }

    return { respuestas, pausas };
  } catch {
    return VACIO;
  }
}

/**
 * Respuestas que se van dando dentro del cómic.
 *
 * Se guardan en el mismo navegador: si el lector cierra la pestaña a mitad de
 * capítulo, al volver las preguntas ya contestadas siguen ahí y el formulario
 * final las trae puestas.
 */
export function useEvaluacionComic() {
  const [datos, setDatos] = useState(leerEvaluacion);
  const primera = useRef(true);

  useEffect(() => {
    if (primera.current) {
      primera.current = false;
      return;
    }
    try {
      window.localStorage.setItem(CLAVE, JSON.stringify(datos));
    } catch {
      /* sin almacenamiento: la evaluación sigue, pero no recuerda */
    }
  }, [datos]);

  const responder = useCallback((id, valor) => {
    setDatos((previos) => {
      const respuestas = { ...previos.respuestas, [id]: String(valor) };
      const pausa = PAUSAS.find((item) => itemsDeEje(item.eje).some((pregunta) => pregunta.id === id));
      const pausas = pausa && itemsDeEje(pausa.eje).every((pregunta) => respuestas[pregunta.id])
        ? { ...previos.pausas, [String(pausa.capitulo)]: "respondida" }
        : previos.pausas;
      return { ...previos, respuestas, pausas };
    });
  }, []);

  const responderVarias = useCallback((respuestas) => {
    setDatos((previos) => ({
      ...previos,
      respuestas: { ...previos.respuestas, ...respuestas },
    }));
  }, []);

  /** Cierra una pausa: respondida si están todos sus ítems, saltada si no. */
  const resolverPausa = useCallback((capitulo, saltada) => {
    setDatos((previos) => ({
      ...previos,
      pausas: { ...previos.pausas, [String(capitulo)]: saltada ? "saltada" : "respondida" },
    }));
  }, []);

  const estadoPausa = useCallback(
    (capitulo) => datos.pausas[String(capitulo)] ?? "pendiente",
    [datos.pausas],
  );

  const pausasSaltadas = Object.entries(datos.pausas)
    .filter(([, estado]) => estado === "saltada")
    .map(([capitulo]) => Number(capitulo));

  const responderTodo = Object.values(datos.respuestas).filter(Boolean).length;

  const limpiar = useCallback(() => setDatos(VACIO), []);

  return {
    respuestas: datos.respuestas,
    responder,
    responderVarias,
    resolverPausa,
    estadoPausa,
    pausasSaltadas,
    responderTodo,
    limpiar,
  };
}
