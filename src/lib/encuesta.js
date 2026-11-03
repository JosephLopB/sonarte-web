import { ABIERTAS, EJES, PERFIL, PREGUNTAS_SEGMENTO, SUS } from "../data/evaluacion.js";
import { CAPITULOS } from "../data/comicExperiencia.js";

/** Puntuación SUS (0–100) a partir de las diez respuestas. */
export function puntajeSus(respuestas) {
  if (!SUS.every((item) => respuestas[item.id])) return "";
  const bruto = SUS.reduce((suma, item, i) => {
    const valor = Number(respuestas[item.id]);
    if (!valor) return suma;
    return suma + (i % 2 === 0 ? valor - 1 : 5 - valor);
  }, 0);
  return Math.round(bruto * 2.5);
}

/** «2026-10-30 14:05», que Excel ordena y lee sin pelear. */
export function fechaLegible(fecha = new Date()) {
  const dos = (n) => String(n).padStart(2, "0");
  return `${fecha.getFullYear()}-${dos(fecha.getMonth() + 1)}-${dos(fecha.getDate())} ${dos(
    fecha.getHours(),
  )}:${dos(fecha.getMinutes())}`;
}

/**
 * Convierte las respuestas en una fila tabular: los nombres de columna viajan
 * con los valores para que la hoja y el Excel se armen solos en el destino.
 */
export function construirRegistro(respuestas, meta = {}) {
  const columnas = ["Fecha", "Nombre", "Correo"];
  const valores = [
    meta.fecha ?? fechaLegible(),
    respuestas.nombre?.trim() || "",
    respuestas.correo?.trim() || "",
  ];

  const agregar = (columna, valor) => {
    columnas.push(columna);
    valores.push(valor ?? "");
  };

  PERFIL.forEach((campo) => agregar(campo.columna, respuestas[campo.id]));
  Object.values(PREGUNTAS_SEGMENTO).forEach((grupo) => {
    grupo.preguntas.forEach((pregunta) => agregar(pregunta.columna, respuestas[pregunta.id]?.trim?.() ?? respuestas[pregunta.id]));
  });
  EJES.forEach((eje) => eje.items.forEach((item) => agregar(item.columna, respuestas[item.id])));
  SUS.forEach((item) => agregar(item.columna, respuestas[item.id]));
  agregar("SUS (0-100)", puntajeSus(respuestas));
  ABIERTAS.forEach((campo) => agregar(campo.columna, respuestas[campo.id]?.trim() || ""));
  agregar("Progreso del cómic", meta.progreso ?? "");
  agregar("Pausas saltadas", pausasTexto(meta.pausasSaltadas));
  agregar("Segundos en la encuesta", meta.segundos ?? "");
  agregar("Página", meta.pagina ?? "");

  return { columnas, valores };
}

/** «Prólogo · Capítulo II»: legible en la hoja, sin códigos sueltos. */
function pausasTexto(pausas) {
  if (!Array.isArray(pausas)) return "sin dato";
  if (!pausas.length) return "ninguna";
  return pausas
    .map((capitulo) => CAPITULOS.find((cap) => cap.id === Number(capitulo))?.nombre ?? `Pausa ${capitulo}`)
    .join(" · ");
}

const escapar = (valor) => {
  const texto = String(valor ?? "");
  return /[";\n\r]/.test(texto) ? `"${texto.replace(/"/g, '""')}"` : texto;
};

/**
 * CSV con punto y coma y BOM: es lo que Excel en español abre en columnas con
 * los acentos intactos, sin importar nada a mano.
 */
export function aCsv(columnas, valores) {
  return `\uFEFF${[columnas, valores].map((fila) => fila.map(escapar).join(";")).join("\r\n")}\r\n`;
}

export function descargarCsv(nombre, contenido) {
  const enlace = document.createElement("a");
  enlace.href = URL.createObjectURL(new Blob([contenido], { type: "text/csv;charset=utf-8" }));
  enlace.download = nombre;
  document.body.appendChild(enlace);
  enlace.click();
  enlace.remove();
  window.setTimeout(() => URL.revokeObjectURL(enlace.href), 4000);
}

export function endpointListo(endpoint) {
  if (typeof endpoint !== "string" || endpoint.includes("REEMPLAZAR")) return false;
  /* En desarrollo se admite un destino local para probar el envío sin publicar
     el script; en el sitio final solo vale https. */
  return /^https:\/\//.test(endpoint) || (import.meta.env.DEV && /^http:\/\/localhost/.test(endpoint));
}

/**
 * Envía la fila a la aplicación web de Apps Script.
 *
 * El envío va como texto plano y en modo `no-cors` a propósito: Apps Script no
 * contesta al preflight y un JSON con cabecera propia obligaría a uno, que el
 * navegador bloquearía. Así el cuerpo llega completo y el script responde con su
 * propio JSON, que aquí no se lee.
 */
export async function enviarRegistro(endpoint, columnas, valores) {
  if (!endpointListo(endpoint)) throw new Error("sin-endpoint");
  await fetch(endpoint, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ columnas, valores }),
  });
}
