import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { SiteNav } from "./components/SiteNav.jsx";
import { SiteFooter } from "./components/SiteFooter.jsx";
import Home from "./pages/Home.jsx";
import Comic from "./pages/Comic.jsx";
import Nosotros from "./pages/Nosotros.jsx";
import Revista from "./pages/Revista.jsx";
import Proceso from "./pages/Proceso.jsx";
import Contacto from "./pages/Contacto.jsx";

function ScrollArriba() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <div className="min-h-screen">
      <ScrollArriba />
      <SiteNav />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/comic" element={<Comic />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/revista" element={<Revista />} />
          <Route path="/proceso" element={<Proceso />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <SiteFooter />
    </div>
  );
}
