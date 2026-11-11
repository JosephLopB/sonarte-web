import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowDown, ArrowRight, Check, LoaderCircle, Send, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { asset } from "../lib/asset.js";
import { MARCA } from "../data/marca.js";
import { ABIERTAS, EJES, PERFIL, PREGUNTAS_SEGMENTO, ENVIO } from "../data/evaluacion.js";
import { construirRegistro, enviarRegistro, aCsv, descargarCsv, fechaLegible } from "../lib/encuesta.js";
import { Escala, Chip, PistaEscala } from "../components/evaluacion/Campos.jsx";
import { Espiral, EspiralDoble, PulsoSon, VinetaComic } from "../components/Espirales.jsx";
import { Reveal } from "../components/Reveal.jsx";
import { RedesSociales } from "../components/RedesSociales.jsx";
import { gsap, prefiereMenosMovimiento } from "../lib/gsap.js";

const EJES_POR_ID = new Map(EJES.flatMap((eje) => eje.items.map((item) => [item.id, item])));
const PERFIL_POR_ID = new Map(PERFIL.map((campo) => [campo.id, campo]));
const ABIERTAS_POR_ID = new Map(ABIERTAS.map((campo) => [campo.id, campo]));
const SERVICIO_ICONOS = [VinetaComic, PulsoSon, EspiralDoble];

const INICIAL = { nombre: "", correo: "", segmento: "", dispositivo: "", primeraVez: "" };
const BASE_INPUT =
  "w-full rounded-2xl border px-4 py-3 text-sm outline-none transition focus:ring-4 placeholder:text-marron/75";

