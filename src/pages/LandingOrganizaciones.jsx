import LandingEncuesta from "./LandingEncuesta.jsx";

const config = {
  id: "organizaciones",
  origen: "landing_organizaciones",
  tema: "claro",
  etiqueta: "educación · cultura · editorial",
  preTitulo: "Para instituciones educativas, centros y editoriales",
  titulo: "La cultura también puede abrirse camino en nuevas pantallas.",
  intro:
    "SonArte convierte la memoria musical del Caribe en una experiencia editorial transmedia. Explora el cómic y dinos qué lugar podría tener en tu aula, centro, catálogo o comunidad.",
  role: "Institución educativa · Editorial · Centro",
  perfil:
    "Equipos que acercan al público historias, patrimonio, educación y cultura mediante contenidos y experiencias.",
  objetivo:
    "Conectar la memoria musical colombiana con nuevas audiencias a través de narrativas ilustradas y digitales.",
  necesidades: [
    "Contenidos culturales atractivos para estudiantes y públicos diversos.",
    "Recursos que conecten investigación, ilustración, música y lectura.",
    "Propuestas que inspiren nuevas formas de compartir historias locales.",
  ],
  frustraciones: [
    "Innovar en formatos sin perder contexto ni profundidad cultural.",
    "Encontrar relatos colombianos preparados para medios digitales.",
    "Mantener la atención y abrir conversaciones más allá de la pantalla.",
  ],
  comoAyudamos:
    "SonArte acerca el folclore colombiano con una experiencia que combina cómic, sonido, exploración y contexto. La propuesta puede servir como punto de encuentro entre memoria, lectura y conversación cultural.",
  servicios: [
    {
      title: "Una experiencia para explorar",
      text: "El cómic interactivo combina capítulos ilustrados, escenas audiovisuales y sonido.",
    },
    {
      title: "Una historia con contexto",
      text: "La vida y el legado de Joe Arroyo se enlazan con la memoria musical y cultural del Caribe.",
    },
    {
      title: "Un proceso para conocer",
      text: "La revista y los materiales de proceso muestran la investigación y las decisiones visuales detrás del proyecto.",
    },
  ],
  ctaTitle: "¿Qué lugar podría tener SonArte en tu organización?",
  ctaButton: "Valorar la propuesta",
  ctaText: "Tu mirada nos ayuda a comprender su valor educativo, cultural y editorial.",
  preguntas: [
    "proyecto_sentido",
    "proyecto_transmedia",
    "comic_claridad",
    "experiencia_cultural",
  ],
  tituloAbiertas: "Una idea o posibilidad, si quieres compartirla",
};

export default function LandingOrganizaciones() {
  return <LandingEncuesta config={config} />;
}
