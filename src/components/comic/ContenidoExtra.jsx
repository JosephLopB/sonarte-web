import { ExternalLink } from "lucide-react";
import { Cronologia } from "./Cronologia.jsx";
import { MapaGiras } from "./MapaGiras.jsx";
import { MesaJoeson } from "./MesaJoeson.jsx";

/** Contenido de un extra del cómic. Lo comparten el panel de guion y la exploración. */
export function ContenidoExtra({ extra }) {
  if (extra.tipo === "mezcla") return <MesaJoeson />;
  if (extra.tipo === "mapa") return <MapaGiras ciudades={extra.ciudades} />;
  if (extra.tipo === "cronologia") return <Cronologia hitos={extra.hitos} />;

  if (extra.tipo === "enlaces") {
    return (
      <ul className="space-y-2.5">
        {extra.enlaces.map((e) => (
          <li key={e.url}>
            <a
              href={e.url}
              target="_blank"
              rel="noreferrer noopener"
              className="group block rounded-xl border border-crema/10 bg-crema/[0.03] p-3 transition hover:border-turquesa/50 hover:bg-crema/[0.06]"
            >
              <p className="flex items-start gap-2 text-sm font-semibold text-crema transition group-hover:text-turquesa">
                {e.titulo}
                <ExternalLink className="mt-0.5 size-3.5 shrink-0 opacity-60" aria-hidden="true" />
              </p>
              <p className="mt-1 text-xs leading-relaxed text-crema/55">{e.nota}</p>
            </a>
          </li>
        ))}
      </ul>
    );
  }

  if (extra.tipo === "ficha") {
    return (
      <div className="space-y-2">
        {extra.frases.map((f, i) => (
          <p
            key={f}
            className="rounded-xl border-l-2 border-terracota/70 bg-crema/[0.04] px-3 py-2 font-serif text-sm leading-relaxed text-crema/80"
            style={{ marginLeft: `${i * 6}px` }}
          >
            {f}
          </p>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {extra.parrafos?.map((p) => (
        <p key={p} className="font-serif text-sm leading-relaxed text-crema/80">
          {p}
        </p>
      ))}
      {extra.dato ? (
        <p className="rounded-xl border-l-2 border-turquesa bg-turquesa/10 px-3 py-2 text-xs leading-relaxed text-crema/75">
          <strong className="mr-1 uppercase tracking-[0.16em] text-turquesa">Dato</strong>
          {extra.dato}
        </p>
      ) : null}
    </div>
  );
}
