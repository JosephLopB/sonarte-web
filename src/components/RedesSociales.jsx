import { ArrowUpRight } from "lucide-react";

const REDES = [
  { nombre: "Instagram", href: "https://www.instagram.com/sonarte_edt/" },
  { nombre: "TikTok", href: "https://www.tiktok.com/@sonarte_official" },
  { nombre: "YouTube", href: "https://www.youtube.com/@SonArte-Multimedia" },
  { nombre: "LinkedIn", href: "https://www.linkedin.com/in/sonarte-editorial/" },
];

export function RedesSociales({ tono = "claro", className = "" }) {
  const oscuro = tono === "oscuro";
  const link = oscuro
    ? "text-crema hover:text-turquesa focus-visible:outline-turquesa"
    : "text-marron hover:text-terracota focus-visible:outline-terracota";

  return (
    <nav aria-label="Redes sociales de SonArte" className={className}>
      <ul className="flex flex-wrap gap-x-5 gap-y-2">
        {REDES.map((red) => (
          <li key={red.nombre}>
            <a
              href={red.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${red.nombre} de SonArte (abre en una pestaña nueva)`}
              className={`inline-flex min-h-8 items-center gap-1 text-sm font-semibold underline decoration-current/35 underline-offset-4 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 ${link}`}
            >
              {red.nombre}
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
