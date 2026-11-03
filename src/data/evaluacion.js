/**
 * Encuesta de evaluación del cómic SonArte.
 *
 * Ejes de proyecto, historia y experiencia (escala 1–5), el cuestionario SUS
 * completo para comparar usabilidad, tres preguntas abiertas y datos de perfil
 * de perfil. Cada ítem trae el nombre de su columna para que la respuesta se
 * abra legible en Excel.
 */

/** Destino del envío. Pega aquí la URL /exec de tu aplicación web de Apps Script. */
export const ENVIO = {
  endpoint: "https://script.google.com/macros/s/AKfycbyDL6S15ui2XocW3FScqeEITIQKfiRljAza6SdVMK2DbqzyFmJ-W6CUTDToOMQbefEJtg/exec",
};

const ESCALA_NOMBRES = ["Nada", "Poco", "A medias", "Bastante", "Del todo"];

export const ESCALA = [1, 2, 3, 4, 5].map((valor) => ({
  valor,
  nombre: ESCALA_NOMBRES[valor - 1],
}));

export const PERFIL = [
  {
    id: "segmento",
    columna: "Perfil · segmento",
    pregunta: "¿Desde qué lugar te acercas a SonArte?",
    opciones: ["Institución educativa", "Editorial", "Lector/a", "Otro"],
  },
  {
    id: "dispositivo",
    columna: "Dispositivo",
    pregunta: "¿Desde dónde lo viste?",
    opciones: ["Celular", "Computador", "Tableta"],
  },
  {
    id: "primeraVez",
    columna: "Primera vez",
    pregunta: "¿Era tu primera vez con este cómic?",
    opciones: ["Sí, primera vez", "No, ya lo había visto"],
  },
];

export const EJES = [
  {
    id: "marca",
    numero: "01",
    titulo: "La marca",
    resumen: "Si lo que se ve se siente SonArte y no un sitio cualquiera.",
    items: [
      {
        id: "marca_identidad",
        columna: "Marca · identidad",
        texto: "Los colores, las letras y los detalles se sienten parte de una misma identidad.",
      },
      {
        id: "marca_recuerdo",
        columna: "Marca · recuerdo",
        texto: "Mañana podría describirle el estilo de SonArte a otra persona.",
      },
    ],
  },
  {
    id: "proyecto",
    numero: "02",
    titulo: "El proyecto",
    resumen: "Si se entiende qué es SonArte y hacia dónde va.",
    items: [
      {
        id: "proyecto_sentido",
        columna: "Proyecto · qué es SonArte",
        texto: "Entendí qué hace SonArte sin que nadie me lo explicara antes.",
      },
      {
        id: "proyecto_transmedia",
        columna: "Proyecto · transmedia",
        texto: "Se nota que el cómic, la revista y la web son parte del mismo universo.",
      },
    ],
  },
  {
    id: "comic",
    numero: "03",
    titulo: "El cómic",
    resumen: "Si la historia se sostiene sola y dan ganas de seguir.",
    items: [
      {
        id: "comic_claridad",
        columna: "Cómic · claridad",
        texto: "Entendí la historia sin abrir el panel de guion.",
      },
      {
        id: "comic_enganche",
        columna: "Cómic · enganche",
        texto: "Cada escena me dejó con ganas de ver la siguiente.",
      },
      {
        id: "comic_historia_valor",
        columna: "Cómic · valoración de la historia",
        texto: "Del 1 al 5, ¿qué tan bien contada te pareció la historia de Joe?",
      },
    ],
  },
  {
    id: "navegacion",
    numero: "04",
    titulo: "La navegación",
    resumen: "Si se puede entrar, recorrer y salir sin perderse.",
    items: [
      {
        id: "nav_ubicacion",
        columna: "Navegación · ubicación",
        texto: "Supe siempre en qué parte del recorrido estaba.",
      },
      {
        id: "nav_control",
        columna: "Navegación · control",
        texto: "Volver, saltar o salir de una escena me resultó fácil.",
      },
    ],
  },
  {
    id: "acceso",
    numero: "05",
    titulo: "La pantalla",
    resumen: "Si funciona en el dispositivo y el cuerpo con que se abrió.",
    items: [
      {
        id: "acceso_dispositivo",
        columna: "Pantalla · dispositivo",
        texto: "Lo disfruté en la pantalla donde lo abrí, sin pelearme con ella.",
      },
      {
        id: "acceso_lectura",
        columna: "Pantalla · lectura",
        texto: "Los textos y los controles se leían y se tocaban sin esfuerzo.",
      },
    ],
  },
  {
    id: "experiencia",
    numero: "06",
    titulo: "La experiencia completa",
    resumen: "Valor general de la lectura y su aporte cultural.",
    items: [
      {
        id: "experiencia_global",
        columna: "Experiencia · valoración general",
        texto: "Del 1 al 5, ¿qué tan satisfactoria fue tu experiencia completa con el cómic?",
      },
      {
        id: "experiencia_cultural",
        columna: "Experiencia · valor cultural",
        texto: "¿Qué tanto valor le ves al cómic para compartir la música y la memoria del Caribe?",
      },
    ],
  },
];

/**
 * System Usability Scale completa. Los ítems impares son afirmaciones positivas
 * y los pares negativas; alternarlas es lo que evita respuestas en piloto
 * automático.
 */
