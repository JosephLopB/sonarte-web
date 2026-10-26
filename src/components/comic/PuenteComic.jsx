import { ArrowRight, Route } from "lucide-react";
import { asset } from "../../lib/asset.js";

export function PuenteComic({ grupo, onContinuar, onSaltar }) {
  const puente = grupo.puente;
  if (!puente) return null;

  return (
    <div className="relative h-full w-full overflow-y-auto bg-[#0b0908] text-crema">
      <img
        src={asset(puente.fondo)}
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-35"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0b0908] via-[#0b0908]/80 to-[#0b0908]/45" />

      <div className="relative z-10 mx-auto flex min-h-full max-w-2xl flex-col justify-center px-5 py-7 sm:px-8 sm:py-10">
        <p className="inline-flex w-fit items-center gap-1.5 rounded-full border border-terracota/40 bg-terracota/15 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-crema/75">
          <Route className="size-3" />
          Puente del guion
        </p>
        <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-turquesa">
          {puente.epoca}
        </p>
        <h2 className="mt-1 font-serif text-4xl leading-tight text-crema sm:text-5xl">
          {puente.titulo}
        </h2>

        <div className="mt-5 space-y-3 border-l-2 border-terracota/60 pl-4">
          {puente.lineas.map((linea) => (
            <p key={linea.texto} className="text-sm leading-relaxed text-crema/85 sm:text-base">
              <span className="mr-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-salmon">
                {linea.voz}
              </span>
              {linea.acotacion ? (
                <span className="mr-1.5 text-[11px] italic text-crema/45">({linea.acotacion})</span>
              ) : null}
              {linea.texto}
            </p>
          ))}
        </div>

        <p className="mt-4 text-[11px] leading-relaxed text-crema/40">{puente.nota}</p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onContinuar}
            className="inline-flex items-center gap-2 rounded-full bg-turquesa px-5 py-2.5 text-xs font-bold uppercase tracking-[0.16em] text-marron transition hover:brightness-105"
          >
            Entrar a la escena
            <ArrowRight className="size-4" />
          </button>
          <button
            type="button"
            onClick={onSaltar}
            className="text-[10px] font-semibold uppercase tracking-[0.16em] text-crema/40 underline underline-offset-4 transition hover:text-crema/70"
          >
            Saltar el puente
          </button>
        </div>
      </div>
    </div>
  );
}
