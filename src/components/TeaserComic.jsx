import { Link } from "react-router-dom";
import { ArrowRight, Play } from "lucide-react";
import { asset } from "../lib/asset.js";

/**
 * Invitación al cómic en forma de viñeta: el cuadro del barrio con un globo de
 * voz, un latido de sonido y el botón de entrada.
 *
 * Va con imagen y animación de CSS a propósito: la escena en video pesa 16 MB y
 * guarda su índice al final del archivo, así que el navegador no podría mostrar
 * ni el primer fotograma sin descargarla casi completa. Una miniatura ligera
 * invita igual y no cobra la entrada por adelantado.
 */
export function TeaserComic({ to = "/comic/experiencia" }) {
  return (
    <div className="relative">
      {/* Globo de voz: la promesa antes del botón */}
      <div className="pointer-events-none absolute -top-6 left-3 z-20 max-w-[17rem] -rotate-2 sm:left-6">
        <p className="rounded-2xl border-[3px] border-marron bg-crema px-4 py-2.5 font-serif text-sm leading-snug text-marron shadow-[4px_4px_0_0_var(--color-marron)]">
          «Esto no es una historia… es la anatomía de un trueno.»
        </p>
      </div>

      <Link
        to={to}
        aria-label="Abrir el cómic interactivo SonArte"
        className="group relative block overflow-hidden rounded-[1.5rem] border-[3px] border-crema bg-noche shadow-[10px_10px_0_0_oklch(0.7965_0.1164_174.08/0.45)] transition-transform duration-500 hover:-translate-y-1.5 focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-turquesa"
      >
        <div className="relative aspect-video overflow-hidden">
          <img
            src={asset("/escenarios/esc-calle.jpg")}
            alt="Joe Arroyo cantando en una calle del barrio Nariño, ilustración del cómic"
            className="anim-acercar absolute inset-0 h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />

          <span
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-noche via-noche/20 to-noche/45"
            aria-hidden="true"
          />

          {/* Latido: se lee como sonido antes de ponerlo */}
          <span className="absolute inset-0 grid place-items-center" aria-hidden="true">
            <span className="relative grid size-20 place-items-center sm:size-24">
              <span className="absolute inset-0 rounded-full border border-turquesa/40 anim-pulso-halo" />
              <span
                className="absolute inset-2 rounded-full border border-crema/25 anim-pulso-halo"
                style={{ animationDelay: "1.2s" }}
              />
              <span className="relative grid size-16 place-items-center rounded-full bg-crema/95 text-marron shadow-[0_16px_40px_-12px_rgba(0,0,0,0.8)] transition-all duration-500 group-hover:scale-110 group-hover:bg-turquesa sm:size-20">
                <Play className="size-6 fill-current sm:size-7" />
              </span>
            </span>
          </span>

          <span className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-3 p-4 sm:p-5">
            <span className="min-w-0">
              <span className="inline-flex items-center gap-2 rounded-full border border-crema/25 bg-noche/60 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-crema/75 backdrop-blur-sm">
                Capítulo I · 0:30
              </span>
              <span className="mt-2 block font-serif text-xl leading-tight text-crema sm:text-2xl">
                El barrio Nariño
              </span>
              <span className="mt-1 block text-[11px] uppercase tracking-[0.16em] text-crema/55">
                Con sonido y escenas que responden
              </span>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-turquesa px-4 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-marron transition-transform duration-500 group-hover:translate-x-1">
              Entrar
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </span>
          </span>
        </div>
      </Link>
    </div>
  );
}
