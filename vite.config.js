import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import { readFileSync, writeFileSync } from "node:fs";

// GitHub Pages no tiene enrutamiento SPA: cualquier ruta profunda
// (/sonarte-web/comic) devolvería 404. Con 404.html = index.html el
// navegador carga la app igual y React Router resuelve la ruta.
const fallbackSpa = {
  name: "fallback-spa-404",
  apply: "build",
  closeBundle() {
    const outDir = path.resolve(import.meta.dirname, "dist");
    writeFileSync(
      path.join(outDir, "404.html"),
      readFileSync(path.join(outDir, "index.html"), "utf8"),
    );
  },
};

// base = ruta donde GitHub Pages sirve el sitio: https://<usuario>.github.io/sonarte-web/
// Si algún día usas dominio propio, cámbialo a "/".
export default defineConfig({
  base: "/sonarte-web/",
  plugins: [react(), tailwindcss(), fallbackSpa],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
    },
  },
});
