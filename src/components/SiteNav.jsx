import { useEffect, useRef, useState } from "react";
import { Link, NavLink as RRNavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { gsap } from "../lib/gsap.js";

/** Rutas con fondo oscuro donde la nav invierte sus colores. */
const RUTAS_OSCURAS = [];

const izquierda = [
  { to: "/revista", label: "Revista" },
  { to: "/comic", label: "Cómic" },
];
const derecha = [
  { to: "/nosotros", label: "Nosotros" },
  { to: "/proceso", label: "Proceso" },
];

function LinkNav({ to, label, onClick, oscura }) {
  return (
    <RRNavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `group relative py-1 text-sm font-semibold uppercase tracking-[0.18em] transition-colors duration-300 ${
          oscura
            ? isActive
              ? "text-turquesa"
              : "text-crema/80 hover:text-turquesa"
            : isActive
              ? "text-terracota"
              : "text-marron/80 hover:text-terracota"
        }`
      }
    >
      {label}
      <span
        className={`absolute -bottom-0.5 left-0 h-[2px] w-0 rounded-full transition-all duration-500 ease-out group-hover:w-full ${
          oscura ? "bg-turquesa" : "bg-terracota"
        }`}
      />
    </RRNavLink>
  );
}

/** Header con logo central que se contrae al desplazarse (GSAP). */
export function SiteNav() {
  const { pathname } = useLocation();
  const oscura = RUTAS_OSCURAS.includes(pathname);
  const [contraido, setContraido] = useState(false);
  const [abierto, setAbierto] = useState(false);
  const logoCompleto = useRef(null);
  const logoIcono = useRef(null);

  useEffect(() => {
    const onScroll = () => setContraido(window.scrollY > 90);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const dur = 0.55;
    const ease = "power3.out";
    gsap.to(logoCompleto.current, {
      opacity: contraido ? 0 : 1,
      scale: contraido ? 0.7 : 1,
      duration: dur,
      ease,
    });
    gsap.to(logoIcono.current, {
      opacity: contraido ? 1 : 0,
      scale: contraido ? 1 : 1.5,
      duration: dur,
      ease,
    });
  }, [contraido]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        contraido
          ? oscura
            ? "bg-noche/90 py-2 shadow-[0_10px_30px_-18px_oklch(0.08_0.02_42/0.7)] backdrop-blur-md"
            : "bg-crema/90 py-2 shadow-[0_10px_30px_-18px_oklch(0.3324_0.0747_42.13/0.55)] backdrop-blur-md"
          : "bg-transparent py-4"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5">
        <div className="hidden flex-1 items-center gap-8 md:flex">
          {izquierda.map((l) => (
            <LinkNav key={l.to} {...l} oscura={oscura} />
          ))}
        </div>

        <Link to="/" aria-label="SonArte — Inicio" className="relative shrink-0">
          <div
            className="relative flex items-center justify-center transition-all duration-500"
            style={{ width: contraido ? 58 : 190, height: contraido ? 48 : 92 }}
          >
            <img
              ref={logoCompleto}
              src="/img/logo-full.png"
              alt="Isologo SonArte"
              className="absolute inset-0 h-full w-full object-contain"
            />
            <img
              ref={logoIcono}
              src="/marca/isotipo.png"
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-contain opacity-0"
            />
          </div>
        </Link>

        <div className="hidden flex-1 items-center justify-end gap-8 md:flex">
          {derecha.map((l) => (
            <LinkNav key={l.to} {...l} oscura={oscura} />
          ))}
        </div>

        <button
          type="button"
          onClick={() => setAbierto((v) => !v)}
          aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
          className={`absolute right-5 rounded-full border p-2 transition-colors md:hidden ${
            oscura ? "border-crema/30 text-crema hover:bg-crema/10" : "border-border text-marron hover:bg-card"
          }`}
        >
          {abierto ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      <div
        className={`overflow-hidden transition-all duration-500 md:hidden ${
          abierto ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="mx-5 mt-3 flex flex-col gap-4 rounded-3xl bg-crema/95 p-6 sombra-suave">
          {[...izquierda, ...derecha].map((l) => (
            <LinkNav key={l.to} {...l} onClick={() => setAbierto(false)} oscura={false} />
          ))}
        </div>
      </div>
    </header>
  );
}
