import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

// base = ruta donde GitHub Pages sirve el sitio: https://<usuario>.github.io/sonarte-web/
// Si algún día usas dominio propio, cámbialo a "/".
export default defineConfig({
  base: "/sonarte-web/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
    },
  },
});