export const SUS = [
  { id: "sus_01", columna: "SUS 01 · volvería a usarlo", texto: "Creo que me gustaría volver a esta experiencia con frecuencia." },
  { id: "sus_02", columna: "SUS 02 · innecesariamente compleja", texto: "La encontré innecesariamente complicada." },
  { id: "sus_03", columna: "SUS 03 · fácil de usar", texto: "Me pareció fácil de usar." },
  { id: "sus_04", columna: "SUS 04 · necesitaría ayuda", texto: "Creo que necesitaría ayuda de alguien para poder usarla." },
  { id: "sus_05", columna: "SUS 05 · partes integradas", texto: "Sentí que sus partes estaban bien integradas." },
  { id: "sus_06", columna: "SUS 06 · inconsistencias", texto: "Noté demasiadas inconsistencias en la experiencia." },
  { id: "sus_07", columna: "SUS 07 · se aprende rápido", texto: "Imagino que la mayoría de la gente la aprendería muy rápido." },
  { id: "sus_08", columna: "SUS 08 · incómoda", texto: "La encontré muy incómoda de usar." },
  { id: "sus_09", columna: "SUS 09 · confianza", texto: "Me sentí con confianza mientras la usaba." },
  { id: "sus_10", columna: "SUS 10 · mucho que aprender", texto: "Necesité aprender muchas cosas antes de poder avanzar." },
];

export const ABIERTAS = [
  {
    id: "abierta_gusto",
    columna: "Abierta · qué gustó",
    pregunta: "¿Qué momento te gustó o te sorprendió más?",
    pista: "Una escena, un sonido, un detalle que se te quedó…",
  },
  {
    id: "abierta_dificil",
    columna: "Abierta · qué costó",
    pregunta: "¿Qué parte te costó o te confundió?",
    pista: "Algo que no sabías que podías tocar, un texto que no se leía…",
  },
  {
    id: "abierta_mejora",
    columna: "Abierta · qué sumar",
    pregunta: "¿Qué le sumarías o le quitarías?",
    pista: "Un botón, un silencio, otra escena…",
  },
];

/** Preguntas para conocer el potencial del proyecto en sus dos públicos clave. */
export const PREGUNTAS_SEGMENTO = {
  "Institución educativa": {
    id: "educacion",
    titulo: "SonArte en el aula",
    preguntas: [
      {
        id: "edu_ensenaria",
        columna: "Educación · usaría para enseñar",
        pregunta: "¿Enseñarías la vida y el legado de Joe Arroyo con este cómic?",
        opciones: ["Sí", "Tal vez", "No"],
        obligatoria: true,
      },
      {
        id: "edu_valor",
        columna: "Educación · valor pedagógico",
        pregunta: "¿Qué tan valioso te parece como recurso para acercar al estudiantado a la música y la cultura del Caribe?",
        tipo: "escala",
        obligatoria: true,
      },
      {
        id: "edu_contexto",
        columna: "Educación · espacio de uso",
        pregunta: "¿En qué nivel, materia o actividad lo usarías?",
        pista: "Por ejemplo: primaria, secundaria, música, historia o lectura…",
      },
    ],
  },
  Editorial: {
    id: "editorial",
    titulo: "SonArte como propuesta editorial",
    preguntas: [
      {
        id: "ed_interes",
        columna: "Editorial · interés en colaborar",
        pregunta: "¿Te interesaría explorar o desarrollar una publicación con SonArte?",
        opciones: ["Sí", "Tal vez", "No"],
        obligatoria: true,
      },
      {
        id: "ed_valor",
        columna: "Editorial · atractivo del formato",
        pregunta: "¿Qué tan atractiva te parece la propuesta de contar historias en un cómic digital transmedia?",
        tipo: "escala",
        obligatoria: true,
      },
      {
        id: "ed_historia",
        columna: "Editorial · historia de interés",
        pregunta: "¿Qué historia contarías con SonArte?",
        pista: "Puede ser una persona, una música, una memoria o una historia de tu comunidad…",
      },
    ],
  },
};

export const ejePorId = (id) => EJES.find((eje) => eje.id === id) ?? null;

export const itemsDeEje = (id) => ejePorId(id)?.items ?? [];

/**
 * Pausas dentro del cómic. Cada vez que se cierra un capítulo se pregunta por un
 * eje, justo cuando la impresión está fresca; no en mitad de una escena. El
 * cierre del último capítulo pide el resto.
 */
export const PAUSAS = [
  {
    capitulo: 0,
    eje: "proyecto",
    rotulo: "Prólogo cerrado",
    titulo: "La propuesta",
    entrada: "¿Qué tan clara y atractiva te resultó la idea de SonArte?",
  },
  {
    capitulo: 1,
    eje: "comic",
    rotulo: "Capítulo I cerrado",
    titulo: "La historia",
    entrada: "Cuéntanos cómo te llegó la historia y el legado de Joe.",
  },
  {
    capitulo: 2,
    eje: "navegacion",
    rotulo: "Capítulo II cerrado",
    titulo: "La experiencia",
    entrada: "Dos preguntas breves sobre el recorrido y su lectura.",
  },
  {
    capitulo: 3,
    eje: "experiencia",
    rotulo: "Capítulo III cerrado",
    titulo: "El formato",
    entrada: "Una última mirada a la lectura completa y al valor de lo que cuenta.",
  },
];

export const pausaDeCapitulo = (capitulo) =>
  PAUSAS.find((pausa) => pausa.capitulo === capitulo) ?? null;

/** Ejes que se preguntan al final, cuando ya se recorrió todo. */
export const EJES_CIERRE = EJES.map((eje) => eje.id);

export const ITEMS_CIERRE = EJES_CIERRE.flatMap((id) => itemsDeEje(id));

/** Total de respuestas obligatorias, para la barra de avance. */
export const TOTAL_OBLIGATORIAS =
  PERFIL.length + EJES.reduce((n, eje) => n + eje.items.length, 0);

export const idsSegmentoObligatorios = (segmento) =>
  (PREGUNTAS_SEGMENTO[segmento]?.preguntas ?? [])
    .filter((pregunta) => pregunta.obligatoria)
    .map((pregunta) => pregunta.id);
