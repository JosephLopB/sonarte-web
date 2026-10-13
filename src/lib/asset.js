// Prefija las rutas de archivos públicos con el base de Vite
// (por ejemplo "/sonarte-web/" en GitHub Pages) para que carguen
// igual en local (base "/") y en producción.
export function asset(ruta) {
  if (typeof ruta !== "string" || !ruta.startsWith("/")) return ruta;
  const base = import.meta.env.BASE_URL.replace(/\/+$/, "");
  return `${base}${ruta}`;
}
