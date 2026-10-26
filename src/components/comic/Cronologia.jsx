export function Cronologia({ hitos = [] }) {
  return (
    <ol className="relative space-y-4 border-l-2 border-terracota/50 pl-5">
      {hitos.map((h) => (
        <li key={`${h.anio}-${h.hito}`} className="relative">
          <span className="absolute -left-[27px] top-1.5 size-3 rounded-full bg-salmon ring-4 ring-[#151210]" />
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-turquesa">{h.anio}</p>
          <p className="mt-0.5 font-serif text-[15px] leading-snug text-crema/85">{h.hito}</p>
        </li>
      ))}
    </ol>
  );
}
