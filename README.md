# SonArte — Web transmedia

Web de la marca **SonArte** y carta de presentación del cómic digital interactivo transmedia
«Joe Arroyo: El Centurión de la Noche».

## Stack (herramientas del proceso)

- **React + Vite** (JavaScript) — construcción de la interfaz
- **Tailwind CSS v4** — sistema de diseño con los tokens del Manual de marca
- **GSAP** (+ ScrollTrigger, ScrollToPlugin, TextPlugin) — toda la animación
- **React Router** — navegación entre secciones
- Diseño UI/UX y sistema visual exportado desde **Figma/Illustrator**

## Ejecutar

```sh
npm install
npm run dev      # desarrollo
npm run build    # producción (carpeta dist/)
npm run preview  # previsualizar el build
```

## Estructura

```
public/
  marca/        Isotipo, logo, fondos y recursos gráficos de marca
  img/          Personajes (3 Joes), equipo y logo full
  escenarios/   Los 15 escenarios del cómic
  media/        Huecos para: teaser/, motion/, 3d/, personajes/, paginas/
  docs/         Manual de marca, PitchBook, Book de ilustración, Plan de mercadeo
  fonts/        Muthiara, Akira Expanded, EB Garamond, MyriadPro
src/
  data/         ★ Contenido editable (marca, escenarios, personajes, proceso)
  components/   Nav, footer, fondos, reveals GSAP, placeholders
  pages/        Home, Comic, Nosotros, Revista, Proceso, Contacto
```

## Cómo añadir material nuevo (sin tocar código)

1. **Videos y renders**: copia el archivo a su carpeta en `public/media/` con el nombre
   esperado (p. ej. `public/media/teaser/teaser.mp4`). El placeholder de la web indica el
   nombre exacto en cada hueco.2. **Nueva etapa del proceso**: añade un objeto en `src/data/proceso.js` (se ordena solo en la
   línea de tiempo).
3. **Textos de marca** (misión, visión, valores, equipo): `src/data/marca.js`.

## Enlaces del proyecto

- Cómic interactivo: https://comic-centurion.lovable.app
- Revista digital: https://indd.adobe.com/view/c9583718-0fac-4d40-bb19-a8448eefdf6b
