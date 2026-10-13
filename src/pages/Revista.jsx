import { Link } from "react-router-dom";
import { Reveal } from "../components/Reveal.jsx";
import { FondoGrafico, OlasFlotantes } from "../components/FondoGrafico.jsx";
import { MARCA } from "../data/marca.js";

const claves = [
  {
    titulo: "Memoria",
    texto: "Rescatamos la historia de Joe Arroyo y los ritmos que marcaron al Caribe colombiano.",
  },
  {
    titulo: "Proceso",
    texto: "Bocetos, fichas de personaje y escenarios: cómo nace cada página del cómic.",
  },
  {
    titulo: "Cultura viva",
    texto: "Voces jóvenes que siguen tocando, bailando y dibujando lo nuestro.",
  },
];

export default function Revista() {
  return (
    <section className="relative overflow-hidden bg-crema pt-40 pb-28">
      <FondoGrafico />
      <OlasFlotantes className="opacity-70" />

      <div className="relative z-10 mx-auto max-w-5xl px-5">
        <Reveal>
          <h1 className="font-serif text-5xl leading-tight text-marron sm:text-6xl">
            Revista <span className="texto-espiral">SonArte</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Un número pensado como puente: entre la investigación y el dibujo, entre el archivo musical y la pantalla.
            Aquí contamos qué escuchamos, qué leímos y qué ilustramos para construir el universo de SonArte, con la
            intención de que el folclore deje de ser algo lejano y vuelva a sonar cerca.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-10 sm:grid-cols-3">
          {claves.map((c, i) => (
            <Reveal key={c.titulo} delay={i * 0.1} className="h-full">
              <article className="group flex h-full flex-col">
                <span className="font-impacto text-5xl leading-none text-terracota/70 transition-colors duration-300 group-hover:text-terracota">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="mt-4 block h-px w-full bg-marron/20" aria-hidden="true" />
                <h2 className="mt-5 font-serif text-2xl text-marron">{c.titulo}</h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{c.texto}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal dir="scale" delay={0.15}>
          <div className="mt-14 overflow-hidden rounded-[2rem] border-4 border-terracota/20 bg-card sombra-flotante">
            <iframe
              title="Revista SonArte completa"
              src={MARCA.revistaUrl}
              className="h-[78vh] min-h-[520px] w-full"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            ¿Prefieres pantalla completa?{" "}
            <a
              href={MARCA.revistaUrl}
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-terracota underline underline-offset-4 transition-colors hover:text-marron"
            >
              Abre la revista en una pestaña nueva
            </a>
          </p>
        </Reveal>

        <Reveal delay={0.25}>
          <div className="mt-10 text-center">
            <Link
              to="/comic"
              className="inline-flex items-center gap-2 rounded-full superficie-caribe px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.16em] text-crema sombra-suave transition-all duration-500 hover:-translate-y-1 hover:sombra-flotante"
            >
              Sigue al cómic interactivo
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
