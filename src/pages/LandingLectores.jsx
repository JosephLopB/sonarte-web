import LandingEncuesta from "./LandingEncuesta.jsx";

const config = {
  id: "lectores",
  origen: "landing_lectores",
  tema: "oscuro",
  etiqueta: "lectores",
  preTitulo: "Para lectores y lectoras",
  titulo: "El folclore colombiano, contado para ti.",
  intro:
    "Una historia ilustrada sobre Joe Arroyo que se lee, se escucha y se explora. Recorre el cómic y comparte qué te hizo vibrar, pensar o querer seguir leyendo.",
  role: "Lector/a del universo SonArte",
  perfil:
    "Personas curiosas por las historias, la música y las culturas vivas del Caribe colombiano.",
  objetivo:
    "Descubrir la historia y el legado de Joe Arroyo a través de una experiencia digital que une ilustración, sonido y memoria.",
  necesidades: [
    "Historias que acerquen la música y la memoria del Caribe.",
    "Una lectura que combine relato, imagen y sonido.",
    "Un recorrido claro que permita detenerse, explorar y continuar a tu ritmo.",
  ],
  frustraciones: [
    "Encontrar la cultura contada de forma distante o difícil de explorar.",
    "Perder el hilo cuando un formato digital no explica cómo continuar.",
    "Quedarse con ganas de más contexto sobre una escena o una canción.",
  ],
  comoAyudamos:
    "SonArte convierte la memoria musical en un relato ilustrado e interactivo. El cómic recorre la vida de Joe Arroyo con escenas, sonido y ventanas de contexto para que cada lector encuentre su propio ritmo.",
  servicios: [
    {
      title: "Cómic digital interactivo",
      text: "Prólogo y tres capítulos para recorrer la vida y el legado de Joe Arroyo.",
    },
    {
      title: "Escenas que se exploran",
      text: "Ilustración, animación y sonido invitan a mirar con atención y descubrir detalles.",
    },
    {
      title: "Memoria que sigue sonando",
      text: "La experiencia enlaza personajes, momentos y referencias de la cultura musical del Caribe.",
    },
  ],
  ctaTitle: "Tu lectura también hace parte de esta historia",
  ctaButton: "Dejar mi impresión",
  ctaText: "Cuéntanos qué te llegó y qué podemos hacer para que SonArte siga conectando con sus lectores.",
  preguntas: [
    "comic_claridad",
    "comic_enganche",
    "comic_historia_valor",
    "nav_ubicacion",
    "nav_control",
    "acceso_lectura",
    "experiencia_global",
    "experiencia_cultural",
  ],
  tituloAbiertas: "Lo que quieras contarnos",
};

export default function LandingLectores() {
  return <LandingEncuesta config={config} />;
}
