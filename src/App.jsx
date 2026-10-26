import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { SiteNav } from "./components/SiteNav.jsx";
import { SiteFooter } from "./components/SiteFooter.jsx";
import { BotonContacto } from "./components/BotonContacto.jsx";
import Home from "./pages/Home.jsx";
import Comic from "./pages/Comic.jsx";
import Nosotros from "./pages/Nosotros.jsx";
import Revista from "./pages/Revista.jsx";
import Proceso from "./pages/Proceso.jsx";
import Contacto from "./pages/Contacto.jsx";
import ComicExperiencia from "./pages/ComicExperiencia.jsx";
import ExploracionComic from "./pages/ExploracionComic.jsx";

function ScrollArriba() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

export default function App() {
  const { pathname } = useLocation();
  // La experiencia del cómic ocupa la pantalla completa: sin nav, burbuja ni footer.
  const esExperiencia = pathname.startsWith("/comic/experiencia");

  return (
    <div className={esExperiencia ? "" : "min-h-screen"}>
      <ScrollArriba />
      {!esExperiencia && <SiteNav />}
      {!esExperiencia && <BotonContacto />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/comic" element={<Comic />} />
          <Route path="/comic/experiencia" element={<ComicExperiencia />} />
          <Route path="/comic/experiencia/explorar" element={<ExploracionComic />} />
          <Route path="/comic/experiencia/:escenaId" element={<ComicExperiencia />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/revista" element={<Revista />} />
          <Route path="/proceso" element={<Proceso />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      {!esExperiencia && <SiteFooter />}
    </div>
  );
}
