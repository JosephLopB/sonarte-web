import {
  BookOpen,
  Bus,
  Cylinder,
  Drama,
  Flame,
  Map,
  MapPin,
  Mic,
  Moon,
  Music,
  Music2,
  PaintBucket,
  Radio,
  ScrollText,
  Signpost,
  SlidersHorizontal,
  Sparkles,
  Trophy,
} from "lucide-react";
import { GRUPOS } from "./comicExperiencia.js";

/**
 * Paradas del modo exploración.
 *
 * Todas las imágenes y videos salen de las escenas reales del cómic
 * (`public/comic/escenas`). No se usa ninguna de las ilustraciones
 * generadas para comic-centurión ni sus fondos `esc-*.jpg`.
 *
 * Cada punto interactivo enlaza con un extra que ya existe en
 * `comicExperiencia.js`, para no duplicar el guion ni la investigación.
 */
export const PARADAS = [
  {
    id: "prologo",
    grupoId: "prologo",
    capitulo: 0,
    titulo: "El escenario vacío",
    epoca: "Antes de la primera palabra",
    modo: "exploracion",
    fondo: {
      tipo: "imagen",
      src: "/comic/escenas/00-prologo/img/Fondo.png",
      alt: "Telón rojo y escenario vacío del prólogo, iluminado por un foco central.",
    },
    pista: "El telón está cerrado, pero algo respira detrás. Recorre la escena con la luz y toca los puntos que brillan.",
    hotspots: [
      {
        id: "prologo-sombra",
        extraId: "centurion",
        x: 50,
        y: 46,
        icono: Drama,
        etiqueta: "El Centurión",
      },
      {
        id: "prologo-cancion",
        extraId: "rebelion-prologo",
        x: 73,
        y: 64,
        icono: Music,
        etiqueta: "La Rebelión",
      },
    ],
  },
  {
    id: "barrio",
    grupoId: "barrio",
    capitulo: 1,
    titulo: "El barrio Nariño",
    epoca: "Cartagena, 1962 · La calle",
    modo: "exploracion",
    fondo: {
      tipo: "video",
      src: "/comic/escenas/01-barrio/barrio.mp4",
      tiempo: 11.2,
      alt: "Calle del barrio Nariño con casas de colores, vecinos y Joe caminando.",
    },
    pista: "La calle entera es un escenario. La chispa del Centurión se detiene donde hay memoria.",
    hotspots: [
      {
        id: "barrio-lata",
        extraId: "lata-agua",
        x: 16,
        y: 64,
        icono: PaintBucket,
        etiqueta: "La lata de agua",
      },
      {
        id: "barrio-nino",
        extraId: "nino-joe",
        x: 58,
        y: 62,
        icono: Mic,
        etiqueta: "El niño que canta",
      },
    ],
  },
  {
    id: "laboratorio",
    grupoId: "laboratorio",
    capitulo: 1,
    titulo: "El laboratorio secreto",
    epoca: "Detrás de la casa · Un escondite",
    modo: "exploracion",
    fondo: {
      tipo: "video",
      src: "/comic/escenas/02-laboratorio/laboratorio.mp4",
      tiempo: 4,
      alt: "Cuarto interior con Joe pequeño cantando frente a una puerta y una lata de manteca.",
    },
    pista: "Aquí el sonido rebota distinto. Busca la lata y la sombra que aparece cuando nadie mira.",
    hotspots: [
      {
        id: "laboratorio-lata",
        extraId: "lata-manteca",
        x: 49,
        y: 54,
        icono: Cylinder,
        etiqueta: "La lata de manteca",
      },
      {
        id: "laboratorio-sombra",
        extraId: "sombra-aparece",
        x: 82,
        y: 29,
        icono: Moon,
        etiqueta: "La primera sombra",
      },
    ],
  },
  {
    id: "encrucijada",
    grupoId: "encrucijada",
    capitulo: 1,
    titulo: "La encrucijada",
    epoca: "1970 · Joe adolescente",
    modo: "dividido",
    paneles: [
      {
        id: "seminario",
        titulo: "El coro del Seminario",
        nota: "La voz que aprende disciplina.",
        fondo: {
          tipo: "video",
          src: "/comic/escenas/03-encrucijada/seminario.mp4",
          tiempo: 3,
          alt: "Joe adolescente con un libro, frente al coro del Seminario.",
        },
      },
      {
        id: "tesca",
        titulo: "El bar de Tesca",
        nota: "La voz que aprende calle.",
        fondo: {
          tipo: "video",
          src: "/comic/escenas/03-encrucijada/bartesca.mp4",
          tiempo: 3,
          alt: "Joe adolescente cantando frente a una pared de ladrillo en el bar de Tesca.",
        },
      },
    ],
    fusion: {
      titulo: "Una sola voz, dos mundos",
      texto:
        "Joe no elige entre lo sagrado y lo popular: aprende a cantar en los dos registros y se lleva ambos al escenario.",
      extras: ["dos-mundos", "seminario-tesca"],
    },
    pista: "Elige un lado. Cuando hayas visto los dos, la escena se une.",
  },
  {
    id: "radio-bus",
    grupoId: "radio-bus",
    capitulo: 1,
    titulo: "Radio Vigía y el bus",
    epoca: "Cartagena → Barranquilla",
    modo: "doble",
    paneles: [
      {
        id: "radio",
        titulo: "Radio Vigía",
        nota: "La voz que sale al aire.",
        fondo: {
          tipo: "video",
          src: "/comic/escenas/04-radio-bus/radio vigia.mp4",
          tiempo: 4,
          alt: "Joe adulto frente a los micrófonos y equipos de Radio Vigía.",
        },
        hotspots: [
          {
            id: "radio-capullito",
            extraId: "capullito",
            x: 22,
            y: 55,
            icono: Radio,
            etiqueta: "«Capullito»",
          },
          {
            id: "radio-villanueva",
            extraId: "manuel-villanueva",
            x: 76,
            y: 58,
            icono: Music2,
            etiqueta: "Manuel Villanueva",
          },
        ],
      },
      {
        id: "bus",
        titulo: "El bus a Barranquilla",
        nota: "La voz que cambia de ciudad.",
        fondo: {
          tipo: "video",
          src: "/comic/escenas/04-radio-bus/Bus.mp4",
          tiempo: 5,
          alt: "Joe y su familia frente al bus azul que sale de Cartagena.",
        },
        hotspots: [
          {
            id: "bus-barranquilla",
            extraId: "bus-barranquilla",
            x: 55,
            y: 60,
            icono: Bus,
            etiqueta: "Un bus, dos ciudades",
          },
        ],
      },
    ],
  },
  {
    id: "fruko-verdad",
    grupoId: "fruko-verdad",
    capitulo: 2,
    titulo: "Fruko y La Verdad",
    epoca: "Barranquilla, 1971 — 1981",
    modo: "doble",
    paneles: [
      {
        id: "fruko",
        titulo: "Fruko y sus Tesos",
        nota: "La fiesta de otros.",
        fondo: {
          tipo: "video",
          src: "/comic/escenas/05-fruko-verdad/Escenario1.mp4",
          tiempo: 3,
          alt: "Joe cantando en una tarima con la orquesta de Fruko.",
        },
        hotspots: [
          {
            id: "fruko-tania",
            extraId: "tania",
            x: 23,
            y: 36,
            icono: Sparkles,
            etiqueta: "«Tania»",
          },
          {
            id: "fruko-preso",
            extraId: "el-preso",
            x: 72,
            y: 38,
            icono: Sparkles,
            etiqueta: "«El Preso»",
          },
          {
            id: "fruko-verdad",
            extraId: "la-verdad",
            x: 50,
            y: 66,
            icono: Music,
            etiqueta: "La Verdad",
          },
        ],
      },
      {
        id: "patio",
        titulo: "El patio de La Verdad",
        nota: "El sonido propio.",
        fondo: {
          tipo: "video",
          src: "/comic/escenas/05-fruko-verdad/Escenario2.mp4",
          tiempo: 3,
          alt: "Joe en un patio barranquillero con plantas y columnas amarillas.",
        },
        hotspots: [
          {
            id: "patio-mezcla",
            extraId: "mezcla-joeson",
            x: 52,
            y: 56,
            icono: SlidersHorizontal,
            etiqueta: "Arma el Joesón",
          },
          {
            id: "patio-1600",
            extraId: "cartagena-1600",
            x: 80,
            y: 34,
            icono: BookOpen,
            etiqueta: "Cartagena, 1600",
          },
        ],
      },
    ],
  },
  {
    id: "hospital-mundo",
    grupoId: "hospital-mundo",
    capitulo: 2,
    titulo: "El silencio y el regreso",
    epoca: "1983 — 1991",
    modo: "pausa",
    pausa: 5,
    fondo: {
      tipo: "imagen",
      src: "/comic/escenas/06-hospital-mundo/hospital.jpg",
      alt: "Joe en una cama de hospital, de noche, con la ciudad al fondo.",
    },
    pista: "Antes de tocar nada, quédate un momento en silencio. Después, la escena se abre.",
    hotspots: [
      {
        id: "hospital-congo",
        extraId: "congo-oro",
        x: 23,
        y: 56,
        icono: Trophy,
        etiqueta: "El Congo de Oro",
      },
      {
        id: "hospital-constitucion",
        extraId: "constitucion-1991",
        x: 55,
        y: 22,
        icono: ScrollText,
        etiqueta: "1991",
      },
      {
        id: "hospital-mapa",
        extraId: "mapa-giras",
        x: 82,
        y: 30,
        icono: Map,
        etiqueta: "El mapa del mundo",
      },
      {
        id: "hospital-nueva-york",
        extraId: "nueva-york-extra",
        x: 68,
        y: 64,
        icono: MapPin,
        etiqueta: "Nueva York",
      },
    ],
  },
  {
    id: "estatua",
    grupoId: "estatua",
    capitulo: 3,
    titulo: "El Parque de los Músicos",
    epoca: "Hoy · El legado",
    modo: "exploracion",
    fondo: {
      tipo: "imagen",
      src: "/comic/escenas/07-estatua/estatua.svg",
      alt: "Estatua de Joe Arroyo en el Parque de los Músicos, entre árboles y montañas.",
    },
    pista: "El recorrido termina en el parque. La estatua guarda un cofre y una última canción.",
    hotspots: [
      {
        id: "estatua-cofre",
        extraId: "cofre-legado",
        x: 52,
        y: 32,
        icono: Trophy,
        etiqueta: "El cofre del legado",
      },
      {
        id: "estatua-parque",
        extraId: "estatua-parque",
        x: 70,
        y: 62,
        icono: Signpost,
        etiqueta: "El parque",
      },
      {
        id: "estatua-cancion",
        extraId: "rebelion-final",
        x: 28,
        y: 72,
        icono: Music,
        etiqueta: "«La Rebelión»",
      },
      {
        id: "estatua-26-julio",
        extraId: "26-julio",
        x: 48,
        y: 80,
        icono: Flame,
        etiqueta: "26 de julio",
      },
    ],
  },
];

export function paradaPorId(id) {
  return PARADAS.find((p) => p.id === id);
}

export function grupoDeParada(parada) {
  return GRUPOS.find((g) => g.id === parada.grupoId);
}

export function extraDeParada(parada, extraId) {
  const grupo = grupoDeParada(parada);
  return grupo?.extras?.find((e) => e.id === extraId) ?? null;
}

/** Todos los extras que se pueden descubrir en una parada. */
export function extrasDeParada(parada) {
  const ids = new Set();
  if (parada.fusion) parada.fusion.extras.forEach((id) => ids.add(id));
  parada.hotspots?.forEach((h) => ids.add(h.extraId));
  parada.paneles?.forEach((panel) => panel.hotspots?.forEach((h) => ids.add(h.extraId)));
  return [...ids].map((id) => extraDeParada(parada, id)).filter(Boolean);
}
