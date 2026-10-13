import { useRef, useState } from "react";
import { Send } from "lucide-react";
import { gsap, prefiereMenosMovimiento } from "../lib/gsap.js";
import { Reveal } from "../components/Reveal.jsx";
import { Espiral } from "../components/Espirales.jsx";

export default function Contacto() {
  const [correo, setCorreo] = useState("");
  const [error, setError] = useState("");
  const [enviado, setEnviado] = useState(false);
  const confirmacion = useRef(null);

  function onSubmit(e) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      setError("Revisa el correo, parece incompleto.");
      return;
    }
    setError("");
    setEnviado(true);
    setCorreo("");
    if (!prefiereMenosMovimiento() && confirmacion.current) {
      gsap.fromTo(
        confirmacion.current,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
      );
    }
  }

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden superficie-espuma pt-40 pb-28">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -left-24 top-24 size-72 rounded-full bg-turquesa/35 blur-3xl anim-lava" />
        <div className="absolute -right-16 bottom-16 size-80 rounded-full bg-salmon/25 blur-3xl anim-lava" style={{ animationDelay: "5s" }} />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-xl px-5 text-center">
        <Reveal dir="scale">
          <Espiral className="mx-auto size-14 text-terracota/70 anim-girar-lento" />
          <h1 className="mt-7 font-serif text-4xl text-marron sm:text-5xl">Hablemos de son</h1>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            Déjanos tu correo y te contamos cuando salga un nuevo capítulo, un número de la revista o un escenario recién ilustrado.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <form
            onSubmit={onSubmit}
            className="mt-10 flex flex-col gap-3 rounded-[2rem] bg-crema/90 p-4 backdrop-blur-sm sombra-suave sm:flex-row sm:items-center"
          >
            <label htmlFor="correo" className="sr-only">Tu correo electrónico</label>
            <input
              id="correo"
              type="email"
              required
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="tucorreo@ejemplo.com"
              className="w-full flex-1 rounded-full bg-transparent px-6 py-3.5 text-base text-marron outline-none placeholder:text-muted-foreground/70 focus:ring-2 focus:ring-terracota/40"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-full superficie-caribe px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.16em] text-crema transition-all duration-500 hover:-translate-y-0.5 hover:sombra-flotante"
            >
              Enviar
              <Send className="size-4" />
            </button>
          </form>
          {error ? (
            <p role="alert" className="mt-3 text-sm font-semibold text-terracota">{error}</p>
          ) : null}
        </Reveal>

        {enviado ? (
          <p ref={confirmacion} className="mt-6 font-serif text-lg italic text-verde-oscuro">
            Tu correo quedó en la espiral. Nos oímos pronto.
          </p>
        ) : null}
      </div>
    </section>
  );
}
