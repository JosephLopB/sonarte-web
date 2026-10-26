import { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Copy,
  Loader2,
  Mail,
  Send,
} from "lucide-react";
import { gsap, prefiereMenosMovimiento } from "../lib/gsap.js";
import { Reveal } from "../components/Reveal.jsx";
import { Espiral } from "../components/Espirales.jsx";
import { CONTACTO } from "../data/sitio.js";
import { asset } from "../lib/asset.js";

const VACIO = { nombre: "", correo: "", asunto: CONTACTO.asuntos[0].valor, mensaje: "" };
const CORREO_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ETIQUETA = "mb-2 block text-[11px] font-bold uppercase tracking-[0.2em] text-marron/75";
const CAMPO =
  "w-full rounded-2xl border border-terracota/25 bg-crema px-4 py-3 text-[15px] text-marron outline-none transition-all duration-300 placeholder:text-muted-foreground/95 focus:border-terracota/60 focus:ring-4 focus:ring-terracota/15";

/** Copia de respaldo para navegadores que bloquean la Clipboard API. */
function copiarConSeleccion(texto) {
  const area = document.createElement("textarea");
  area.value = texto;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.top = "-9999px";
  document.body.appendChild(area);
  area.select();
  let copiado = false;
  try {
    copiado = document.execCommand("copy");
  } catch {
    copiado = false;
  }
  document.body.removeChild(area);
  return copiado;
}

function CampoError({ id, children }) {
  if (!children) return null;
  return (
    <p id={id} className="mt-1.5 flex items-start gap-1.5 text-xs font-semibold text-terracota">
      <AlertCircle className="mt-px size-3.5 shrink-0" aria-hidden="true" />
      {children}
    </p>
  );
}

