import { Link, useLocation } from "react-router-dom";
import { Mail } from "lucide-react";

/**
 * Acceso flotante al formulario, fijo en la esquina inferior izquierda.
 * En /contacto no se muestra: la propia página ya es el formulario.
 */
export function BotonContacto() {
  const { pathname } = useLocation();

  if (pathname === "/contacto") return null;

  return (
    <Link
      to="/contacto"
      aria-label="Escríbenos: ir al formulario de contacto"
      className="group fixed bottom-5 left-5 z-40 grid size-14 place-items-center rounded-full bg-marron text-crema shadow-[0_16px_34px_-14px_oklch(0.08_0.02_42/0.85)] ring-2 ring-turquesa/80 transition-all duration-300 hover:-translate-y-1 hover:bg-terracota hover:ring-turquesa focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-turquesa sm:bottom-6 sm:left-6 sm:size-16 print:hidden"
    >
      <Mail
        className="size-6 transition-transform duration-500 group-hover:-rotate-6 sm:size-7"
        aria-hidden="true"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-full top-1/2 ml-3 hidden -translate-y-1/2 whitespace-nowrap rounded-full bg-crema px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-marron opacity-0 shadow-lg ring-1 ring-marron/10 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 sm:block"
      >
        Escríbenos
      </span>
    </Link>
  );
}
