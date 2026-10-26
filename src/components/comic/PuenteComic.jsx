import { useEffect, useState } from "react";
import { asset } from "../../lib/asset.js";

export function PuenteComic({ grupo, indiceLinea = 0 }) {
  const puente = grupo.puente;
  const linea = puente?.lineas[indiceLinea];
  const [textoVisible, setTextoVisible] = useState("");

  useEffect(() => {
    if (!linea) {
      setTextoVisible("");
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTextoVisible(linea.texto);
      return;
    }
    setTextoVisible("");
    let caracteres = 0;
    const intervalo = window.setInterval(() => {
      caracteres = Math.min(caracteres + 2, linea.texto.length);
      setTextoVisible(linea.texto.slice(0, caracteres));
      if (caracteres === linea.texto.length) window.clearInterval(intervalo);
    }, 24);
    return () => window.clearInterval(intervalo);
  }, [linea?.texto, indiceLinea]);

  if (!puente || !linea) return null;

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#0b0908] text-crema">
      <img
        src={asset(puente.fondo)}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/15 to-black/35" />

      <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between gap-3 px-4 py-3 sm:px-7 sm:py-5">
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-turquesa sm:text-[10px]">
            {puente.epoca}
          </p>
          <h2 className="mt-1 font-serif text-xl text-crema drop-shadow sm:text-2xl">
            {puente.titulo}
          </h2>
        </div>
        <span className="shrink-0 rounded-full border border-crema/20 bg-black/35 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-crema/75 backdrop-blur-sm sm:text-[10px]">
          {indiceLinea + 1} / {puente.lineas.length}
        </span>
      </div>

      <div
        key={indiceLinea}
        className="absolute inset-x-3 bottom-3 z-10 rounded-2xl border border-black/20 bg-[#8f8f82]/95 px-4 py-3 shadow-2xl sm:inset-x-7 sm:bottom-6 sm:px-8 sm:py-6"
      >
        <p className="text-sm font-black uppercase tracking-[0.12em] text-[#6b2e14] sm:text-xl">
          {linea.voz}
        </p>
        {linea.acotacion ? (
          <p className="mt-0.5 text-[10px] italic text-[#2a201a]/70 sm:text-xs">
            {linea.acotacion}
          </p>
        ) : null}
        <p className="mt-1 font-sans text-sm font-bold leading-relaxed text-[#0a0a0a] sm:mt-2 sm:text-lg md:text-xl">
          {textoVisible}
        </p>
        <p className="mt-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#2a201a]/65 sm:mt-3 sm:text-[10px]">
          Usa «Siguiente» o la flecha → para continuar el diálogo
        </p>
      </div>
    </div>
  );
}
