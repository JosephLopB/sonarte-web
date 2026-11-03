import { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Download,
  Loader2,
  Mail,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { ENVIO, ABIERTAS, idsSegmentoObligatorios, ITEMS_CIERRE, PERFIL, PREGUNTAS_SEGMENTO, SUS } from "../../data/evaluacion.js";
import { GRUPOS, grupoPorId } from "../../data/comicExperiencia.js";
import { BarraAvance, Chip, Escala, PistaEscala } from "../evaluacion/Campos.jsx";
import { PreguntasSegmento } from "../evaluacion/PreguntasSegmento.jsx";
import { aCsv, construirRegistro, descargarCsv, enviarRegistro, fechaLegible, endpointListo } from "../../lib/encuesta.js";
import { leerProgreso } from "../../hooks/useProgresoComic.js";

const CORREO_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const REQUERIDAS_BASE = [...PERFIL.map((campo) => campo.id), ...ITEMS_CIERRE.map((item) => item.id)];

const CAMPO =
  "w-full rounded-xl border border-crema/15 bg-crema/[0.04] px-3.5 py-2.5 text-[15px] text-crema outline-none transition placeholder:text-crema/30 focus:border-turquesa/60 focus:ring-4 focus:ring-turquesa/15";

function Bloque({ rotulo, titulo, children }) {
  return (
    <section className="mt-7 border-t border-crema/10 pt-6">
      <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-turquesa/80">{rotulo}</p>
      <h3 className="mt-1.5 font-serif text-2xl leading-tight text-crema">{titulo}</h3>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Fila({ item, valor, onElegir, compacta = false }) {
  return (
    <div className="flex flex-col gap-2.5 border-t border-crema/10 py-3.5 first:border-t-0 first:pt-0 sm:flex-row sm:items-center sm:justify-between sm:gap-5">
      <p className={`min-w-0 leading-relaxed text-crema/85 ${compacta ? "text-[13px]" : "text-[14.5px]"}`}>
        {item.texto}
      </p>
      <Escala
        id={item.id}
        etiqueta={item.texto}
        valor={valor}
        onElegir={onElegir}
        tono="oscuro"
        compacta={compacta}
      />
    </div>
  );
}

/**
 * Cierre de la evaluación dentro del cómic.
 *
 * Es la última página: recoge lo que las pausas no preguntaron más la prueba
 * SUS, y manda todo junto al mismo destino de Excel.
 */
export function CierreEvaluacion({
  respuestas,
  onResponder,
  pausasSaltadas = [],
  onCerrar,
  onVerFormulario,
}) {
  const [faltantes, setFaltantes] = useState([]);
  const [errores, setErrores] = useState({});
  const [estado, setEstado] = useState("listo"); // listo | enviando | enviado | fallo
  const [detalle, setDetalle] = useState("");
  const [registro, setRegistro] = useState(null);
  const [enviado, setEnviado] = useState(null);
  const inicio = useRef(Date.now());
  const marco = useRef(null);
  const confirmacion = useRef(null);

  const enviando = estado === "enviando";
  const requeridas = [...REQUERIDAS_BASE, ...idsSegmentoObligatorios(respuestas.segmento)];
  const respondidas = requeridas.filter((id) => respuestas[id]).length;
  const totalRequeridas = requeridas.length;

  useEffect(() => {
    marco.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    if (estado !== "enviado") return;
    confirmacion.current?.focus();
  }, [estado]);

  useEffect(() => {
    const onKey = (evento) => {
      if (evento.key !== "Escape" || estado === "enviando") return;
      evento.preventDefault();
      onCerrar();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCerrar, estado]);

  function elegir(id, valor) {
    onResponder(id, valor);
    if (id === "segmento") {
      const preguntasSegmento = Object.values(PREGUNTAS_SEGMENTO).flatMap((grupo) => grupo.preguntas);
      preguntasSegmento.forEach((pregunta) => {
        onResponder(pregunta.id, "");
      });
      const idsSegmento = preguntasSegmento.map((pregunta) => pregunta.id);
      setFaltantes((previas) => previas.filter((clave) => !idsSegmento.includes(clave)));
    }
    setFaltantes((previos) => previos.filter((clave) => clave !== id));
    setErrores((previos) => (previos[id] ? { ...previos, [id]: undefined } : previos));
  }

  function progresoTexto() {
    const guardado = leerProgreso();
    const nombres = guardado.completadas.map((id) => grupoPorId(id)?.titulo ?? id);
    return nombres.length
      ? `${nombres.join(" · ")} (${nombres.length} de ${GRUPOS.length})`
      : `Ninguna pieza completada (0 de ${GRUPOS.length})`;
  }

  async function enviar() {
    const fila = construirRegistro(respuestas, {
      fecha: fechaLegible(),
      progreso: progresoTexto(),
      segundos: Math.round((Date.now() - inicio.current) / 1000),
      pagina: window.location.href,
      pausasSaltadas,
    });
    setRegistro(fila);
    setEstado("enviando");
    try {
      await enviarRegistro(ENVIO.endpoint, fila.columnas, fila.valores);
      setEnviado({ nombre: (respuestas.nombre ?? "").trim() });
      setEstado("enviado");
    } catch (fallo) {
      setEstado("fallo");
      setDetalle(
        fallo?.message === "sin-endpoint"
          ? "La evaluación todavía no tiene conectado su destino."
          : "La conexión no llegó al destino.",
      );
    }
  }

  function onSubmit(evento) {
    evento.preventDefault();
    setDetalle("");
    const sinResponder = requeridas.filter((id) => !respuestas[id]);
    const nuevos = {};
    if (respuestas.correo?.trim() && !CORREO_VALIDO.test(respuestas.correo.trim())) {
      nuevos.correo = "Revisa el correo: parece incompleto.";
    }
    setErrores(nuevos);
    setFaltantes(sinResponder);
    if (!sinResponder.length && !Object.keys(nuevos).length) enviar();
  }

  const correoRespaldo = registro
    ? `mailto:sonarte840@gmail.com?subject=${encodeURIComponent(
        "SonArte · Evaluación del cómic",
      )}&body=${encodeURIComponent(aCsv(registro.columnas, registro.valores))}`
    : "mailto:sonarte840@gmail.com";

  const envoltura =
    "absolute inset-0 z-[80] overflow-y-auto bg-[#080706]/96 text-crema backdrop-blur-md";

  if (estado === "enviado") {
    return (
      <div className={envoltura}>
        <div className="mx-auto flex min-h-full w-full max-w-xl items-center px-5 py-10">
          <div
            ref={confirmacion}
            tabIndex={-1}
            aria-live="polite"
            className="w-full rounded-[1.75rem] border border-turquesa/25 bg-[#14110f]/90 px-6 py-12 text-center outline-none shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)] sm:px-9"
          >
            <span className="mx-auto grid size-16 place-items-center rounded-full bg-turquesa text-marron">
              <CheckCircle2 className="size-8" aria-hidden="true" />
            </span>
            <h2 className="mt-6 font-serif text-4xl leading-tight text-crema">
              {enviado?.nombre ? `Gracias, ${enviado.nombre}` : "Gracias por llegar hasta aquí"}
            </h2>
            <p className="mx-auto mt-4 max-w-sm text-[15px] leading-relaxed text-crema/65">
              Tu recorrido —las pausas, la prueba y tus palabras— va camino a SonArte como una
              fila de Excel. Se lee mañana mismo.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={onCerrar}
                className="inline-flex items-center gap-2 rounded-full bg-turquesa px-6 py-3 text-xs font-bold uppercase tracking-[0.16em] text-marron transition hover:-translate-y-0.5 hover:brightness-105"
              >
                <ArrowLeft className="size-4" aria-hidden="true" />
                Volver al cierre
              </button>
              {onVerFormulario ? (
                <button
                  type="button"
                  onClick={onVerFormulario}
                  className="inline-flex items-center gap-2 rounded-full border border-crema/20 px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-crema/70 transition hover:border-crema/40 hover:text-crema"
                >
                  Ver la encuesta completa
                  <ArrowRight className="size-4" aria-hidden="true" />
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={envoltura}>
      <div
        ref={marco}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cierre-titulo"
        tabIndex={-1}
        className="mx-auto w-full max-w-2xl px-4 pb-2 pt-6 outline-none sm:px-6 sm:pt-10"
      >
        <div className="flex items-start justify-between gap-4">
          <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.26em] text-turquesa">
            <Sparkles className="size-3" aria-hidden="true" />
            Última página
          </p>
          <button
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar la evaluación y volver al cómic"
            className="grid size-9 shrink-0 place-items-center rounded-full border border-crema/15 text-crema/55 transition hover:border-crema/35 hover:text-crema"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>

        <h2 id="cierre-titulo" className="mt-4 font-serif text-4xl leading-[1.05] sm:text-5xl">
          ¿Cómo te fue en <span className="text-turquesa">todo el viaje</span>?
        </h2>
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-crema/65">
          Ya viste de dónde salió la voz. Aquí puedes completar la valoración de la historia, el
          proyecto, la experiencia y la usabilidad, además de las preguntas para tu sector.
        </p>

        <div className="mt-6 rounded-2xl border border-crema/12 bg-crema/[0.03] p-4">
          <div className="flex items-center justify-between gap-3 text-[10px] font-bold uppercase tracking-[0.18em] text-crema/50">
            <span>Tu avance</span>
            <span className="text-turquesa">
              {respondidas} de {totalRequeridas}
            </span>
          </div>
          <div className="mt-2">
            <BarraAvance hechas={respondidas} total={totalRequeridas} tono="oscuro" />
          </div>
          {pausasSaltadas.length ? (
            <p className="mt-2.5 text-[11px] leading-relaxed text-crema/40">
              Te saltaste {pausasSaltadas.length === 1 ? "una pausa" : `${pausasSaltadas.length} pausas`} en
              el camino; queda anotado, y puedes contestarlas en la encuesta completa.
            </p>
          ) : null}
        </div>

        <form onSubmit={onSubmit} noValidate>
          {ITEMS_CIERRE.some((item) => !respuestas[item.id]) ? (
            <Bloque rotulo="El proyecto y la experiencia" titulo="Lo que te dejó el recorrido">
              {ITEMS_CIERRE.filter((item) => !respuestas[item.id]).map((item) => (
              <Fila
                key={item.id}
                item={item}
                valor={respuestas[item.id]}
                onElegir={elegir}
                compacta
              />
              ))}
              <PistaEscala tono="oscuro" className="pt-1" />
            </Bloque>
          ) : null}

          <details className="mt-7 rounded-2xl border border-crema/10 bg-crema/[0.025] px-4 py-4">
            <summary className="cursor-pointer font-serif text-xl text-crema focus-visible:outline focus-visible:outline-2 focus-visible:outline-turquesa">
              Medición de usabilidad <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-turquesa/70">(opcional)</span>
              <span className="mt-1 block font-sans text-[12px] text-crema/45">Diez frases para comparar facilidad de uso; la puntuación se calcula si respondes todas.</span>
            </summary>
            <div className="mt-4 border-t border-crema/10 pt-3">
            {SUS.map((item, i) => (
              <div
                key={item.id}
                className="flex flex-col gap-2.5 border-t border-crema/10 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-5"
              >
                <p className="flex min-w-0 items-start gap-2.5 text-[13px] leading-relaxed text-crema/80">
                  <span className="mt-0.5 font-impacto text-[10px] text-terracota/60">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {item.texto}
                </p>
                <Escala
                  id={item.id}
                  etiqueta={item.texto}
                  valor={respuestas[item.id]}
                  onElegir={elegir}
                  tono="oscuro"
                  compacta
                />
              </div>
            ))}
            </div>
          </details>

          <Bloque rotulo="Para leerte mejor" titulo="Tu perfil y tus palabras">
            <div className="grid gap-5 sm:grid-cols-2">
              {PERFIL.map((campo) => (
                <div key={campo.id}>
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-crema/50">
                    {campo.pregunta}
                  </p>
                  <fieldset className="m-0 min-w-0 border-0 p-0">
                    <legend className="sr-only">{campo.pregunta}</legend>
                    <div className="flex flex-wrap gap-2">
                      {campo.opciones.map((opcion) => (
                        <Chip
                          key={opcion}
                          id={campo.id}
                          opcion={opcion}
                          valor={respuestas[campo.id]}
                          onElegir={elegir}
                          tono="oscuro"
                        />
                      ))}
                    </div>
                  </fieldset>
                </div>
              ))}
            </div>

            <PreguntasSegmento
              segmento={respuestas.segmento}
              respuestas={respuestas}
              onResponder={elegir}
              tono="oscuro"
              faltantes={faltantes}
            />

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="cierre-nombre"
                  className="mb-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-crema/50"
                >
                  Nombre <span className="font-normal normal-case tracking-normal text-crema/30">(opcional)</span>
                </label>
                <input
                  id="cierre-nombre"
                  name="nombre"
                  type="text"
                  autoComplete="name"
                  value={respuestas.nombre ?? ""}
                  onChange={(e) => onResponder("nombre", e.target.value)}
                  placeholder="¿Cómo te llamas?"
                  className={CAMPO}
                />
              </div>
              <div>
                <label
                  htmlFor="cierre-correo"
                  className="mb-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-crema/50"
                >
                  Correo <span className="font-normal normal-case tracking-normal text-crema/30">(opcional)</span>
                </label>
                <input
                  id="cierre-correo"
                  name="correo"
                  type="email"
                  autoComplete="email"
                  value={respuestas.correo ?? ""}
                  onChange={(e) => onResponder("correo", e.target.value)}
                  placeholder="Para contarte del siguiente capítulo"
                  className={CAMPO}
                  aria-invalid={Boolean(errores.correo)}
                  aria-describedby={errores.correo ? "cierre-error-correo" : undefined}
                />
                {errores.correo ? (
                  <p
                    id="cierre-error-correo"
                    className="mt-1.5 flex items-start gap-1.5 text-[11px] font-semibold text-salmon"
                  >
                    <AlertCircle className="mt-px size-3.5 shrink-0" aria-hidden="true" />
                    {errores.correo}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="mt-5 grid gap-4">
              {ABIERTAS.map((campo) => (
                <div key={campo.id}>
                  <label
                    htmlFor={`cierre-${campo.id}`}
                    className="mb-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-crema/50"
                  >
                    {campo.pregunta}
                  </label>
                  <textarea
                    id={`cierre-${campo.id}`}
                    name={campo.id}
                    rows={2}
                    maxLength={600}
                    value={respuestas[campo.id] ?? ""}
                    onChange={(e) => onResponder(campo.id, e.target.value)}
                    placeholder={campo.pista}
                    className={`${CAMPO} min-h-16 resize-y`}
                  />
                </div>
              ))}
            </div>
          </Bloque>

          {estado === "fallo" ? (
            <div
              role="alert"
              className="mt-6 rounded-2xl border border-salmon/40 bg-salmon/10 p-4 text-sm text-crema/85"
            >
              <p className="flex items-center gap-2 font-semibold text-crema">
                <AlertCircle className="size-4 shrink-0 text-salmon" aria-hidden="true" />
                No pudimos enviarlo desde aquí
              </p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-crema/65">
                {detalle} Descarga tu respuesta o ábrela en tu correo: llega igual.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => registro && descargarCsv("sonarte-evaluacion.csv", aCsv(registro.columnas, registro.valores))}
                  className="inline-flex items-center gap-2 rounded-full bg-crema px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-marron transition hover:brightness-105"
                >
                  <Download className="size-3.5" aria-hidden="true" />
                  Descargar CSV
                </button>
                <a
                  href={correoRespaldo}
                  className="inline-flex items-center gap-2 rounded-full border border-crema/25 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-crema/75 transition hover:border-crema/50 hover:text-crema"
                >
                  <Mail className="size-3.5" aria-hidden="true" />
                  Abrir en mi correo
                </a>
              </div>
            </div>
          ) : null}

          <div className="sticky bottom-0 mt-7 border-t border-crema/10 bg-gradient-to-t from-[#080706] via-[#080706] to-[#080706]/80 pb-5 pt-4">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
              <button
                type="submit"
                disabled={enviando}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-turquesa px-7 py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-marron transition hover:-translate-y-0.5 hover:brightness-105 disabled:cursor-wait disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {enviando ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                    Enviando…
                  </>
                ) : (
                  <>
                    Enviar mis respuestas
                    <Send className="size-4" aria-hidden="true" />
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={onCerrar}
                className="text-[11px] font-semibold uppercase tracking-[0.14em] text-crema/45 transition hover:text-crema/80"
              >
                Seguir en el cómic
              </button>
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-crema/40">
              {faltantes.length
                ? `Te faltan ${faltantes.length} ${faltantes.length === 1 ? "respuesta" : "respuestas"} para enviar.`
                : "Llega a sonarte840@gmail.com como una fila de Excel. La puntuación de usabilidad solo se calcula si respondes sus diez frases."}
            </p>
            {import.meta.env.DEV && !endpointListo(ENVIO.endpoint) ? (
              <p className="mt-1 text-[11px] leading-relaxed text-salmon/80">
                Modo de prueba: falta pegar la URL de Apps Script en src/data/evaluacion.js.
              </p>
            ) : null}
          </div>
        </form>
      </div>
    </div>
  );
}
