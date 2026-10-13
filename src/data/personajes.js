/** Los tres Joes del cómic, con notas de la ficha de personaje (Información personajes.docx). */

export const PERSONAJES = [
  {
    src: "/img/joe-nino.png",
    nombre: "Joe niño",
    edad: "10 años",
    nota: "Hiperactivo, amable y valiente. Sueña con cantar en un escenario.",
    pose: "El niño del barrio: sentado con una lata en la cabeza y un cuaderno, escondiendo un secreto.",
  },
  {
    src: "/img/joe-joven.png",
    nombre: "Joe joven",
    edad: "15 – 20 años",
    nota: "Soñador y decidido, con el deseo de salir adelante con la música.",
    pose: "El grito que se abre paso: la voz que ya no cabe en la calle.",
  },
  {
    src: "/img/joe-adulto.png",
    nombre: "Joe en su auge",
    edad: "30 – 40 años",
    nota: "Apasionado, carismático y creativo. La salsa hecha voz.",
    pose: "El sudor del carnaval: brazos arriba, cabeza atrás, entrega absoluta.",
  },
];

/** Notas del proceso de diseño de personajes (ficha del docx). */
export const PROCESO_PERSONAJE = {
  deseo: "Salir adelante a través de su talento: la voz como tesoro para abrirse camino desde el barrio Nariño.",
  necesidad:
    "Reconocer que su voz no es solo escape o éxito personal, sino un instrumento para contar la historia de su pueblo y darle voz a quienes no la tienen.",
  herida:
    "Crecer entre lo \"sagrado\" (el coro de la iglesia) y lo \"prohibido\" (los burdeles de Tesca), sin sentirse aceptado en ningún mundo. Su mayor miedo: perder la voz y ser olvidado.",
  secreto:
    "Su voz era también un grito de dolor heredado de la historia afrocolombiana: cantaba para sobrevivir y para liberar a los suyos.",
  simbolo: "Un micrófono transformado en látigo roto: la herramienta de opresión convertida en voz y orgullo.",
  arco: [
    {
      etapa: "Inocencia y descubrimiento",
      texto: "La voz surge como tesoro en calles, baños y coros. Aún no comprende la magnitud de su don.",
    },
    {
      etapa: "Identidad y resistencia",
      texto: "Con Fruko siente que no basta con interpretar: nace la necesidad de crear algo propio, el Joesón.",
    },
    {
      etapa: "Consagración",
      texto: "En «La Rebelión» pasa de intérprete individual a voz colectiva y símbolo de resistencia afrocolombiana.",
    },
    {
      etapa: "Legado e inmortalidad",
      texto: "El cuerpo enferma, pero el espíritu —el Centurión— lo trasciende y lo convierte en leyenda.",
    },
  ],
  emociones: ["Alegría", "Tristeza", "Furia", "Miedo", "Sorpresa", "Melancolía"],
};
