import { ESCALA } from "../../data/evaluacion.js";

/**
 * Piezas compartidas por las dos caras de la evaluación: la página completa
 * (fondo crema) y las tarjetas que aparecen dentro del cómic (fondo noche).
 * Mismos radios reales, misma escala, distinto tono.
 */

const TONOS = {
  claro: {
    escala:
      "border-marron/40 text-marron/90 hover:border-terracota/80 hover:text-terracota peer-checked:border-terracota peer-checked:bg-terracota peer-checked:text-crema peer-focus-visible:ring-terracota/25",
    chip: "border-marron/40 text-marron/90 hover:border-terracota/80 hover:text-terracota peer-checked:border-marron peer-checked:bg-marron peer-checked:text-crema peer-focus-visible:ring-terracota/25",
    pista: "text-marron/75",
  },
  oscuro: {
    escala:
      "border-crema/50 text-crema hover:border-turquesa hover:text-turquesa peer-checked:border-turquesa peer-checked:bg-turquesa peer-checked:text-marron peer-focus-visible:ring-turquesa/30",
    chip: "border-crema/50 text-crema hover:border-turquesa hover:text-turquesa peer-checked:border-turquesa peer-checked:bg-turquesa peer-checked:text-marron peer-focus-visible:ring-turquesa/30",
    pista: "text-crema/80",
  },
};

/** Escala 1–5 con radios reales: teclado, lectores de pantalla y clic, todo igual. */
export function Escala({ id, valor, onElegir, etiqueta, tono = "claro", compacta = false }) {
  const clases = TONOS[tono] ?? TONOS.claro;
  return (
    <fieldset className="m-0 min-w-0 shrink-0 border-0 p-0">
      <legend className="sr-only">{etiqueta}</legend>
      <div className="flex items-center gap-1.5">
        {ESCALA.map((opcion) => (
          <label key={opcion.valor} className="cursor-pointer">
            <input
              id={`campo-${id}-${opcion.valor}`}
              type="radio"
              name={id}
              value={opcion.valor}
              checked={Number(valor) === opcion.valor}
              onChange={() => onElegir(id, String(opcion.valor))}
              className="peer sr-only"
            />
            <span
              title={opcion.nombre}
              aria-hidden="true"
              className={`grid place-items-center rounded-full border-2 text-sm font-semibold transition-all duration-200 ${
                compacta ? "size-10 sm:size-9" : "size-11"
              } ${clases.escala}`}
            >
              {opcion.valor}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/** Opciones excluyentes en pastilla, para los datos de perfil. */
export function Chip({ id, opcion, valor, onElegir, tono = "claro" }) {
  const clases = TONOS[tono] ?? TONOS.claro;
  return (
    <label className="cursor-pointer">
      <input
        id={`campo-${id}-${opcion}`}
        type="radio"
        name={id}
        value={opcion}
        checked={valor === opcion}
        onChange={() => onElegir(id, opcion)}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className={`inline-flex items-center gap-2 rounded-full border-2 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition-all duration-200 peer-focus-visible:ring-4 ${clases.chip}`}
      >
        {opcion}
      </span>
    </label>
  );
}

/** Barra de avance que comparten la encuesta completa y el cierre del cómic. */
export function BarraAvance({ hechas, total, tono = "claro" }) {
  const porcentaje = total ? Math.round((hechas / total) * 100) : 0;
  const oscuro = tono === "oscuro";
  return (
    <div className="h-1.5 overflow-hidden rounded-full" aria-hidden="true">
      <span
        className={`block h-full rounded-full transition-all duration-500 ${
          oscuro ? "bg-turquesa" : "superficie-caribe"
        }`}
        style={{ width: `${porcentaje}%` }}
      />
    </div>
  );
}

/** Extremos de la escala, para que el 1 y el 5 nunca queden a interpretación. */
export function PistaEscala({ tono = "claro", className = "" }) {
  const clases = TONOS[tono] ?? TONOS.claro;
  return (
    <p
      className={`flex items-center justify-between gap-3 text-[10px] font-semibold uppercase tracking-[0.14em] ${clases.pista} ${className}`}
    >
      <span>1 · nada</span>
      <span>5 · del todo</span>
    </p>
  );
}
