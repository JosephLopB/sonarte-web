/**
 * Proceso creativo del proyecto transmedia, para la línea de tiempo de /proceso.
 * Cada etapa puede tener imágenes reales o un hueco pendiente (media pendiente de exportar).
 */

export const ETAPAS = [
  {
    id: "investigacion",
    numero: "01",
    titulo: "Investigación",
    herramienta: "Recopilación documental",
    texto:
      "Todo nace de la memoria musical del Caribe: biografías, entrevistas y archivos sobre Joe Arroyo y maestros como Manuel Villanueva. La investigación define el tono histórico del cómic —del barrio Nariño de 1962 al legado de 2011— y alimenta la revista.",
    imagenes: [],
    hueco: "Aquí van capturas del proceso de investigación (archivo, referencias, línea de tiempo histórica).",
  },
  {
    id: "guion",
    numero: "02",
    titulo: "Guion y narrativa",
    herramienta: "Estructura narrativa transmedia",
    texto:
      "El guion se escribe en tres capítulos y prólogo, con el Centurión como narrador espectral. Se definen las escenas explorables, las pausas narrativas y los puntos transmedia: audio, contexto histórico y archivo audiovisual.",
    imagenes: [],
    hueco: "Aquí va el tratamiento del guion, esquema de capítulos y storyboard.",
  },
  {
    id: "personajes",
    numero: "03",
    titulo: "Diseño de personajes",
    herramienta: "Illustrator · Proceso de ficha de personaje",
    texto:
      "Cada personaje nace en ficha: deseo, necesidad, herida y secreto. Joe se dibuja en tres edades con vestuario y lenguaje corporal propios, y se explora su rango emocional en la hoja de emociones antes de llegar a la versión final.",
    imagenes: ["/img/joe-nino.png", "/img/joe-joven.png", "/img/joe-adulto.png"],
    hueco: null,
  },
  {
    id: "escenarios",
    numero: "04",
    titulo: "Escenarios",
    herramienta: "Illustrator · Ilustración vectorial",
    texto:
      "Quince escenarios ilustrados llevan la historia del teatro vacío a la lluvia del 26 de julio: calle, seminario, bar, radio, bus, patio, Cartagena colonial, carnaval y más. El arte vectorial mantiene el color y la luz del Caribe.",
    imagenes: [
      "/escenarios/esc-calle.jpg",
      "/escenarios/esc-patio.jpg",
      "/escenarios/esc-carnaval.jpg",
    ],
    hueco: null,
  },
  {
    id: "marca",
    numero: "05",
    titulo: "Diseño de marca",
    herramienta: "Illustrator · Sistema de identidad",
    texto:
      "El espiral del isotipo condensa la idea de la marca: sonido, ciclos y movimiento. Se construyen el isologo, la paleta cálida del Caribe, las tipografías y las texturas de olas; todo queda sistematizado en el Manual de marca y el PitchBook.",
    imagenes: ["/marca/isotipo.png", "/marca/logo.png"],
    hueco: null,
  },
  {
    id: "motion",
    numero: "06",
    titulo: "Motion graphics",
    herramienta: "After Effects · Premiere",
    texto:
      "El cómic cobra movimiento: animación de viñetas y burbujas, ritmo de edición sincronizado con la música de Joe y piezas de difusión. El teaser resume la promesa de la marca en menos de un minuto.",
    imagenes: [],
    hueco: "Aquí van fotogramas del teaser y del motion graphics del cómic (pendientes de exportar).",
  },
  {
    id: "3d",
    numero: "07",
    titulo: "Personajes en 3D",
    herramienta: "Modelado y render 3D",
    texto:
      "Los personajes se llevan al volumen: modelado, materiales y luces cálidas para renders y turntables que extienden el universo más allá de la ilustración plana.",
    imagenes: [],
    hueco: "Aquí van renders y turntables de los personajes 3D (pendientes de exportar).",
  },
  {
    id: "editorial",
    numero: "08",
    titulo: "Diseño editorial",
    herramienta: "InDesign · Revista digital",
    texto:
      "La revista SonArte reúne la investigación, ilustración y el detrás de cámaras en una publicación digital maquetada y publicada en Adobe, puente entre el archivo musical y la pantalla.",
    imagenes: ["/marca/portada.png"],
    hueco: null,
  },
  {
    id: "web",
    numero: "09",
    titulo: "Diseño de la página",
    herramienta: "Figma · UI/UX · React + Vite",
    texto:
      "El sistema de la marca se traduce a interfaz: arquitectura de información, wireframes, prototipo en Figma y luego la construcción con React, Tailwind y GSAP. Cada sección repite el gesto del espiral: entrada, desarrollo y cierre.",
    imagenes: [],
    hueco: "Aquí van bocetos, wireframes y capturas del prototipo de Figma (pendientes de exportar).",
  },
];
