import { PREGUNTAS_SEGMENTO } from "../../data/evaluacion.js";
import { Chip, Escala } from "./Campos.jsx";

/** Preguntas condicionales que distinguen el uso educativo de la oportunidad editorial. */
export function PreguntasSegmento({ segmento, respuestas, onResponder, tono = "claro", faltantes = [] }) {
  const bloque = PREGUNTAS_SEGMENTO[segmento];
  if (!bloque) return null;

  const oscuro = tono === "oscuro";
  return (
    <section className={`mt-6 rounded-2xl border p-4 sm:p-5 ${oscuro ? "border-turquesa/20 bg-crema/[0.035]" : "border-terracota/15 bg-crema/70"}`}>
      <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ${oscuro ? "text-turquesa" : "text-terracota"}`}>
        Preguntas para {segmento === "Institución educativa" ? "educación" : "editoriales"}
      </p>
      <h3 className={`mt-1 font-serif text-xl ${oscuro ? "text-crema" : "text-marron"}`}>{bloque.titulo}</h3>
      <div className="mt-4 space-y-4">
        {bloque.preguntas.map((pregunta) => (
          <div key={pregunta.id} data-campo={pregunta.id} className={`border-t pt-3 first:border-0 first:pt-0 ${oscuro ? "border-crema/10" : "border-terracota/10"}`}>
            <p className={`text-[13px] leading-relaxed ${oscuro ? "text-crema/80" : "text-marron"}`}>
              {pregunta.pregunta}
              {pregunta.obligatoria ? <span className={`ml-1 text-[10px] ${oscuro ? "text-turquesa/60" : "text-terracota/65"}`}>(necesaria)</span> : null}
              {pregunta.tipo === "texto" || !pregunta.opciones && pregunta.tipo !== "escala" ? (
                <span className={`ml-1 text-[10px] ${oscuro ? "text-crema/35" : "text-marron/45"}`}>(opcional)</span>
              ) : null}
            </p>
            {pregunta.tipo === "escala" ? (
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <Escala
                  id={pregunta.id}
                  etiqueta={pregunta.pregunta}
                  valor={respuestas[pregunta.id]}
                  onElegir={onResponder}
                  tono={tono}
                  compacta
                />
                <span className={`text-[10px] ${oscuro ? "text-crema/40" : "text-marron/45"}`}>1 · poco — 5 · mucho</span>
              </div>
            ) : pregunta.opciones ? (
              <fieldset className="mt-2 flex flex-wrap gap-2 border-0 p-0">
                <legend className="sr-only">{pregunta.pregunta}</legend>
                {pregunta.opciones.map((opcion) => (
                  <Chip
                    key={opcion}
                    id={pregunta.id}
                    opcion={opcion}
                    valor={respuestas[pregunta.id]}
                    onElegir={onResponder}
                    tono={tono}
                  />
                ))}
              </fieldset>
            ) : (
              <textarea
                id={`campo-${pregunta.id}`}
                name={pregunta.id}
                rows={2}
                maxLength={600}
                value={respuestas[pregunta.id] ?? ""}
                onChange={(evento) => onResponder(pregunta.id, evento.target.value)}
                placeholder={pregunta.pista}
                className={`mt-2 w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none transition focus:ring-4 ${oscuro ? "border-crema/15 bg-crema/[0.04] text-crema placeholder:text-crema/30 focus:border-turquesa/60 focus:ring-turquesa/15" : "border-terracota/25 bg-crema text-marron placeholder:text-muted-foreground/80 focus:border-terracota/60 focus:ring-terracota/15"}`}
              />
            )}
            {faltantes.includes(pregunta.id) ? (
              <p className="mt-1.5 text-[11px] font-semibold text-salmon">Responde esta pregunta para continuar.</p>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
