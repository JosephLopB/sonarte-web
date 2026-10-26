import { Link } from "react-router-dom";
import { MARCA } from "../data/marca.js";
import { CONTACTO } from "../data/sitio.js";
import { asset } from "../lib/asset.js";

export function SiteFooter() {
  return (
    <footer className="superficie-profunda text-crema">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link
            to="/"
            aria-label="SonArte — Inicio"
            className="group inline-flex items-center gap-3.5 transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-turquesa"
          >
            <img
              src={asset("/marca/isotipo.png")}
              alt=""
              aria-hidden="true"
              width="512"
              height="512"
              loading="lazy"
              className="size-16 shrink-0 rounded-[1.2rem] shadow-[0_14px_30px_-18px_oklch(0.08_0.02_42/0.85)] ring-1 ring-crema/20 transition-transform duration-500 group-hover:-rotate-3"
            />
            <span className="font-serif text-3xl leading-none tracking-tight text-crema">
              SonArte
            </span>
          </Link>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-crema/75">
            Editorial web multimedia del Caribe colombiano. El folclore vuelve a sonar, dibujado.
          </p>
        </div>

        <nav aria-label="Secciones">
          <h3 className="font-serif text-lg">Secciones</h3>
          <ul className="mt-4 space-y-2 text-sm text-crema/80">
            <li><Link className="transition-colors hover:text-turquesa" to="/comic">El cómic</Link></li>
            <li><Link className="transition-colors hover:text-turquesa" to="/revista">Revista</Link></li>
            <li><Link className="transition-colors hover:text-turquesa" to="/nosotros">Nosotros</Link></li>
            <li><Link className="transition-colors hover:text-turquesa" to="/proceso">Proceso creativo</Link></li>
            <li><Link className="transition-colors hover:text-turquesa" to="/contacto">Contacto</Link></li>
          </ul>
        </nav>

        <nav aria-label="Proyecto transmedia">
          <h3 className="font-serif text-lg">El proyecto</h3>
          <ul className="mt-4 space-y-2 text-sm text-crema/80">
            <li>
              <Link className="transition-colors hover:text-turquesa" to="/comic/experiencia">
                Cómic interactivo
              </Link>
            </li>
            <li>
              <a className="transition-colors hover:text-turquesa" href={MARCA.revistaUrl} target="_blank" rel="noreferrer">
                Revista digital ↗
              </a>
            </li>
            <li>
              <a className="transition-colors hover:text-turquesa" href={asset("/docs/manual-de-marca.pdf")} target="_blank" rel="noreferrer">
                Manual de marca (PDF)
              </a>
            </li>
            <li>
              <a className="transition-colors hover:text-turquesa" href={asset("/docs/pitchbook.pdf")} target="_blank" rel="noreferrer">
                PitchBook (PDF)
              </a>
            </li>
          </ul>
        </nav>

        <div>
          <h3 className="font-serif text-lg">El espiral sigue</h3>
          <p className="mt-4 text-sm leading-relaxed text-crema/75">
            SonArte nace del cruce entre la ilustración y la música tropical: un espiral que crece,
            gira y vuelve siempre a su raíz.
          </p>
          <a
            href={`mailto:${CONTACTO.correo}`}
            className="mt-4 inline-block break-all text-sm font-semibold text-turquesa transition-colors hover:text-crema"
          >
            {CONTACTO.correo}
          </a>
        </div>
      </div>

      {/* En móvil se reserva altura para que la burbuja de contacto no tape el aviso. */}
      <div className="border-t border-crema/15 pt-5 pb-24 text-center text-xs tracking-[0.2em] text-crema/60 uppercase md:pb-5">
        SonArte · Proyecto transmedia · {new Date().getFullYear()}
      </div>
    </footer>
  );
}
