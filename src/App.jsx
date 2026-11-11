import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
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
import Evaluacion from "./pages/Evaluacion.jsx";
import LandingLectores from "./pages/LandingLectores.jsx";
import LandingOrganizaciones from "./pages/LandingOrganizaciones.jsx";

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
  // Las landings de invitación se comparten por enlace directo y viven fuera
  // de la navegación del sitio.
  const esLanding = ["/lectores", "/organizaciones"].includes(pathname.replace(/\/+$/, ""));
  const sinMarcoSitio = esExperiencia || esLanding;

  return (
    <div className={sinMarcoSitio ? "" : "min-h-screen"}>
      <ScrollArriba />
      {!sinMarcoSitio && <SiteNav />}
      {!sinMarcoSitio && <BotonContacto />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/comic" element={<Comic />} />
          <Route path="/comic/experiencia" element={<ComicExperiencia />} />
          <Route path="/comic/experiencia/explorar" element={<Navigate to="/comic/experiencia" replace />} />
          <Route path="/comic/evaluacion" element={<Evaluacion />} />
          <Route path="/lectores" element={<LandingLectores />} />
          <Route path="/organizaciones" element={<LandingOrganizaciones />} />
          <Route path="/comic/experiencia/:escenaId" element={<ComicExperiencia />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/revista" element={<Revista />} />
          <Route path="/proceso" element={<Proceso />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      {!sinMarcoSitio && <SiteFooter />}
    </div>
  );
}
