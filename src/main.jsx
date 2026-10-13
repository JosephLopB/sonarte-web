import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

// El sitio puede servirse en una subcarpeta (GitHub Pages: /sonarte-web/),
// así que el router debe conocer el base para que las rutas sigan igual.
const base = import.meta.env.BASE_URL.replace(/\/+$/, "");

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter basename={base}>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
