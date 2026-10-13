import { Link } from "react-router-dom";
import { Espiral } from "./Espirales.jsx";
import { MARCA } from "../data/marca.js";

export function SiteFooter() {
  return (
    <footer className="superficie-profunda text-crema">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <Espiral className="size-9 text-turquesa anim-girar-lento" />
            <span className="font-marca text-3xl">SonArte</span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-crema/75">
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
              <a className="transition-colors hover:text-turquesa" href={MARCA.comicUrl} target="_blank" rel="noreferrer">
                Cómic interactivo ↗
              </a>
            </li>
            <li>
              <a className="transition-colors hover:text-turquesa" href={MARCA.revistaUrl} target="_blank" rel="noreferrer">
                Revista digital ↗
              </a>
            </li>
            <li>
              <a className="transition-colors hover:text-turquesa" href="/docs/manual-de-marca.pdf" target="_blank" rel="noreferrer">
                Manual de marca (PDF)
              </a>
            </li>
            <li>
              <a className="transition-colors hover:text-turquesa" href="/docs/pitchbook.pdf" target="_blank" rel="noreferrer">
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
        </div>
      </div>

      <div className="border-t border-crema/15 py-5 text-center text-xs tracking-[0.2em] text-crema/60 uppercase">
        SonArte · Proyecto transmedia · {new Date().getFullYear()}
      </div>
    </footer>
  );
}
