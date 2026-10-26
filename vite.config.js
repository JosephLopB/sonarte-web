import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import { existsSync, readFileSync, writeFileSync } from "node:fs";

// GitHub Pages no tiene enrutamiento SPA: cualquier ruta profunda
// (/sonarte-web/comic) devolvería 404. Con 404.html = index.html el
// navegador carga la app igual y React Router resuelve la ruta.
const fallbackSpa = {
  name: "fallback-spa-404",
  apply: "build",
  closeBundle() {
    const outDir = path.resolve(import.meta.dirname, "dist");
    const indice = path.join(outDir, "index.html");
    // En algunas versiones de Vite el hook puede ejecutarse antes de que
    // termine de escribirse el HTML. Si aún no existe, no hay nada que copiar.
    if (!existsSync(indice)) return;
    writeFileSync(path.join(outDir, "404.html"), readFileSync(indice, "utf8"));
  },
};

export default defineConfig({
  base: "/sonarte-web/",
  plugins: [react(), tailwindcss(), fallbackSpa],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
    },
  },
});
