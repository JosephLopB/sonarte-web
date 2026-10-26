import { asset } from "../lib/asset.js";
/**
 * Identidad y contenido de la marca SonArte.
 * Textos tomados del Manual de marca, PitchBook y la versión anterior del sitio.
 */

export const MARCA = {
  nombre: "SonArte",
  eslogan: "El folclore colombiano vuelve a sonar, dibujado.",
  intro:
    "SonArte es una editorial web multimedia que revive las raíces del Caribe a través de un cómic digital interactivo transmedia inspirado en la música de Joe Arroyo y los ritmos tropicales. Mezclamos arte, identidad y tecnología para las nuevas generaciones.",
  logo: asset("/img/logo-full.png"),
  isotipo: asset("/marca/isotipo.png"),
  espiral: asset("/marca/espiral-hero.svg"),
  revistaUrl: "https://indd.adobe.com/view/c9583718-0fac-4d40-bb19-a8448eefdf6b",
  comicUrl: "/comic/experiencia",
  mision:
    "Revivir el folclore colombiano a través de un cómic digital interactivo transmedia que acerque a las nuevas generaciones a la música, las historias y la identidad del Caribe.",
  vision:
    "Ser la editorial web multimedia de referencia en la divulgación del patrimonio sonoro colombiano, con un lenguaje visual propio y reconocible.",
};

export const QUE_HACEMOS = [
  {
    icon: "vineta",
    titulo: "Cómic digital interactivo",
    texto:
      "Nuestro proyecto de marca: historias ilustradas con escenarios explorables, sonido y ventanas transmedia.",
  },
  {
    icon: "pulso",
    titulo: "Folclore sonoro",
    texto: "La salsa, la cumbia y el son de Joe Arroyo como columna vertebral narrativa.",
  },
  {
    icon: "pincel",
    titulo: "Ilustración propia",
    texto: "Diseño de personajes, expresiones y escenarios construidos desde cero.",
  },
  {
    icon: "espiral-doble",
    titulo: "Transmedia",
    texto: "Revista, web, motion graphics y cómic conversando entre sí en un mismo universo.",
  },
];

export const VALORES = [
  {
    titulo: "Raíz",
    texto: "Honramos el folclore colombiano como materia viva, no como museo.",
  },
  {
    titulo: "Ritmo",
    texto: "La música tropical marca el pulso de cada historia que ilustramos.",
  },
  {
    titulo: "Creación",
    texto: "El espiral del logo: movimiento, ciclos y evolución constante.",
  },
  {
    titulo: "Cercanía",
    texto: "Hablamos joven, sin diluir la memoria del Caribe.",
  },
];

/**
 * El diseño de cada tarjeta vive en Nosotros.jsx: ambas comparten retícula y
 * tamaños, pero conservan la paleta y la tipografía de cada integrante.
 */
export const EQUIPO = [
  {
    nombre: "Joseph",
    rol: "Dirección de arte e ilustración",
    texto:
      "Construye los personajes, define el trazo y traduce la música en color y movimiento.",
    img: asset("/img/equipo-joseph.jpg"),
  },
  {
    nombre: "Yurani",
    rol: "Narrativa y diseño editorial",
    texto:
      "Investiga el folclore, escribe los guiones y da forma a la revista y a la voz de la marca.",
    img: asset("/img/Yura.png"),
  },
];

export const IDENTIDAD = {
  paleta: [
    { nombre: "Terracota", hex: "#A25637" },
    { nombre: "Marrón", hex: "#552714" },
    { nombre: "Crema", hex: "#FFFDE8" },
    { nombre: "Turquesa claro", hex: "#5ED5B7" },
    { nombre: "Turquesa medio", hex: "#37A2A1" },
    { nombre: "Verde oscuro", hex: "#0C5555" },
    { nombre: "Salmón", hex: "#EF9069" },
    { nombre: "Negro", hex: "#000000" },
  ],
  tipografias: [
    { nombre: "Muthiara", uso: "Firma y detalles expresivos de la marca", clase: "font-marca" },
    { nombre: "Akira Expanded", uso: "Titulares de impacto", clase: "font-impacto" },
    { nombre: "EB Garamond", uso: "Titulares y textos editoriales", clase: "font-serif" },
    { nombre: "MyriadPro", uso: "Cuerpo de texto neutro", clase: "font-neutra" },
  ],
};
