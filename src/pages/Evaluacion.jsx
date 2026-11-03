import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Download,
  Loader2,
  Mail,
  Send,
  Sparkles,
} from "lucide-react";
import { gsap, prefiereMenosMovimiento } from "../lib/gsap.js";
import { Reveal } from "../components/Reveal.jsx";
import { Espiral } from "../components/Espirales.jsx";
import { asset } from "../lib/asset.js";
import { ABIERTAS, EJES, ENVIO, idsSegmentoObligatorios, PERFIL, PREGUNTAS_SEGMENTO, SUS, TOTAL_OBLIGATORIAS } from "../data/evaluacion.js";
import { Chip, Escala } from "../components/evaluacion/Campos.jsx";
import { PreguntasSegmento } from "../components/evaluacion/PreguntasSegmento.jsx";
import { GRUPOS, grupoPorId } from "../data/comicExperiencia.js";
import {
  aCsv,
  construirRegistro,
  descargarCsv,
  enviarRegistro,
  fechaLegible,
  endpointListo,
} from "../lib/encuesta.js";
import { leerProgreso } from "../hooks/useProgresoComic.js";
import { leerEvaluacion } from "../hooks/useEvaluacionComic.js";

const CORREO_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ETIQUETA = "mb-2 block text-[11px] font-bold uppercase tracking-[0.2em] text-marron/75";
const CAMPO =
  "w-full rounded-2xl border border-terracota/25 bg-crema px-4 py-3 text-[15px] text-marron outline-none transition-all duration-300 placeholder:text-muted-foreground/95 focus:border-terracota/60 focus:ring-4 focus:ring-terracota/15";

const ITEMS_EJES = EJES.flatMap((eje) => eje.items);
const idsBaseObligatorios = [...PERFIL.map((campo) => campo.id), ...ITEMS_EJES.map((item) => item.id)];

function respuestasIniciales() {
  const vacio = {};
  [...PERFIL, ...ITEMS_EJES, ...SUS, ...ABIERTAS, ...Object.values(PREGUNTAS_SEGMENTO).flatMap((grupo) => grupo.preguntas)].forEach((campo) => {
    vacio[campo.id] = "";
  });
  return { nombre: "", correo: "", ...vacio };
}

function Tarjeta({ numero, titulo, resumen, children, tono = "crema" }) {
  return (
    <section
      className={`relative overflow-hidden rounded-[1.75rem] border border-terracota/20 p-6 backdrop-blur-sm sombra-suave sm:p-8 ${
        tono === "turquesa" ? "bg-card" : "bg-crema/95"
      }`}
    >
      <span
        className="pointer-events-none absolute -right-16 -top-20 size-52 rounded-full bg-turquesa/15 blur-2xl"
        aria-hidden="true"
      />
      <header className="relative flex items-start gap-4">
        <span className="font-impacto text-2xl leading-none text-terracota/30 sm:text-3xl">{numero}</span>
        <div className="min-w-0">
          <h2 className="font-serif text-2xl leading-tight text-marron sm:text-3xl">{titulo}</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{resumen}</p>
        </div>
      </header>
      <div className="relative">{children}</div>
    </section>
  );
}

