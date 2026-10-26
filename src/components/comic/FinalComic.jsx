import { ArrowLeft, Award, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";
import { asset } from "../../lib/asset.js";

export function FinalComic({ onVolver, onCofre }) {
  return (
    <div className="absolute inset-0 z-[60] overflow-y-auto bg-[#080706] text-crema">
      <img
        src={asset("/escenarios/esc-parque.jpg")}
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-30"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#080706] via-[#080706]/85 to-[#080706]/45" />

      <div className="relative z-10 mx-auto flex min-h-full max-w-3xl flex-col items-center justify-center px-6 py-12 text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-turquesa">
          Fin del viaje
        </p>
        <h2 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">
          La voz sigue sonando
        </h2>
        <p className="mt-5 max-w-xl font-serif text-lg leading-relaxed text-crema/75 sm:text-xl">
          «El viaje termina aquí. Pero la voz de Joe sigue sonando en cualquier esquina donde
          alguien, sin darse cuenta, empiece a cantar.»
        </p>
        <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-crema/35">
          El Centurión
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={onCofre}
            className="inline-flex items-center gap-2 rounded-full bg-turquesa px-5 py-2.5 text-xs font-bold uppercase tracking-[0.16em] text-marron"
          >
            <Award className="size-4" />
            Abrir el cofre del legado
          </button>
          <button
            type="button"
            onClick={onVolver}
            className="inline-flex items-center gap-2 rounded-full border border-crema/25 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-crema/70 transition hover:border-crema/50 hover:text-crema"
          >
            <RotateCcw className="size-4" />
            Volver al prólogo
          </button>
          <Link
            to="/comic"
            className="inline-flex items-center gap-2 rounded-full border border-crema/15 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-crema/45 transition hover:border-crema/35 hover:text-crema/75"
          >
            <ArrowLeft className="size-4" />
            Salir del cómic
          </Link>
        </div>

        <div className="mt-12 grid max-w-xl gap-3 text-left sm:grid-cols-3">
          {[
            { t: "Historia", d: "Narrativa e investigación de Joseph." },
            { t: "Ilustración", d: "Dirección de arte e ilustración de Yurany." },
            { t: "Sonido", d: "Música, voces y ambientes del cómic." },
          ].map((c) => (
            <div key={c.t} className="rounded-2xl border border-crema/10 bg-crema/[0.03] p-3.5">
              <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-salmon">{c.t}</p>
              <p className="mt-1 text-xs leading-relaxed text-crema/60">{c.d}</p>
            </div>
          ))}
        </div>

        <p className="mt-10 text-[9px] uppercase tracking-[0.24em] text-crema/25">
          SonArte · Proyecto transmedia · {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