export default function Contacto() {
  const [campos, setCampos] = useState(VACIO);
  const [errores, setErrores] = useState({});
  const [estado, setEstado] = useState("listo"); // listo | enviando | enviado | fallo
  const [detalle, setDetalle] = useState("");
  const [confirmado, setConfirmado] = useState(null);
  const [copiado, setCopiado] = useState(false);
  const confirmacion = useRef(null);
  const formRef = useRef(null);
  const copiaTimer = useRef(null);

  const enviando = estado === "enviando";
  const asuntoElegido =
    CONTACTO.asuntos.find((a) => a.valor === campos.asunto)?.etiqueta ?? "Consulta general";

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

  useEffect(() => () => clearTimeout(copiaTimer.current), []);

  function cambiar(evento) {
    const { name, value } = evento.target;
    setCampos((previos) => ({ ...previos, [name]: value }));
    setErrores((previos) => (previos[name] ? { ...previos, [name]: undefined } : previos));
  }

  function validar() {
    const nuevos = {};
    if (campos.nombre.trim().length < 2) {
      nuevos.nombre = "Escribe tu nombre para saber a quién respondemos.";
    }
    if (!CORREO_VALIDO.test(campos.correo.trim())) {
      nuevos.correo = "Revisa el correo: parece incompleto.";
    }
    if (campos.mensaje.trim().length < 10) {
      nuevos.mensaje = "Cuéntanos un poco más: necesitamos al menos 10 caracteres.";
    }
    return nuevos;
  }

  async function onSubmit(evento) {
    evento.preventDefault();
    setDetalle("");

    /* Trampa para robots: si viene rellena, fingimos un envío correcto
       y no gastamos una petición. */
    if (evento.currentTarget.elements._honey?.value) {
      setConfirmado({ nombre: campos.nombre.trim(), correo: campos.correo.trim() });
      setEstado("enviado");
      return;
    }

    const nuevos = validar();
    setErrores(nuevos);
    if (Object.keys(nuevos).length) {
      const primero = ["nombre", "correo", "mensaje"].find((clave) => nuevos[clave]);
      formRef.current?.elements[primero]?.focus();
      return;
    }

    setEstado("enviando");
    const control = new AbortController();
    const tiempo = setTimeout(() => control.abort(), 25000);
    try {
      const respuesta = await fetch(CONTACTO.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: campos.nombre.trim(),
          email: campos.correo.trim(),
          asunto: asuntoElegido,
          message: campos.mensaje.trim(),
          _subject: `SonArte · ${asuntoElegido}`,
          _template: "table",
          _captcha: "false",
          /* Algunos navegadores recortan el Referer a solo el origen;
             con _url el servicio sabe de qué página llega el mensaje. */
          _url: window.location.href,
        }),
        signal: control.signal,
      });
      const datos = await respuesta.json().catch(() => ({}));
      const exito = datos.success === true || datos.success === "true";
      if (!respuesta.ok || !exito) {
        /* FormSubmit responde 200 con success:"false" mientras el buzón no
           haya confirmado el formulario; el envío queda retenido. */
        if (/activat/i.test(String(datos.message || ""))) {
          throw new Error("activacion");
        }
        throw new Error(datos.message || `El servicio respondió ${respuesta.status}.`);
      }
      setConfirmado({ nombre: campos.nombre.trim(), correo: campos.correo.trim() });
      setEstado("enviado");
    } catch (fallo) {
      setEstado("fallo");
      if (fallo?.message === "activacion") {
        setDetalle(
          "El buzón de SonArte todavía no confirmó el formulario; tu mensaje quedó guardado y se entregará al activarlo.",
        );
      } else {
        setDetalle(
          fallo?.name === "AbortError"
            ? "La conexión tardó demasiado."
            : "El servicio de mensajes no respondió.",
        );
      }
    } finally {
      clearTimeout(tiempo);
    }
  }

  function otroMensaje() {
    setCampos(VACIO);
    setErrores({});
    setEstado("listo");
    setDetalle("");
    setConfirmado(null);
    window.setTimeout(() => formRef.current?.elements.nombre?.focus(), 0);
  }

  async function copiarCorreo() {
    /* Si la Clipboard API tarda o falla (permisos, contexto no seguro),
       se intenta la copia por selección antes de darse por vencida. */
    const conApi = await Promise.race([
      navigator.clipboard
        ? navigator.clipboard.writeText(CONTACTO.correo).then(() => true).catch(() => false)
        : Promise.resolve(false),
      new Promise((resolver) => setTimeout(() => resolver(false), 900)),
    ]);
    if (!conApi && !copiarConSeleccion(CONTACTO.correo)) return;
    setCopiado(true);
    clearTimeout(copiaTimer.current);
    copiaTimer.current = setTimeout(() => setCopiado(false), 2200);
  }

  const correoParaEnviar = `mailto:${CONTACTO.correo}?subject=${encodeURIComponent(
    `SonArte · ${asuntoElegido}`,
  )}&body=${encodeURIComponent(
    `Nombre: ${campos.nombre}\nCorreo: ${campos.correo}\n\n${campos.mensaje}`,
  )}`;

  return (
    <section className="relative isolate min-h-screen overflow-hidden bg-crema pt-36 pb-24 sm:pt-40 sm:pb-28">
      {/* Fondo: portada de marca, velada en crema para que el texto respire */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <img
          src={asset("/marca/portada.png")}
          alt=""
          className="h-full w-full object-cover object-center"
          decoding="async"
        />
        <div className="absolute inset-0 bg-crema/85" />
        <div className="absolute inset-0 bg-gradient-to-b from-crema/70 via-transparent to-crema" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_18%_28%,var(--color-crema)_0%,transparent_62%)]" />
      </div>

      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-24 top-28 size-72 rounded-full bg-turquesa/20 blur-3xl anim-lava" />
        <div
          className="absolute -right-20 bottom-10 size-80 rounded-full bg-salmon/20 blur-3xl anim-lava"
          style={{ animationDelay: "6s" }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-5">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-16">
          {/* Columna editorial */}
          <div>
            <Reveal>
              <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.3em] text-terracota">
                <span className="h-px w-10 rounded-full bg-terracota/50" aria-hidden="true" />
                Contacto
              </p>
              <h1 className="mt-6 font-serif text-5xl leading-[1.02] text-marron sm:text-6xl">
                Hablemos de <span className="texto-espiral">son</span>
              </h1>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
                ¿Una idea, una colaboración, una pregunta sobre el cómic? Escríbenos: leemos cada
                mensaje y respondemos al correo que nos dejes.
              </p>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="mt-9 max-w-lg rounded-[1.75rem] border border-marron/15 bg-crema/85 p-6 backdrop-blur-sm sombra-suave">
                <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-terracota">
                  <Mail className="size-4" aria-hidden="true" />
                  Correo directo
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
                  <a
                    href={`mailto:${CONTACTO.correo}`}
                    className="group inline-flex max-w-full items-center gap-1.5 break-all font-serif text-xl text-marron underline decoration-terracota/30 decoration-2 underline-offset-4 transition-colors hover:text-terracota sm:text-2xl"
                  >
                    {CONTACTO.correo}
                    <ArrowUpRight
                      className="size-5 shrink-0 text-terracota transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </a>
                  <button
                    type="button"
                    onClick={copiarCorreo}
                    className="inline-flex items-center gap-1.5 rounded-full border border-terracota/30 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-terracota transition-colors duration-300 hover:bg-terracota hover:text-crema"
                  >
                    {copiado ? <Check className="size-3.5" aria-hidden="true" /> : <Copy className="size-3.5" aria-hidden="true" />}
                    {copiado ? "Copiado" : "Copiar"}
                  </button>
                  <span className="sr-only" role="status">
                    {copiado ? "Correo copiado al portapapeles" : ""}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Cada mensaje que sale del formulario llega a esta misma bandeja.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="mt-10 flex items-center gap-4 text-sm leading-relaxed text-marron/70">
                <Espiral className="size-9 shrink-0 text-terracota/60 anim-girar-lento" aria-hidden="true" />
                <p>
                  SonArte es un proyecto independiente: detrás de cada respuesta estamos Joseph y
                  Yurany.
                </p>
              </div>
            </Reveal>
          </div>

          {/* Formulario */}
          <Reveal delay={0.1} className="w-full">
            <div className="relative overflow-hidden rounded-[2rem] border border-terracota/20 bg-crema/95 p-6 shadow-[0_32px_70px_-38px_oklch(0.3324_0.0747_42.13/0.55)] backdrop-blur-md sm:p-8">
              <span
                className="pointer-events-none absolute -right-16 -top-20 size-52 rounded-full bg-turquesa/15 blur-2xl"
                aria-hidden="true"
              />

              {estado === "enviado" ? (
                <div
                  ref={confirmacion}
                  tabIndex={-1}
                  aria-live="polite"
                  className="relative flex min-h-[27rem] flex-col items-center justify-center text-center outline-none"
                >
                  <span className="grid size-16 place-items-center rounded-full bg-verde-oscuro text-crema sombra-suave">
                    <CheckCircle2 className="size-8" aria-hidden="true" />
                  </span>
                  <h2 className="mt-6 font-serif text-3xl text-marron">Mensaje enviado</h2>
                  <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-muted-foreground">
                    {confirmado?.nombre ? `Gracias, ${confirmado.nombre}.` : "Gracias por escribirnos."}{" "}
                    Tu mensaje va hacia{" "}
                    <span className="font-semibold text-marron">{CONTACTO.correo}</span> y te
                    respondemos a {confirmado?.correo || "tu correo"}.
                  </p>
                  <button
                    type="button"
                    onClick={otroMensaje}
                    className="mt-7 inline-flex items-center gap-2 rounded-full border-2 border-terracota px-7 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-terracota transition-all duration-500 hover:-translate-y-0.5 hover:bg-terracota hover:text-crema"
                  >
                    Escribir otro mensaje
                    <Send className="size-4" aria-hidden="true" />
                  </button>
                </div>
              ) : (
                <form ref={formRef} onSubmit={onSubmit} noValidate className="relative">
                  <h2 className="text-balance font-serif text-2xl text-marron sm:text-3xl">
                    Cuéntanos qué tienes en mente
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Los campos con <span className="font-semibold text-terracota">*</span> son
                    obligatorios.
                  </p>

                  <div className="mt-6 grid gap-5">
                    <div>
                      <label htmlFor="nombre" className={ETIQUETA}>
                        Nombre <span className="text-terracota">*</span>
                      </label>
                      <input
                        id="nombre"
                        name="nombre"
                        type="text"
                        autoComplete="name"
                        value={campos.nombre}
                        onChange={cambiar}
                        placeholder="¿Cómo te llamas?"
                        className={CAMPO}
                        aria-invalid={Boolean(errores.nombre)}
                        aria-describedby={errores.nombre ? "error-nombre" : undefined}
                      />
                      <CampoError id="error-nombre">{errores.nombre}</CampoError>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label htmlFor="correo" className={ETIQUETA}>
                          Correo <span className="text-terracota">*</span>
                        </label>
                        <input
                          id="correo"
                          name="correo"
                          type="email"
                          autoComplete="email"
                          value={campos.correo}
                          onChange={cambiar}
                          placeholder="tucorreo@ejemplo.com"
                          className={CAMPO}
                          aria-invalid={Boolean(errores.correo)}
                          aria-describedby={errores.correo ? "error-correo" : undefined}
                        />
                        <CampoError id="error-correo">{errores.correo}</CampoError>
                      </div>

                      <div>
                        <label htmlFor="asunto" className={ETIQUETA}>
                          Motivo
                        </label>
                        <select
                          id="asunto"
                          name="asunto"
                          value={campos.asunto}
                          onChange={cambiar}
                          className={`${CAMPO} cursor-pointer`}
                        >
                          {CONTACTO.asuntos.map((asunto) => (
                            <option key={asunto.valor} value={asunto.valor}>
                              {asunto.etiqueta}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="mensaje" className={ETIQUETA}>
                        Mensaje <span className="text-terracota">*</span>
                      </label>
                      <textarea
                        id="mensaje"
                        name="mensaje"
                        rows={5}
                        value={campos.mensaje}
                        onChange={cambiar}
                        placeholder="Cuéntanos la idea, la duda o la fecha que tienes en mente…"
                        className={`${CAMPO} min-h-36 resize-y`}
                        aria-invalid={Boolean(errores.mensaje)}
                        aria-describedby={errores.mensaje ? "error-mensaje" : undefined}
                      />
                      <CampoError id="error-mensaje">{errores.mensaje}</CampoError>
                    </div>
                  </div>

                  <input
                    type="text"
                    name="_honey"
                    tabIndex={-1}
                    autoComplete="off"
                    className="hidden"
                    aria-hidden="true"
                  />

                  {estado === "fallo" ? (
                    <div
                      role="alert"
                      className="mt-5 rounded-2xl border border-terracota/30 bg-terracota/10 p-4 text-sm text-marron"
                    >
                      <p className="flex items-center gap-2 font-semibold">
                        <AlertCircle className="size-4 shrink-0 text-terracota" aria-hidden="true" />
                        No pudimos enviarlo desde aquí
                      </p>
                      <p className="mt-1.5 leading-relaxed text-marron/80">
                        {detalle} Si prefieres, escríbenos directo a{" "}
                        <a
                          href={`mailto:${CONTACTO.correo}`}
                          className="font-semibold underline decoration-terracota/50 underline-offset-2"
                        >
                          {CONTACTO.correo}
                        </a>{" "}
                        o abre el mensaje ya escrito en tu correo.
                      </p>
                      <a
                        href={correoParaEnviar}
                        className="mt-3 inline-flex items-center gap-2 rounded-full bg-marron px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-crema transition-colors duration-300 hover:bg-terracota"
                      >
                        <Mail className="size-3.5" aria-hidden="true" />
                        Abrir en mi correo
                      </a>
                    </div>
                  ) : null}

                  <button
                    type="submit"
                    disabled={enviando}
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.16em] text-crema sombra-suave transition-all duration-500 hover:-translate-y-0.5 hover:sombra-flotante disabled:cursor-wait disabled:opacity-70 disabled:hover:translate-y-0"
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
                        Enviar mensaje
                        <Send className="size-4" aria-hidden="true" />
                      </>
                    )}
                  </button>

                  <p className="mt-3 text-center text-[11px] leading-relaxed text-muted-foreground">
                    Te respondemos a este mismo correo. Nada de listas ni envíos automáticos.
                  </p>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