export default function Evaluacion() {
  /* Arranca con lo que el lector ya respondió en las pausas del cómic. */
  const [previas] = useState(leerEvaluacion);
  const [respuestas, setRespuestas] = useState(() => ({
    ...respuestasIniciales(),
    ...previas.respuestas,
  }));
  const [faltantes, setFaltantes] = useState([]);
  const [errores, setErrores] = useState({});
  const [estado, setEstado] = useState("listo"); // listo | enviando | enviado | fallo
  const [detalle, setDetalle] = useState("");
  const [registro, setRegistro] = useState(null);
  const [enviado, setEnviado] = useState(null);
  const formRef = useRef(null);
  const confirmacion = useRef(null);
  const inicio = useRef(Date.now());

  const enviando = estado === "enviando";
  const requeridas = [...idsBaseObligatorios, ...idsSegmentoObligatorios(respuestas.segmento)];
  const totalRequeridas = requeridas.length;
  const respondidas = requeridas.filter((id) => respuestas[id]).length;
  const porcentaje = Math.round((respondidas / totalRequeridas) * 100);

  useEffect(() => {
    document.title = "Evaluación del cómic · SonArte";
  }, []);

  useEffect(() => {
    if (estado !== "enviado") return;
    confirmacion.current?.focus();
    if (!prefiereMenosMovimiento() && confirmacion.current) {
      gsap.fromTo(
        confirmacion.current,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" },
      );
    }
  }, [estado]);

  function elegir(id, valor) {
    setRespuestas((previas) => {
      const siguientes = { ...previas, [id]: valor };
      if (id === "segmento") {
        Object.values(PREGUNTAS_SEGMENTO).flatMap((grupo) => grupo.preguntas).forEach((pregunta) => {
          siguientes[pregunta.id] = "";
        });
      }
      return siguientes;
    });
    setFaltantes((previas) => previas.filter((clave) => clave !== id));
    if (id === "segmento") {
      const idsSegmento = Object.values(PREGUNTAS_SEGMENTO).flatMap((grupo) => grupo.preguntas.map((pregunta) => pregunta.id));
      setFaltantes((previas) => previas.filter((clave) => !idsSegmento.includes(clave)));
    }
    setErrores((previos) => (previos[id] ? { ...previos, [id]: undefined } : previos));
  }

  function cambiar(evento) {
    const { name, value } = evento.target;
    setRespuestas((previas) => ({ ...previas, [name]: value }));
    setErrores((previos) => (previos[name] ? { ...previos, [name]: undefined } : previos));
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
      pausasSaltadas: Object.entries(previas.pausas)
        .filter(([, estado]) => estado === "saltada")
        .map(([capitulo]) => Number(capitulo)),
    });
    setRegistro(fila);
    setEstado("enviando");
    try {
      await enviarRegistro(ENVIO.endpoint, fila.columnas, fila.valores);
      setEnviado({ nombre: respuestas.nombre.trim(), correo: respuestas.correo.trim() });
      setEstado("enviado");
    } catch (fallo) {
      setEstado("fallo");
      setDetalle(
        fallo?.message === "sin-endpoint"
          ? "La encuesta todavía no tiene conectado su destino de envío."
          : "La conexión no llegó al destino. Tu respuesta está guardada aquí abajo.",
      );
    }
  }

  function onSubmit(evento) {
    evento.preventDefault();
    setDetalle("");

    const sinResponder = [...idsBaseObligatorios, ...idsSegmentoObligatorios(respuestas.segmento)].filter((id) => !respuestas[id]);
    const nuevos = {};
    if (respuestas.correo.trim() && !CORREO_VALIDO.test(respuestas.correo.trim())) {
      nuevos.correo = "Revisa el correo: parece incompleto.";
    }
    setErrores(nuevos);
    setFaltantes(sinResponder);

    if (sinResponder.length || Object.keys(nuevos).length) {
      const primero = sinResponder[0] ?? "correo";
      const bloque = formRef.current?.querySelector(`[data-campo="${primero}"]`);
      bloque?.scrollIntoView({ behavior: "smooth", block: "center" });
      bloque?.querySelector("input, textarea")?.focus({ preventScroll: true });
      return;
    }

    enviar();
  }

  function descargar() {
    if (!registro) return;
    descargarCsv("sonarte-evaluacion.csv", aCsv(registro.columnas, registro.valores));
  }

  const correoRespaldo = registro
    ? `mailto:sonarte840@gmail.com?subject=${encodeURIComponent(
        "SonArte · Evaluación del cómic",
      )}&body=${encodeURIComponent(aCsv(registro.columnas, registro.valores))}`
    : "mailto:sonarte840@gmail.com";

  if (estado === "enviado") {
    return (
      <section className="relative isolate min-h-screen overflow-hidden bg-crema pt-36 pb-24 sm:pt-40">
        <div className="absolute inset-0 -z-10" aria-hidden="true">
          <img src={asset("/marca/portada.png")} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-crema/90" />
        </div>
        <div className="relative mx-auto max-w-2xl px-5">
          <div
            ref={confirmacion}
            tabIndex={-1}
            aria-live="polite"
            className="flex flex-col items-center rounded-[2rem] border border-terracota/20 bg-crema/95 px-6 py-14 text-center outline-none sombra-flotante sm:px-10"
          >
            <span className="grid size-16 place-items-center rounded-full bg-verde-oscuro text-crema sombra-suave">
              <CheckCircle2 className="size-8" aria-hidden="true" />
            </span>
            <h1 className="mt-6 font-serif text-4xl text-marron">
              {enviado?.nombre ? `Gracias, ${enviado.nombre}` : "Gracias por leerlo"}
            </h1>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted-foreground">
              Tu respuesta va camino a la bandeja de SonArte como una fila de Excel, con la
              puntuación SUS incluida. Cada lectura con ojos nuevos cambia la siguiente versión.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                to="/comic"
                className="inline-flex items-center gap-2 rounded-full bg-marron px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-crema transition-all duration-500 hover:-translate-y-0.5 hover:bg-terracota"
              >
                Volver al cómic
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <button
                type="button"
                onClick={() => {
                  setRespuestas(respuestasIniciales());
                  setFaltantes([]);
                  setErrores({});
                  setRegistro(null);
                  setEnviado(null);
                  setEstado("listo");
                  inicio.current = Date.now();
                }}
                className="inline-flex items-center gap-2 rounded-full border-2 border-terracota px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-terracota transition-all duration-500 hover:-translate-y-0.5 hover:bg-terracota hover:text-crema"
              >
                Responder otra vez
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative isolate min-h-screen overflow-hidden bg-crema pt-36 pb-24 sm:pt-40 sm:pb-28">
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <img
          src={asset("/marca/portada.png")}
          alt=""
          className="h-full w-full object-cover object-center"
          decoding="async"
        />
        <div className="absolute inset-0 bg-crema/88" />
        <div className="absolute inset-0 bg-gradient-to-b from-crema/70 via-transparent to-crema" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_18%_28%,var(--color-crema)_0%,transparent_62%)]" />
      </div>

      <div className="relative mx-auto w-full max-w-3xl px-5">
        {/* Cabecera */}
        <Reveal>
          <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.3em] text-terracota">
            <span className="h-px w-10 rounded-full bg-terracota/50" aria-hidden="true" />
            Evaluación · Cómic SonArte
          </p>
          <h1 className="mt-6 font-serif text-5xl leading-[1.02] text-marron sm:text-6xl">
            ¿Qué te pareció <span className="texto-espiral">SonArte</span>?
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Preguntas sobre la historia, el valor cultural y la experiencia de lectura, además de
            preguntas específicas si vienes de una institución educativa o editorial.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-marron/50">
            <span className="inline-flex items-center gap-1.5">
              <Sparkles className="size-3 text-terracota" aria-hidden="true" />
              {TOTAL_OBLIGATORIAS + idsSegmentoObligatorios(respuestas.segmento).length} respuestas rápidas
            </span>
            <span className="size-1 rounded-full bg-marron/25" aria-hidden="true" />
            <span>Sin registro</span>
            <span className="size-1 rounded-full bg-marron/25" aria-hidden="true" />
            <span>Puedes responder en anónimo</span>
          </div>

          <div className="mt-8 rounded-2xl border border-terracota/15 bg-crema/80 p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between gap-3 text-[11px] font-bold uppercase tracking-[0.16em] text-marron/60">
              <span>Tu avance</span>
              <span className="text-terracota">
              {respondidas} de {totalRequeridas}
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-marron/10">
              <span
                className="block h-full rounded-full superficie-caribe transition-all duration-500"
                style={{ width: `${porcentaje}%` }}
              />
            </div>
            <p className="mt-2.5 text-[11px] leading-relaxed text-muted-foreground">
              En cada frase: <strong className="text-marron">1</strong> es «nada de acuerdo» y{" "}
              <strong className="text-marron">5</strong>, «del todo de acuerdo».
            </p>
            {Object.keys(previas.respuestas).length ? (
              <p className="mt-1.5 text-[11px] leading-relaxed text-terracota/80">
                Traemos lo que respondiste en las pausas del cómic; puedes cambiarlo aquí.
              </p>
            ) : null}
          </div>
        </Reveal>

        <form ref={formRef} onSubmit={onSubmit} noValidate className="mt-10 grid gap-7">
          {/* Perfil */}
          <Reveal>
            <Tarjeta numero="00" titulo="Para empezar" resumen="Tu perfil ayuda a entender desde qué lugar se lee SonArte.">
              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                {PERFIL.map((campo) => (
                  <div key={campo.id} data-campo={campo.id}>
                    <p className={ETIQUETA}>{campo.pregunta}</p>
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
                          />
                        ))}
                      </div>
                    </fieldset>
                    {faltantes.includes(campo.id) ? (
                      <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-terracota">
                        <AlertCircle className="size-3.5" aria-hidden="true" />
                        Falta elegir una opción.
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div data-campo="nombre">
                  <label htmlFor="campo-nombre" className={ETIQUETA}>
                    Nombre <span className="font-normal lowercase tracking-normal text-muted-foreground">(opcional)</span>
                  </label>
                  <input
                    id="campo-nombre"
                    name="nombre"
                    type="text"
                    autoComplete="name"
                    value={respuestas.nombre}
                    onChange={cambiar}
                    placeholder="¿Cómo te llamas?"
                    className={CAMPO}
                  />
                </div>
                <div data-campo="correo">
                  <label htmlFor="campo-correo" className={ETIQUETA}>
                    Correo <span className="font-normal lowercase tracking-normal text-muted-foreground">(opcional)</span>
                  </label>
                  <input
                    id="campo-correo"
                    name="correo"
                    type="email"
                    autoComplete="email"
                    value={respuestas.correo}
                    onChange={cambiar}
                    placeholder="Para contarte del próximo capítulo"
                    className={CAMPO}
                    aria-invalid={Boolean(errores.correo)}
                    aria-describedby={errores.correo ? "error-correo" : undefined}
                  />
                  {errores.correo ? (
                    <p id="error-correo" className="mt-1.5 flex items-start gap-1.5 text-xs font-semibold text-terracota">
                      <AlertCircle className="mt-px size-3.5 shrink-0" aria-hidden="true" />
                      {errores.correo}
                    </p>
                  ) : null}
                </div>
              </div>
            </Tarjeta>
            <PreguntasSegmento
              segmento={respuestas.segmento}
              respuestas={respuestas}
              onResponder={elegir}
              faltantes={faltantes}
            />
          </Reveal>

          {/* Ejes */}
          {EJES.map((eje) => (
            <Reveal key={eje.id}>
              <Tarjeta numero={eje.numero} titulo={eje.titulo} resumen={eje.resumen}>
                <div className="mt-4">
                  {eje.items.map((item) => {
                    const falta = faltantes.includes(item.id);
                    return (
                      <div
                        key={item.id}
                        data-campo={item.id}
                        className={`flex flex-col gap-3 border-t border-terracota/10 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6 ${
                          falta ? "rounded-xl bg-terracota/[0.04] px-2" : ""
                        }`}
                      >
                        <div className="min-w-0">
                          <p className="text-[15px] leading-relaxed text-marron">{item.texto}</p>
                          {falta ? (
                            <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-terracota">
                              <AlertCircle className="size-3.5" aria-hidden="true" />
                              Falta responder.
                            </p>
                          ) : null}
                        </div>
                        <Escala
                          id={item.id}
                          etiqueta={item.texto}
                          valor={respuestas[item.id]}
                          onElegir={elegir}
                        />
                      </div>
                    );
                  })}
                </div>
              </Tarjeta>
            </Reveal>
          ))}

          {/* SUS */}
          <Reveal>
            <details className="group rounded-[1.75rem] border border-terracota/20 bg-crema/90 p-6 sombra-suave sm:p-8">
              <summary className="flex cursor-pointer list-none items-start gap-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-terracota">
                <span className="font-impacto text-2xl leading-none text-terracota/30 sm:text-3xl">07</span>
                <span>
                  <span className="block font-serif text-2xl leading-tight text-marron sm:text-3xl">La prueba de usabilidad <span className="font-sans text-xs font-semibold text-terracota">(opcional)</span></span>
                  <span className="mt-1.5 block text-sm leading-relaxed text-muted-foreground">Diez frases del cuestionario SUS para comparar facilidad de uso. Se puntúan si respondes las diez.</span>
                </span>
              </summary>
              <div className="mt-5 border-t border-terracota/10 pt-4">
              <ul className="mt-4">
                {SUS.map((item, i) => {
                  const falta = faltantes.includes(item.id);
                  return (
                    <li
                      key={item.id}
                      data-campo={item.id}
                      className={`flex flex-col gap-3 border-t border-terracota/10 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 ${
                        falta ? "rounded-xl bg-terracota/[0.04] px-2" : ""
                      }`}
                    >
                      <div className="flex min-w-0 items-start gap-3">
                        <span className="mt-0.5 font-impacto text-[11px] text-terracota/40">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <div>
                          <p className="text-[15px] leading-relaxed text-marron">{item.texto}</p>
                          {falta ? (
                            <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-terracota">
                              <AlertCircle className="size-3.5" aria-hidden="true" />
                              Falta responder.
                            </p>
                          ) : null}
                        </div>
                      </div>
                      <Escala
                        id={item.id}
                        etiqueta={item.texto}
                        valor={respuestas[item.id]}
                        onElegir={elegir}
                      />
                    </li>
                  );
                })}
              </ul>
              </div>
            </details>
          </Reveal>

          {/* Abiertas */}
          <Reveal>
            <Tarjeta
              numero="08"
              titulo="Tus palabras"
              resumen="Lo que ninguna escala mide. Bastan dos líneas, y si prefieres no escribir, déjalas en blanco."
            >
              <div className="mt-6 grid gap-5">
                {ABIERTAS.map((campo) => (
                  <div key={campo.id} data-campo={campo.id}>
                    <label htmlFor={`campo-${campo.id}`} className={ETIQUETA}>
                      {campo.pregunta}
                    </label>
                    <textarea
                      id={`campo-${campo.id}`}
                      name={campo.id}
                      rows={3}
                      maxLength={600}
                      value={respuestas[campo.id]}
                      onChange={cambiar}
                      placeholder={campo.pista}
                      className={`${CAMPO} min-h-24 resize-y`}
                    />
                  </div>
                ))}
              </div>
            </Tarjeta>
          </Reveal>

          {estado === "fallo" ? (
            <div role="alert" className="rounded-2xl border border-terracota/30 bg-terracota/10 p-5 text-sm text-marron">
              <p className="flex items-center gap-2 font-semibold">
                <AlertCircle className="size-4 shrink-0 text-terracota" aria-hidden="true" />
                No pudimos enviarlo desde aquí
              </p>
              <p className="mt-1.5 leading-relaxed text-marron/80">
                {detalle} Descarga tu respuesta y envíala por correo: llega igual, con el mismo
                formato de Excel.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={descargar}
                  className="inline-flex items-center gap-2 rounded-full bg-marron px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-crema transition-colors duration-300 hover:bg-terracota"
                >
                  <Download className="size-3.5" aria-hidden="true" />
                  Descargar CSV
                </button>
                <a
                  href={correoRespaldo}
                  className="inline-flex items-center gap-2 rounded-full border border-terracota/40 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-terracota transition-colors duration-300 hover:bg-terracota hover:text-crema"
                >
                  <Mail className="size-3.5" aria-hidden="true" />
                  Abrir en mi correo
                </a>
              </div>
            </div>
          ) : null}

          <div className="rounded-[1.75rem] border border-terracota/20 bg-crema/95 p-6 text-center sombra-suave sm:p-8">
            <button
              type="submit"
              disabled={enviando}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full px-8 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-crema sombra-suave transition-all duration-500 hover:-translate-y-0.5 hover:sombra-flotante disabled:cursor-wait disabled:opacity-70 disabled:hover:translate-y-0"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, var(--color-marron) 0%, var(--color-terracota) 100%)",
              }}
            >
              {enviando ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  Enviando…
                </>
              ) : (
                <>
                  Enviar mi evaluación
                  <Send className="size-4" aria-hidden="true" />
                </>
              )}
            </button>
            <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
              {faltantes.length
                ? `Te faltan ${faltantes.length} ${
                    faltantes.length === 1 ? "respuesta" : "respuestas"
                  } obligatorias para enviar.`
                : "Llega a la bandeja de SonArte como una fila de Excel. Sin listas ni envíos automáticos."}
            </p>
            {import.meta.env.DEV && !endpointListo(ENVIO.endpoint) ? (
              <p className="mx-auto mt-2 max-w-md text-[11px] leading-relaxed text-terracota/80">
                Modo de prueba: falta pegar la URL de Apps Script en{" "}
                <code className="font-semibold">src/data/evaluacion.js</code> para que el envío
                salga del navegador.
              </p>
            ) : null}
          </div>

          <div className="flex items-center justify-center gap-3 pb-4 text-xs leading-relaxed text-marron/55">
            <Espiral className="size-7 shrink-0 text-terracota/50 anim-girar-lento" aria-hidden="true" />
            <p>
              SonArte es un proyecto independiente. Tus respuestas se usan solo para mejorar el
              cómic.
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