function ParallaxBackdrop({ oscuro }) {
  const root = useRef(null);
  const figuras = [
    { top: "7%", left: "5%", size: "9rem", depth: 42, color: "var(--color-turquesa)", tipo: "espiral" },
    { top: "58%", left: "3%", size: "7rem", depth: 70, color: "var(--color-salmon)", tipo: "mancha" },
    { top: "14%", left: "83%", size: "12rem", depth: 54, color: "var(--color-turquesa-medio)", tipo: "espiral" },
    { top: "71%", left: "79%", size: "7rem", depth: 88, color: "var(--color-terracota)", tipo: "nota" },
    { top: "40%", left: "45%", size: "14rem", depth: 24, color: "var(--color-salmon)", tipo: "mancha" },
  ];

  useEffect(() => {
    const host = root.current;
    if (!host || prefiereMenosMovimiento()) return undefined;
    const capas = Array.from(host.querySelectorAll("[data-depth]"));
    const setters = capas.map((elemento) => ({
      depth: Number(elemento.dataset.depth),
      x: gsap.quickTo(elemento, "x", { duration: 1.1, ease: "power3.out" }),
      y: gsap.quickTo(elemento, "y", { duration: 1.1, ease: "power3.out" }),
    }));
    capas.forEach((elemento, i) => {
      gsap.to(elemento, {
        yPercent: i % 2 === 0 ? 5 : -5,
        rotate: i % 2 === 0 ? 7 : -7,
        duration: 7 + i,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    });
    const onMove = (evento) => {
      const nx = evento.clientX / window.innerWidth - 0.5;
      const ny = evento.clientY / window.innerHeight - 0.5;
      setters.forEach((capa) => {
        capa.x(-nx * capa.depth);
        capa.y(-ny * capa.depth);
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      gsap.killTweensOf(capas);
    };
  }, []);

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{
        background: oscuro
          ? "radial-gradient(110% 80% at 15% 10%, rgba(55,162,161,.24), transparent 60%), radial-gradient(100% 80% at 85% 0%, rgba(162,86,55,.23), transparent 60%), linear-gradient(160deg, #0C5555, #17120f)"
          : "radial-gradient(120% 90% at 12% 8%, rgba(94,213,183,.38), transparent 60%), radial-gradient(110% 80% at 88% 12%, rgba(239,144,105,.34), transparent 62%), radial-gradient(120% 110% at 50% 110%, rgba(55,162,161,.26), transparent 65%), linear-gradient(160deg, #FFFDE8, #fbf0e0)",
      }}
    >
      {figuras.map((figura, i) => (
        <div
          key={i}
          data-depth={figura.depth}
          className="absolute will-change-transform"
          style={{ top: figura.top, left: figura.left, width: figura.size, height: figura.size, color: figura.color }}
        >
          {figura.tipo === "espiral" ? <Espiral className="h-full w-full opacity-[0.17]" /> : null}
          {figura.tipo === "mancha" ? <div className="h-full w-full rounded-full bg-current opacity-[0.12] blur-2xl" /> : null}
          {figura.tipo === "nota" ? <PulsoSon className="h-full w-full opacity-[0.16]" /> : null}
        </div>
      ))}
      <div className={`absolute inset-0 ${oscuro ? "opacity-[0.045]" : "opacity-[0.055]"} mix-blend-multiply [background-image:radial-gradient(currentColor_1px,transparent_1px)] [background-size:22px_22px]`} />
    </div>
  );
}

function Marca({ oscuro }) {
  return (
    <a href="#inicio" aria-label="SonArte, inicio de esta invitación" className="inline-flex rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-turquesa">
      <img src={asset("/img/logo-full.png")} alt="SonArte" className="h-12 w-44 object-contain object-left" />
      <span className="sr-only">{oscuro ? "Invitación para lectores" : "Invitación para organizaciones"}</span>
    </a>
  );
}

function CampoPerfil({ id, valor, onElegir, opciones, oscuro }) {
  const campo = PERFIL_POR_ID.get(id);
  const titulo = id === "segmento" ? "¿Desde qué lugar respondes?" : campo.pregunta;
  return (
    <fieldset className="min-w-0 border-0 p-0">
      <legend className={`mb-3 text-xs font-semibold ${oscuro ? "text-crema" : "text-marron"}`}>{titulo}</legend>
      <div className="flex flex-wrap gap-2">
        {opciones.map((opcion) => (
          <Chip
            key={opcion}
            id={`landing-${id}`}
            opcion={opcion}
            valor={valor}
            onElegir={(_, elegido) => onElegir(id, elegido)}
            tono={oscuro ? "oscuro" : "claro"}
          />
        ))}
      </div>
    </fieldset>
  );
}

function CampoEscala({ item, valor, onElegir, oscuro }) {
  const texto = item.texto ?? item.pregunta;
  return (
    <fieldset className={`border-t py-5 first:border-0 first:pt-0 ${oscuro ? "border-crema/20" : "border-marron/15"}`}>
      <legend className="sr-only">{texto}</legend>
      <p className={`max-w-2xl text-[15px] leading-relaxed ${oscuro ? "text-crema" : "text-marron"}`}>{texto}</p>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <PistaEscala tono={oscuro ? "oscuro" : "claro"} className="order-2 w-full max-w-[20rem] sm:order-1" />
        <div className="order-1 sm:order-2">
          <Escala
            id={`landing-${item.id}`}
            etiqueta={texto}
            valor={valor}
            onElegir={(_, elegido) => onElegir(item.id, elegido)}
            tono={oscuro ? "oscuro" : "claro"}
          />
        </div>
      </div>
    </fieldset>
  );
}

function LandingEncuesta({ config }) {
  const oscuro = config.tema === "oscuro";
  const card = oscuro
    ? "border border-turquesa/30 bg-[#0c4543]/95 text-crema shadow-[0_18px_45px_-22px_rgba(0,0,0,.65)] backdrop-blur-md"
    : "border border-terracota/20 bg-[#fffdf5]/95 text-marron shadow-[0_18px_45px_-22px_rgba(85,39,20,.36)] backdrop-blur-md";
  const soft = oscuro ? "text-crema/85" : "text-marron/80";
  const [respuestas, setRespuestas] = useState(() => ({
    ...INICIAL,
    ...(config.id === "lectores" ? { segmento: "Lector/a" } : {}),
  }));
  const [estado, setEstado] = useState("listo");
  const [registro, setRegistro] = useState(null);
  const [error, setError] = useState("");
  const [inicio] = useState(() => Date.now());
  const preguntas = useMemo(() => config.preguntas.map((id) => EJES_POR_ID.get(id)).filter(Boolean), [config]);
  const segmento = config.id === "lectores" ? "Lector/a" : respuestas.segmento;
  const preguntaSegmento = PREGUNTAS_SEGMENTO[segmento]?.preguntas.find((pregunta) => pregunta.tipo === "escala");
  const preguntasAbiertas = useMemo(() => {
    if (config.id === "lectores") return ABIERTAS;
    const delSegmento = PREGUNTAS_SEGMENTO[segmento]?.preguntas ?? [];
    const idAbierta = segmento === "Editorial" ? "ed_historia" : "edu_contexto";
    return [delSegmento.find((pregunta) => pregunta.id === idAbierta), ABIERTAS_POR_ID.get("abierta_mejora")].filter(Boolean);
  }, [config, segmento]);
  const obligatorias = [...preguntas, ...(preguntaSegmento ? [preguntaSegmento] : [])];

  useEffect(() => {
    document.title = `${config.titulo} · SonArte`;
    const anterior = document.querySelector('meta[name="robots"]');
    const meta = anterior ?? document.createElement("meta");
    const contenidoAnterior = anterior?.content;
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    if (!anterior) document.head.appendChild(meta);
    return () => {
      if (anterior) meta.content = contenidoAnterior ?? "";
      else meta.remove();
    };
  }, [config]);

  function elegir(id, valor) {
    setRespuestas((actual) => {
      const siguientes = { ...actual, [id]: valor };
      if (id === "segmento") {
        Object.values(PREGUNTAS_SEGMENTO).flatMap((grupo) => grupo.preguntas).forEach((pregunta) => {
          siguientes[pregunta.id] = "";
        });
      }
      return siguientes;
    });
    setError("");
  }

  async function enviar(evento) {
    evento.preventDefault();
    setError("");
    const faltaTipo = config.id !== "lectores" && !respuestas.segmento;
    const faltanEscalas = obligatorias.some((pregunta) => !respuestas[pregunta.id]);
    if (faltaTipo || faltanEscalas) {
      setError(faltaTipo ? "Elige el tipo de entidad para continuar." : "Completa las valoraciones del 1 al 5 para continuar.");
      return;
    }
    const fila = construirRegistro(respuestas, {
      fecha: fechaLegible(),
      segundos: Math.round((Date.now() - inicio) / 1000),
      pagina: window.location.href,
      origenLanding: config.origen,
    });
    setRegistro(fila);
    setEstado("enviando");
    try {
      await enviarRegistro(ENVIO.endpoint, fila.columnas, fila.valores);
      setEstado("enviado");
    } catch {
      setEstado("fallo");
      setError("No logramos conectar con el buzón. Tu respuesta sigue disponible para guardarla o enviarla por correo.");
    }
  }

  function respaldoCorreo() {
    if (!registro) return "mailto:sonarte840@gmail.com";
    return `mailto:sonarte840@gmail.com?subject=${encodeURIComponent(`SonArte · ${config.titulo}`)}&body=${encodeURIComponent(aCsv(registro.columnas, registro.valores))}`;
  }

  return (
    <main id="inicio" className={`relative isolate min-h-screen overflow-hidden ${oscuro ? "bg-noche text-crema" : "bg-crema text-marron"}`}>
      <ParallaxBackdrop oscuro={oscuro} />
      <div className="relative z-10">
        <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 sm:px-8">
          <Marca oscuro={oscuro} />
          <a href="#encuesta" className={`rounded-full border-2 px-4 py-2 text-sm font-semibold transition hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-turquesa ${oscuro ? "border-turquesa text-crema hover:bg-turquesa hover:text-marron" : "border-terracota text-marron hover:bg-terracota hover:text-crema"}`}>
            Ir a la encuesta
          </a>
        </header>

        <div className="mx-auto max-w-6xl px-6 pb-16 sm:px-8 sm:pb-24">
          <section className="grid items-center gap-8 py-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12 lg:py-20">
            <div>
              <p className={`mb-4 inline-flex items-center gap-2 rounded-full border border-current/30 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] ${oscuro ? "text-turquesa" : "text-terracota"}`}>
                <Espiral className="size-4" />{config.preTitulo}
              </p>
              <h1 className="font-serif text-4xl leading-[1.05] font-bold text-balance-pretty sm:text-6xl">{config.titulo}</h1>
              <p className={`mt-6 max-w-xl text-lg leading-relaxed ${soft}`}>{config.intro}</p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a href="#encuesta" className={`inline-flex items-center gap-2 rounded-full px-7 py-3 font-semibold shadow-lg transition hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-turquesa ${oscuro ? "bg-turquesa text-marron hover:brightness-105" : "bg-marron text-crema hover:bg-terracota"}`}>
                  {config.ctaButton}<ArrowDown className="size-4" />
                </a>
                <Link to={MARCA.comicUrl} target="_blank" rel="noreferrer" className={`inline-flex items-center gap-2 rounded-full border-2 px-6 py-3 font-semibold transition ${oscuro ? "border-crema/75 text-crema hover:border-turquesa hover:text-turquesa" : "border-terracota text-marron hover:bg-terracota hover:text-crema"}`}>
                  Explorar el cómic<ArrowRight className="size-4" />
                </Link>
              </div>
            </div>

            <aside className={`${card} rounded-3xl p-7 sm:p-8`} aria-label="Perfil de esta invitación">
              <p className={`font-marca text-2xl ${oscuro ? "text-turquesa" : "text-terracota"}`}>{config.role}</p>
              <p className={`mt-3 text-sm leading-relaxed ${soft}`}>{config.perfil}</p>
              <div className={`mt-6 border-t pt-5 ${oscuro ? "border-crema/25" : "border-marron/20"}`}>
                <p className={`text-xs font-bold uppercase tracking-[0.2em] ${oscuro ? "text-turquesa" : "text-terracota"}`}>Tu objetivo</p>
                <p className="mt-2 text-base leading-relaxed">{config.objetivo}</p>
              </div>
            </aside>
          </section>

          <section className="grid gap-6 py-8 md:grid-cols-2">
            <Reveal>
              <article className={`${card} h-full rounded-3xl p-7`}>
                <h2 className="text-xl font-semibold">Lo que necesitas</h2>
                <ul className="mt-5 space-y-4">
                  {config.necesidades.map((necesidad) => <li key={necesidad} className="flex gap-3"><Espiral className={`mt-0.5 size-4 shrink-0 ${oscuro ? "text-turquesa" : "text-terracota"}`} /><span className={soft}>{necesidad}</span></li>)}
                </ul>
              </article>
            </Reveal>
            <Reveal delay={0.1}>
              <article className={`${card} h-full rounded-3xl p-7`}>
                <h2 className="text-xl font-semibold">Lo que te frena hoy</h2>
                <ul className="mt-5 space-y-4">
                  {config.frustraciones.map((frustracion) => <li key={frustracion} className="flex gap-3"><span className={`mt-2 size-2 shrink-0 rounded-full ${oscuro ? "bg-salmon" : "bg-terracota"}`} /><span className={soft}>{frustracion}</span></li>)}
                </ul>
              </article>
            </Reveal>
          </section>

          <Reveal>
            <section className={`${card} my-8 rounded-3xl p-8 sm:p-12`}>
              <p className={`flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] ${oscuro ? "text-turquesa" : "text-terracota"}`}><Sparkles className="size-4" />Una propuesta para tu mirada</p>
              <h2 className="mt-3 font-serif text-3xl font-bold">Cómo SonArte te acompaña</h2>
              <p className={`mt-4 max-w-3xl text-lg leading-relaxed ${soft}`}>{config.comoAyudamos}</p>
            </section>
          </Reveal>

          <section className="py-8">
            <h2 className="font-serif text-3xl font-bold">Conoce el universo SonArte</h2>
            <div className="mt-6 grid gap-6 md:grid-cols-3">
              {config.servicios.map((servicio, i) => {
                const Icono = SERVICIO_ICONOS[i % SERVICIO_ICONOS.length];
                return <Reveal key={servicio.title} delay={i * 0.08}>
                  <article className={`${card} h-full rounded-3xl p-6`}>
                    <Icono className={`size-8 ${oscuro ? "text-turquesa" : "text-terracota"}`} />
                    <h3 className="mt-4 text-lg font-semibold">{servicio.title}</h3>
                    <p className={`mt-2 text-sm leading-relaxed ${soft}`}>{servicio.text}</p>
                  </article>
                </Reveal>;
              })}
            </div>
          </section>

          <section id="encuesta" className="scroll-mt-6 py-10">
            <Reveal>
              <div className={`${card} rounded-3xl p-6 sm:p-10`}>
                <div className="mx-auto max-w-2xl text-center">
                  <p className={`text-xs font-bold uppercase tracking-[0.22em] ${oscuro ? "text-turquesa" : "text-terracota"}`}>Queremos escucharte</p>
                  <h2 className="mt-3 font-serif text-3xl font-bold text-balance-pretty sm:text-4xl">{config.ctaTitle}</h2>
                  <p className={`mt-4 leading-relaxed ${soft}`}>{config.ctaText}</p>
                </div>

                {estado === "enviado" ? (
                  <div className={`mx-auto mt-8 max-w-2xl rounded-2xl border p-6 text-center ${oscuro ? "border-turquesa/40 bg-verde-oscuro" : "border-terracota/20 bg-crema"}`} role="status" aria-live="polite">
                    <span className={`mx-auto grid size-12 place-items-center rounded-full ${oscuro ? "bg-turquesa text-marron" : "bg-marron text-crema"}`}><Check className="size-6" /></span>
                    <h3 className="mt-4 font-serif text-2xl font-bold">Gracias por compartir tu mirada.</h3>
                    <p className={`mt-2 ${soft}`}>Tu respuesta quedó registrada y ayuda a que esta memoria siga encontrando nuevas formas de sonar.</p>
                    <Link to={MARCA.comicUrl} className={`mt-5 inline-flex items-center gap-2 font-semibold ${oscuro ? "text-turquesa" : "text-terracota"}`}>Volver al cómic<ArrowRight className="size-4" /></Link>
                  </div>
                ) : (
                  <form onSubmit={enviar} className="mx-auto mt-8 max-w-3xl">
                    <div className="grid gap-7">
                      <section className={`rounded-2xl border p-5 sm:p-6 ${oscuro ? "border-crema/20 bg-verde-oscuro/70" : "border-marron/15 bg-crema/75"}`}>
                        <h3 className="text-lg font-semibold">Para entender desde dónde respondes</h3>
                        <div className="mt-5 grid gap-6">
                          {config.id === "lectores" ? (
                            <div>
                              <p className={`mb-2 text-xs font-semibold ${oscuro ? "text-crema" : "text-marron"}`}>Segmento</p>
                              <span className={`inline-flex rounded-full px-4 py-2 text-xs font-semibold ${oscuro ? "bg-turquesa text-marron" : "bg-marron text-crema"}`}>Lector/a</span>
                            </div>
                          ) : (
                            <div>
                              <CampoPerfil id="segmento" valor={respuestas.segmento} onElegir={elegir} opciones={["Institución educativa", "Editorial"]} oscuro={oscuro} />
                              <p className={`mt-2 text-xs ${oscuro ? "text-crema/80" : "text-marron/75"}`}>Institución educativa incluye colegios, universidades y centros educativos.</p>
                            </div>
                          )}
                          <div className="grid gap-6 sm:grid-cols-2">
                            <CampoPerfil id="dispositivo" valor={respuestas.dispositivo} onElegir={elegir} opciones={PERFIL_POR_ID.get("dispositivo").opciones} oscuro={oscuro} />
                            <CampoPerfil id="primeraVez" valor={respuestas.primeraVez} onElegir={elegir} opciones={PERFIL_POR_ID.get("primeraVez").opciones} oscuro={oscuro} />
                          </div>
                          <div className="grid gap-5 sm:grid-cols-2">
                            <label className="block"><span className={`mb-2 block text-xs font-semibold ${oscuro ? "text-crema" : "text-marron"}`}>Nombre <span className="font-normal">(opcional)</span></span><input value={respuestas.nombre} onChange={(evento) => elegir("nombre", evento.target.value)} autoComplete="name" className={`${BASE_INPUT} ${oscuro ? "border-crema/40 bg-crema text-marron focus:border-turquesa focus:ring-turquesa/30" : "border-marron/30 bg-white text-marron focus:border-terracota focus:ring-terracota/20"}`} placeholder="¿Cómo te llamas?" /></label>
                            <label className="block"><span className={`mb-2 block text-xs font-semibold ${oscuro ? "text-crema" : "text-marron"}`}>Correo <span className="font-normal">(opcional)</span></span><input type="email" value={respuestas.correo} onChange={(evento) => elegir("correo", evento.target.value)} autoComplete="email" className={`${BASE_INPUT} ${oscuro ? "border-crema/40 bg-crema text-marron focus:border-turquesa focus:ring-turquesa/30" : "border-marron/30 bg-white text-marron focus:border-terracota focus:ring-terracota/20"}`} placeholder="tu@correo.com" /></label>
                          </div>
                        </div>
                      </section>

                      <section className={`rounded-2xl border p-5 sm:p-6 ${oscuro ? "border-crema/20 bg-verde-oscuro/70" : "border-marron/15 bg-crema/75"}`}>
                        <div className={`flex flex-wrap items-end justify-between gap-3 border-b pb-4 ${oscuro ? "border-crema/25" : "border-marron/20"}`}>
                          <div><h3 className="text-lg font-semibold">Una impresión, del 1 al 5</h3><p className={`mt-1 text-sm ${oscuro ? "text-crema/80" : "text-marron/75"}`}>1 · nada o poco · 5 · del todo o mucho</p></div>
                          <span className={`text-xs font-semibold ${oscuro ? "text-crema/80" : "text-marron/75"}`}>{obligatorias.length} valoraciones</span>
                        </div>
                        <div className="mt-5">
                          {preguntas.map((pregunta) => <CampoEscala key={pregunta.id} item={pregunta} valor={respuestas[pregunta.id]} onElegir={elegir} oscuro={oscuro} />)}
                          {preguntaSegmento ? <CampoEscala item={preguntaSegmento} valor={respuestas[preguntaSegmento.id]} onElegir={elegir} oscuro={oscuro} /> : null}
                        </div>
                      </section>

                      <section className={`rounded-2xl border p-5 sm:p-6 ${oscuro ? "border-crema/20 bg-verde-oscuro/70" : "border-marron/15 bg-crema/75"}`}>
                        <h3 className="text-lg font-semibold">{config.tituloAbiertas}</h3>
                        <p className={`mt-1 text-sm ${oscuro ? "text-crema/80" : "text-marron/75"}`}>Responde las que quieras; todas son opcionales.</p>
                        <div className="mt-5 grid gap-5">
                          {preguntasAbiertas.map((campo) => (
                            <label key={campo.id} className="block">
                              <span className={`mb-2 block text-sm font-semibold ${oscuro ? "text-crema" : "text-marron"}`}>{campo.pregunta} <span className="font-normal">(opcional)</span></span>
                              <textarea rows={3} maxLength={600} value={respuestas[campo.id] ?? ""} onChange={(evento) => elegir(campo.id, evento.target.value)} className={`${BASE_INPUT} resize-y ${oscuro ? "border-crema/40 bg-crema text-marron focus:border-turquesa focus:ring-turquesa/30" : "border-marron/30 bg-white text-marron focus:border-terracota focus:ring-terracota/20"}`} placeholder={campo.pista ?? "Cuéntanos un poco más…"} />
                            </label>
                          ))}
                        </div>
                      </section>
                    </div>

                    {error ? <p className="mt-5 rounded-xl border border-salmon bg-crema px-4 py-3 text-sm font-semibold text-marron" role="alert">{error}</p> : null}
                    {estado === "fallo" && registro ? <div className="mt-4 flex flex-wrap gap-3"><button type="button" onClick={() => descargarCsv("sonarte-landing.csv", aCsv(registro.columnas, registro.valores))} className={`rounded-full border-2 px-4 py-2 text-sm font-semibold ${oscuro ? "border-turquesa text-crema" : "border-terracota text-marron"}`}>Descargar CSV</button><a href={respaldoCorreo()} className={`rounded-full border-2 px-4 py-2 text-sm font-semibold ${oscuro ? "border-turquesa text-crema" : "border-terracota text-marron"}`}>Enviar por correo</a></div> : null}
                    <div className={`mt-6 flex flex-col gap-4 border-t pt-5 sm:flex-row sm:items-center sm:justify-between ${oscuro ? "border-crema/25" : "border-marron/20"}`}>
                      <p className={`max-w-sm text-sm leading-relaxed ${soft}`}>Gracias por ayudarnos a acercar la música y la memoria del Caribe a más personas.</p>
                      <button type="submit" disabled={estado === "enviando"} className={`inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold shadow-lg transition hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-70 ${oscuro ? "bg-turquesa text-marron" : "bg-marron text-crema hover:bg-terracota"}`}>
                        {estado === "enviando" ? <><LoaderCircle className="size-4 animate-spin" /> Enviando</> : <><Send className="size-4" /> Compartir mi mirada</>}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </Reveal>
          </section>
        </div>

        <footer className={`relative z-10 mx-auto max-w-6xl px-6 pb-10 text-sm sm:px-8 ${soft}`}>
          <div className={`flex flex-wrap items-center justify-between gap-4 border-t pt-6 ${oscuro ? "border-crema/25" : "border-marron/20"}`}>
            <div>
              <Marca oscuro={oscuro} />
              <RedesSociales tono={oscuro ? "oscuro" : "claro"} className="mt-3" />
            </div>
            <p className="font-medium">Cómic digital transmedia que revive el folclore colombiano.</p>
          </div>
        </footer>
      </div>
    </main>
  );
}

export default LandingEncuesta;
