/**
 * Escenarios del cómic ilustrados por SonArte (fuentes en /public/escenarios).
 *
 * Los cinco archivos del carrusel están guardados ya en su orientación correcta,
 * así que la web los pinta tal cual, sin volteos verticales.
 * Ojo con esc-bano.jpg: es la versión corregida (equivale a esc-bano-corrected.jpg
 * del proyecto del cómic); el asset original servido por el cómic publicado está
 * boca abajo, por lo que si algún día se reemplaza el archivo hay que revisarlo.
 */

export const ESCENARIOS = [
  {
    src: "/escenarios/esc-teatro.jpg",
    titulo: "El telón",
    texto: "El escenario vacío antes del primer aplauso.",
  },
  {
    src: "/escenarios/esc-concierto.jpg",
    titulo: "La multitud",
    texto: "Manos arriba: el son ya no le pertenece a uno solo.",
  },
  {
    src: "/escenarios/esc-calle.jpg",
    titulo: "Calle de Cartagena",
    texto: "Balcones de madera y faroles: la noche caribeña que lo vio crecer.",
  },
  {
    src: "/escenarios/esc-parque.jpg",
    titulo: "El parque",
    texto: "Un monumento, una canción escrita y el atardecer sobre la bahía.",
  },
  {
    src: "/escenarios/esc-bano.jpg",
    titulo: "Ensayo en casa",
    texto: "Donde el eco de las paredes fue su primer público.",
  },
];
