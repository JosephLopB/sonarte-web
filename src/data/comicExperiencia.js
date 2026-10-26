/**
 * Datos de la experiencia del cómic.
 *
 * Cada grupo carga una pieza audiovisual existente (iframe o video) y añade
 * contexto, guion y extras alrededor, sin modificar la escena original.
 * El texto de `guion` sale de Guion_SonArte_JoeArroyo_v3.docx.
 */

export const CAPITULOS = [
  { id: 0, nombre: "Prólogo", titulo: "La sombra que guarda el ritmo" },
  { id: 1, nombre: "Capítulo I", titulo: "La voz del barrio" },
  { id: 2, nombre: "Capítulo II", titulo: "La rebelión del Centurión" },
  { id: 3, nombre: "Capítulo III", titulo: "El legado inmortal" },
];

const L = (voz, texto, acotacion) => ({ voz, texto, ...(acotacion ? { acotacion } : {}) });

export const GRUPOS = [
  /* ------------------------------- PRÓLOGO ------------------------------- */
  {
    id: "prologo",
    capitulo: 0,
    numero: 1,
    titulo: "La sombra que guarda el ritmo",
    epoca: "Prólogo · El escenario vacío",
    resumen:
      "Una silueta guarda el ritmo. El telón se abre sobre Joe cantando «La Rebelión» y, de golpe, todo se congela: hay que volver al principio.",
    tipo: "html",
    ruta: "/comic/escenas/00-prologo/index.html",
    poster: "/escenarios/esc-teatro.jpg",
    duracion: "≈ 1:30",
    guion: [
      {
        id: "pro-1",
        titulo: "Escenario vacío, de noche",
        estado: "escena",
        narracion:
          "Telón cerrado. Un solo foco ilumina el centro del escenario. Ahí, apenas una silueta.",
        lineas: [
          L(
            "El Centurión",
            "Yo soy la sombra que guarda el ritmo. Y esto que estás por ver no es solo una historia... es la anatomía de un trueno.",
            "voz en off, calmado, casi un susurro",
          ),
        ],
        acotacion: "La silueta se disuelve en el fondo del telón. Silencio total. El telón se cierra.",
      },
      {
        id: "pro-2",
        titulo: "El mismo escenario, telón abierto",
        estado: "escena",
        narracion:
          "El telón se abre de golpe. Luz roja, intensa. Joe, 31 años, canta «La Rebelión» con toda su fuerza. A su lado, la sombra del Centurión baila frenética.",
        lineas: [
          L(
            "El Centurión",
            "Esta es la historia de Joe. La de un grito que salió de un barrio y terminó siendo el grito de todo un país.",
            "narración, sobre la música",
          ),
          L(
            "El Centurión",
            "Pero para entender este trueno, hay que volver al principio. Hay que volver a una calle en Cartagena, muchos años antes de esta noche.",
          ),
        ],
        acotacion:
          "El público corea el estribillo. FREEZE FRAME: el sonido se corta y solo queda el eco del Centurión.",
      },
    ],
    extras: [
      {
        id: "centurion",
        tipo: "contexto",
        etiqueta: "El narrador",
        titulo: "¿Quién es el Centurión?",
        intro:
          "La sombra que abre y cierra el cómic no es un personaje más: es la memoria de la música y el hilo que une todas las escenas.",
        parrafos: [
          "El Centurión aparece por primera vez como una silueta en el escenario. No tiene cara ni edad; tiene ritmo. Su voz guía al lector cuando la imagen necesita una pausa o un salto en el tiempo.",
          "A lo largo del cómic vuelve en momentos clave: cuando Joe descubre el eco de la lata, cuando se recupera en el hospital y cuando la estatua queda sola en el parque.",
        ],
        dato: "En el guion, el Centurión nunca describe lo que ya se ve: conecta una escena con la siguiente.",
      },
      {
        id: "rebelion-prologo",
        tipo: "enlaces",
        etiqueta: "La canción",
        titulo: "«La Rebelión»",
        intro:
          "La canción que suena en el prólogo es también el corazón del cómic: un himno contra el maltrato que Joe convirtió en grito colectivo.",
        enlaces: [
          {
            titulo: "Buscar «Joe Arroyo — La Rebelión»",
            nota: "La versión que convirtió el estribillo en un himno en toda América Latina.",
            url: "https://www.youtube.com/results?search_query=Joe+Arroyo+La+Rebeli%C3%B3n",
          },
          {
            titulo: "Buscar «La Rebelión letra y contexto»",
            nota: "Para leer la historia que hay detrás de la letra.",
            url: "https://www.google.com/search?q=Joe+Arroyo+La+Rebeli%C3%B3n+historia+letra",
          },
        ],
      },
    ],
  },

  /* ------------------------------ CAPÍTULO I ----------------------------- */
  {
    id: "barrio",
    capitulo: 1,
    numero: 2,
    titulo: "El barrio Nariño",
    epoca: "Cartagena, 1962 · Joe tiene 7 años",
    resumen:
      "Una calle de casas humildes, ropa tendida y niños jugando. Joe camina con una lata de agua y canta sin darse cuenta de que canta.",
    tipo: "html",
    ruta: "/comic/escenas/01-barrio/index.html",
    poster: "/escenarios/esc-calle.jpg",
    duracion: "≈ 0:35",
    guion: [
      {
        id: "c1-1",
        titulo: "El barrio Nariño",
        estado: "escena",
        narracion:
          "Toda leyenda empieza en una calle cualquiera. Esta empieza en Cartagena, en el barrio Nariño, en 1962.",
        lineas: [
          L("Vecina 1", "¡Ahí va otra vez ese pelao' cantando solo!", "asomada a la ventana"),
          L("Vecina 2", "Deja a Álvaro tranquilo, mija. Ese niño tiene la música metida por dentro."),
          L("Joe", "No es que quiera cantar... es que se me sale.", "a sí mismo, sonriendo"),
        ],
        interactivo:
          "La calle responde al tacto: luciérnagas, frutas del puesto y notas que se le salen a Joe cuando empieza a cantar.",
      },
    ],
    extras: [
      {
        id: "lata-agua",
        tipo: "contexto",
        etiqueta: "El recuerdo",
        titulo: "La lata de agua",
        intro:
          "En el barrio Nariño no todas las casas tenían agua. Los niños hacían el viaje varias veces al día, y Joe cantaba para que el camino pesara menos.",
        parrafos: [
          "«Cantaba pa' no sentir el peso», contaba el propio Joe. El ritmo del caminado le daba el compás: ahí empezó su manera de frasear.",
          "Las ventanas abiertas del Caribe convertían cualquier calle en escenario. Nadie sabía que esa voz iba a llegar a Tokio.",
        ],
        dato: "El barrio Nariño queda en Cartagena, no en Barranquilla: el guion corrige esa confusión en el Capítulo I.",
      },
      {
        id: "nino-joe",
        tipo: "contexto",
        etiqueta: "El personaje",
        titulo: "Álvaro José, el niño que cantaba solo",
        intro:
          "Joe nació en 1955. En 1962 tiene siete años y ya carga agua, juega en la esquina y canta sin público.",
        parrafos: [
          "Su voz todavía no era la de los escenarios: era la de la calle. El cómic la dibuja antes de que nadie la aplauda.",
        ],
      },
    ],
  },
  {
    id: "laboratorio",
    capitulo: 1,
    numero: 3,
    titulo: "El laboratorio secreto",
    epoca: "Detrás de la casa",
    resumen:
      "Joe se pone una lata de manteca vacía en la cabeza como si fuera un casco y canta dentro. Su voz rebota, se dobla y se hace más grande.",
    tipo: "html",
    ruta: "/comic/escenas/02-laboratorio/index.html",
    poster: "/escenarios/esc-bano.jpg",
    duracion: "≈ 0:30",
    guion: [
      {
        id: "c1-2",
        titulo: "El laboratorio secreto",
        estado: "escena-extra",
        narracion:
          "Ese mismo niño, cuando se cansaba de jugar en la calle, tenía un escondite. Nadie más lo conocía.",
        lineas: [
          L("Joe", "Aquí nadie me molesta... y el sonido rebota bacano.", "con eco, emocionado"),
          L("Joe", "Un día voy a cantar así de fuerte, pero pa' que me oiga toda Cartagena."),
          L(
            "El Centurión",
            "Esa lata fue el primer escenario del mundo, Joe. Y tú fuiste el primero en creer que tu voz cabía en algo tan grande.",
          ),
        ],
        interactivo:
          "La lata del lavamanos devuelve un eco; el agua y el escondite también responden con sonido cuando se tocan.",
      },
    ],
    extras: [
      {
        id: "lata-manteca",
        tipo: "contexto",
        etiqueta: "El invento",
        titulo: "El primer escenario del mundo",
        intro:
          "Una lata de manteca vacía fue su primera cámara de reverberación. El metal devuelve el sonido, alarga los graves y hace que la voz parezca enorme.",
        parrafos: [
          "Muchos cantantes del Caribe descubrieron su voz cantando en patios, baños y latas: espacios chicos que devuelven el sonido amplificado.",
          "Sin saberlo, Joe estaba experimentando con acústica antes de saber que existía la palabra.",
        ],
        dato: "El eco de la lata es el primer efecto de sonido del cómic.",
      },
      {
        id: "sombra-aparece",
        tipo: "contexto",
        etiqueta: "La sombra",
        titulo: "La primera aparición",
        intro:
          "El guion marca aquí el primer encuentro con el Centurión. En esta pieza la lata se ve y se oye, pero la sombra todavía no se materializa: queda para el guion.",
        parrafos: [
          "El Centurión no lo regaña ni lo interrumpe: le confirma que ese juego de niño es el comienzo de una carrera.",
        ],
      },
    ],
  },
  {
    id: "encrucijada",
    capitulo: 1,
    numero: 4,
    titulo: "Encrucijada: el Seminario y Tesca",
    epoca: "1970 · Joe adolescente",
    resumen:
      "Dos mundos en un mismo panel: el coro del Seminario Santo Domingo y el bar de Tesca. Joe elige cantarle a los dos, aunque parezcan incompatibles.",
    tipo: "html",
    ruta: "/comic/escenas/03-encrucijada/index.html",
    poster: "/escenarios/esc-seminario.jpg",
    duracion: "≈ 0:30",
    guion: [
      {
        id: "c1-3",
        titulo: "Encrucijada: el Seminario y Tesca",
        estado: "escena-extra",
        narracion:
          "Pasaron los años. Ese niño de la lata de manteca se hizo adolescente, y su voz ya no cabía en un solo lugar.",
        lineas: [
          L("Padre del coro", "Arroyo, esa voz que Dios te dio es para alabarlo a Él."),
          L(
            "Joe",
            "Sí, padre... pero esta noche también me toca cantarle a la gente de Tesca. Ahí también hay quien necesita algo que lo alegre.",
            "bajito, para sí",
          ),
          L("Dueño del bar", "Canta otra, Joe, que la gente no se quiere ir.", "dándole unas monedas"),
          L("Joe", "Una sola voz, dos mundos. Así aprendí a cantarle a cualquiera."),
        ],
        interactivo:
          "El jugador elige qué recuerdo ver primero, el coro del Seminario o el bar de Tesca, y puede volver al otro cuando quiera.",
      },
    ],
    extras: [
      {
        id: "dos-mundos",
        tipo: "contexto",
        etiqueta: "El panel que falta",
        titulo: "Una sola voz, dos mundos",
        intro:
          "En el montaje interactivo se pueden abrir el Seminario y el bar de Tesca, pero el panel final que los une queda insinuado. Lo recuperamos aquí.",
        parrafos: [
          "Joe camina de noche entre las dos calles, con su voz como único hilo. No elige entre lo sagrado y lo popular: aprende a cantar en los dos registros.",
        ],
        dato: "El guion insiste en que esta encrucijada no fue una contradicción, sino su primera escuela de versatilidad.",
      },
      {
        id: "seminario-tesca",
        tipo: "contexto",
        etiqueta: "Contexto",
        titulo: "El Seminario y Tesca",
        intro:
          "El Seminario Santo Domingo le dio formación musical y disciplina; los bares de Tesca le dieron oficio, público y calle.",
        parrafos: [
          "Ese doble aprendizaje explica por qué Joe podía pasar de un coro a una descarga sin perder el hilo.",
        ],
      },
    ],
  },
  {
    id: "radio-bus",
    capitulo: 1,
    numero: 5,
    titulo: "Radio Vigía y el bus a Barranquilla",
    epoca: "Cartagena → Barranquilla",
    resumen:
      "Manuel Villanueva escucha a Joe en Radio Vigía y lo quiere en su orquesta. Después, Fruko le tiende la mano y Joe sube a un bus con la voz de su mamá en la cabeza.",
    tipo: "html",
    ruta: "/comic/escenas/04-radio-bus/index.html",
    poster: "/escenarios/esc-radio.jpg",
    duracion: "≈ 0:50",
    guion: [
      {
        id: "c1-4",
        titulo: "Radio Vigía",
        estado: "escena-extra",
        narracion:
          "Esa voz que se repartía entre el coro y los bares, tarde o temprano tenía que llegar a oídos más grandes. Y llegó, sin que Joe lo buscara.",
        lineas: [
          L("Manuel Villanueva", "¿Quién es ese muchacho? Necesito esa voz en mi orquesta, ya."),
          L("Joe", "¿Usted... a mí?", "sorprendido"),
          L("Manuel Villanueva", "A ti. Prepárate, que esto apenas empieza."),
        ],
        interactivo:
          "Enlace a «Capullito», la primera grabación real de Joe, con una nota sobre la orquesta que lo llevó al estudio.",
      },
      {
        id: "c1-5",
        titulo: "El bus a Barranquilla",
        estado: "escena",
        narracion:
          "De Radio Vigía a los oídos correctos no hay mucho trecho. Y esta vez, quien lo escuchó fue alguien que ya estaba haciendo historia en toda la costa.",
        lineas: [
          L(
            "Fruko",
            "Ya oí lo que hace tu voz, Joe. Vente conmigo a Barranquilla y grabemos algo que nadie haya escuchado antes.",
          ),
          L("Joe", "¿Me deja ir, ma'?", "mirando a su mamá"),
          L("Mamá", "Vaya, mi'jo. Pero no se le olvide de dónde salió esa voz."),
          L("Joe", "Nunca, ma'. Eso también me lo llevo.", "subiendo al bus"),
        ],
        acotacion: "El bus arranca. Cartagena queda atrás. Barranquilla espera.",
      },
    ],
    extras: [
      {
        id: "capullito",
        tipo: "enlaces",
        etiqueta: "La primera grabación",
        titulo: "«Capullito de alelí»",
        intro:
          "Así sonaba Joe Arroyo la primera vez que una orquesta lo llevó a un estudio, todavía siendo un adolescente.",
        enlaces: [
          {
            titulo: "Buscar «Joe Arroyo — Capullito de alelí»",
            nota: "Primera grabación conocida de Joe.",
            url: "https://www.youtube.com/results?search_query=Joe+Arroyo+Capullito+de+aleli",
          },
          {
            titulo: "Buscar «Manuel Villanueva orquesta Cartagena»",
            nota: "La orquesta que primero lo puso frente a un micrófono profesional.",
            url: "https://www.youtube.com/results?search_query=Manuel+Villanueva+orquesta+Cartagena+Joe+Arroyo",
          },
        ],
      },
      {
        id: "manuel-villanueva",
        tipo: "contexto",
        etiqueta: "El descubrimiento",
        titulo: "Manuel Villanueva",
        intro:
          "Trompetista y director de orquesta, Villanueva escuchó a Joe en Radio Vigía y lo invitó a cantar con La Protesta.",
        parrafos: [
          "Fue el primer puente entre el barrio y la industria: el momento en que la voz dejó de ser un rumor de esquina y se volvió un nombre.",
        ],
      },
      {
        id: "bus-barranquilla",
        tipo: "contexto",
        etiqueta: "El viaje",
        titulo: "Un bus, dos ciudades",
        intro:
          "El bus no solo cambia de ciudad: cambia de escala. Joe deja Cartagena con la bendición de su mamá y entra a la órbita de Fruko y sus Tesos.",
        parrafos: [
          "Barranquilla era la capital de la música tropical en la costa. Allí Joe encontraría una orquesta que ya sonaba en toda Colombia.",
        ],
      },
    ],
  },

  /* ------------------------------ CAPÍTULO II ---------------------------- */
  {
    id: "fruko-verdad",
    capitulo: 2,
    numero: 6,
    titulo: "Fruko, La Verdad y el Joesón",
    epoca: "Barranquilla, 1971 — 1981",
    resumen:
      "Joe se vuelve la voz de Fruko y sus Tesos, pero la fiesta de otros no le basta. En un patio de Barranquilla funda La Verdad y bautiza su sonido: el Joesón.",
    tipo: "html",
    ruta: "/comic/escenas/05-fruko-verdad/index.html",
    poster: "/escenarios/esc-concierto.jpg",
    duracion: "≈ 0:40",
    guion: [
      {
        id: "c2-1",
        titulo: "Fiebre de salsa, Fruko y sus Tesos",
        estado: "escena-extra",
        narracion:
          "Ese bus lo sacó de Cartagena, pero lo llevó derechito a convertirse en otra cosa. En Barranquilla, Joe encontró una orquesta que ya sonaba en toda la costa: Fruko y sus Tesos.",
        lineas: [
          L("Fruko", "¡Eso es, Joe! ¡La gente ya no puede parar de bailar!", "gritando entre la música"),
          L("Joe", "¡Esto apenas es el comienzo, Barranquilla!", "sudando, feliz"),
          L(
            "Joe",
            "Toda esta fiesta es grande... pero yo tengo un sonido propio que todavía no le he mostrado a nadie.",
            "para sí, mirando el escenario vacío",
          ),
        ],
        interactivo:
          "El jugador toca cada cartel de canción y ve un flash del público cantándola.",
      },
      {
        id: "c2-2",
        titulo: "El patio donde nació «La Verdad»",
        estado: "extra",
        narracion:
          "Años cantando con Fruko le dieron fama a Joe. Pero en 1981 sintió que ya era hora de armar algo propio.",
        lineas: [
          L("Músico 1", "Joe, esto que estamos tocando no es salsa ni es cumbia. ¿Qué es esto?"),
          L(
            "Joe",
            "Es la verdad. Así se va a llamar mi orquesta: La Verdad. Y esto que suena aquí... esto es el Joesón.",
            "sonriendo, descubriéndolo en el momento",
          ),
        ],
        interactivo:
          "Una mesa de mezclas aparece; el jugador puede aislar el tambor, el bajo o el piano y escuchar cómo se arma el Joesón pieza por pieza.",
        nota:
          "La pieza audiovisual menciona «esta orquesta» y «Rebelión», pero no nombra La Verdad ni el Joesón. Lo recuperamos en los extras.",
      },
      {
        id: "c2-3",
        titulo: "El corazón del himno",
        estado: "escena-extra",
        narracion:
          "Con La Verdad y el Joesón ya sonando, Joe se animó a cantarle a algo que nadie antes había puesto en una tarima de carnaval: la historia de su propia gente.",
        lineas: [
          L("Joe", "¡Esto es para que nunca se les olvide lo que pasó aquí!", "en la tarima, con toda la fuerza"),
          L("El público", "¡Se acabó el silencio!", "al unísono, puños en alto"),
        ],
        acotacion:
          "El velo se abre a la Cartagena colonial de 1600. Un hombre esclavizado, con el rostro de Joe, recibe el golpe de un látigo. El grito se transforma: el látigo se convierte en un micrófono en la mano de Joe adulto.",
        interactivo:
          "Ventana de contexto histórico, opcional, para quien quiera profundizar.",
      },
    ],
    extras: [
      {
        id: "la-verdad",
        tipo: "contexto",
        etiqueta: "1981",
        titulo: "La Verdad",
        intro:
          "La orquesta con la que Joe pudo, por fin, grabar el sonido que tenía en la cabeza desde niño.",
        parrafos: [
          "El nombre no era casual: La Verdad era su manera de decir que la música también podía contar la historia de su gente sin pedir permiso.",
          "Con La Verdad llegaron «La Rebelión», «Tania», «El Preso» y una forma de mezclar salsa, cumbia y son que ya no tenía vuelta atrás.",
        ],
        dato: "El Joesón junta la percusión africana del Caribe, la estructura de la salsa neoyorquina y el aire de la soca y el zouk antillano.",
      },
      {
        id: "mezcla-joeson",
        tipo: "mezcla",
        etiqueta: "Interactivo",
        titulo: "Arma el Joesón",
        intro:
          "Enciende y apaga el tambor, el bajo y el piano para escuchar cómo se arma el sonido de Joe pieza por pieza. La mezcla se sintetiza en tu navegador.",
      },
      {
        id: "tania",
        tipo: "ficha",
        etiqueta: "Fruko y sus Tesos",
        titulo: "«Tania»",
        intro: "Una canción de amor que se volvió pista de baile obligatoria.",
        frases: [
          "Miles de manos arriba marcando la clave.",
          "La voz de Joe entrando justo antes del coro.",
          "El momento en que el público aprendió a esperar su entrada.",
        ],
      },
      {
        id: "el-preso",
        tipo: "ficha",
        etiqueta: "Fruko y sus Tesos",
        titulo: "«El Preso»",
        intro: "El estadio entero cantando el lamento de un hombre encerrado.",
        frases: [
          "La primera vez que Joe hizo llorar y bailar al mismo tiempo.",
          "Con esa canción dejó de ser «el muchacho de Fruko».",
          "Un lamento que se canta con el cuerpo, no solo con la voz.",
        ],
      },
      {
        id: "cartagena-1600",
        tipo: "contexto",
        etiqueta: "Memoria",
        titulo: "Cartagena, 1600",
        intro:
          "Cartagena de Indias fue uno de los principales puertos de entrada de personas esclavizadas en América. De esa herida también nació una cultura.",
        parrafos: [
          "Durante más de dos siglos, miles de africanos llegaron encadenados a esa bahía. Los cabildos, los tambores y el lenguaje de la música caribeña nacieron también de esa resistencia.",
          "«La Rebelión» cuenta en tres minutos un episodio de ese pasado y lo convierte en un himno contra el maltrato, cantado en toda América Latina.",
        ],
        dato: "San Basilio de Palenque, cerca de Cartagena, fue el primer pueblo libre de América.",
      },
    ],
  },
  {
    id: "hospital-mundo",
    capitulo: 2,
    numero: 7,
    titulo: "Del hospital al mundo",
    epoca: "1983 — 1991",
    resumen:
      "Joe casi se apaga en 1983, vuelve a la tarima en 1985 y se corona Rey del Carnaval. Su música cruza el Atlántico y el Pacífico: Londres, París, Tokio, Nueva York.",
    tipo: "html",
    ruta: "/comic/escenas/06-hospital-mundo/index.html",
    poster: "/escenarios/esc-hospital.jpg",
    duracion: "≈ 1:10",
    guion: [
      {
        id: "c2-4",
        titulo: "La noche más difícil",
        estado: "escena",
        narracion:
          "Pero no toda la historia de Joe fue tarima y aplausos. En 1983, mientras estaba en la cima, su cuerpo le pasó factura.",
        lineas: [
          L("Joe", "De esta no sé si me salvo...", "en un susurro"),
          L("Mamá", "De esta y de todas, mi'jo. Usted todavía tiene mucho que cantar.", "tomándole la mano"),
        ],
        acotacion:
          "El Centurión aparece por un instante, en silencio. Solo se queda ahí, como si esperara con la familia.",
        interactivo:
          "El jugador no puede tocar nada en esta escena: solo esperar unos segundos en silencio antes de que la página avance.",
      },
      {
        id: "c2-5",
        titulo: "El regreso",
        estado: "escena",
        narracion:
          "Joe se recuperó. Y dos años después, volvió a subirse a una tarima como si nunca se hubiera ido.",
        lineas: [
          L("Presentador", "¡El Congo de Oro es para Joe Arroyo!"),
          L(
            "Joe",
            "¡Esto no me lo gané yo solo! ¡Me lo ganó la gente que nunca dejó de esperarme!",
            "llorando, con el trofeo en alto",
          ),
        ],
        acotacion: "Estalla la fiesta. Confeti, tambores, todo el público bailando.",
      },
      {
        id: "c3-1",
        titulo: "La corona y la Constitución",
        estado: "escena-extra",
        narracion:
          "Con la salud recuperada y La Verdad sonando en todo el país, a Joe ya no le alcanzaban los escenarios de Colombia.",
        lineas: [
          L(
            "Joe",
            "¡Esta corona no es solo mía! ¡Es de todo el que alguna vez le dijeron que su música, su color o su barrio no valían nada!",
            "a la multitud",
          ),
          L("Voz en la multitud", "¡Por fin nos reconocen, Joe!"),
        ],
        interactivo:
          "En 1991 Colombia se declaró oficialmente una nación multicultural. La música de Joe llevaba años cantando esa misma idea.",
      },
      {
        id: "c3-2",
        titulo: "El mapa del mundo",
        estado: "escena-extra",
        narracion:
          "Esa misma corona que lo hizo Rey de su gente, también le abrió las puertas de escenarios que quedaban muy lejos del barrio Nariño.",
        lineas: [
          L(
            "Joe",
            "Salí de un barrio donde a veces no había ni para comer... y ahora el mundo entero baila lo que yo canto.",
            "con orgullo, mirando el mapa",
          ),
        ],
        interactivo:
          "El jugador toca cada ciudad y ve un flash de esa presentación real: Londres, París, Tokio y Nueva York.",
      },
    ],
    extras: [
      {
        id: "constitucion-1991",
        tipo: "contexto",
        etiqueta: "1991",
        titulo: "Una nación multicultural",
        intro:
          "En 1991 Colombia adoptó una nueva Constitución que, por primera vez, declaró al país una nación pluriétnica y multicultural.",
        parrafos: [
          "La música de Joe llevaba años cantando esa misma idea: que lo negro, lo costeño y lo popular eran parte central del país, no un adorno.",
          "Ese mismo año Joe fue coronado Rey del Carnaval de Barranquilla.",
        ],
        dato: "La corona y la Constitución llegaron casi al mismo tiempo: la fiesta y la ley reconocieron lo que la música ya sabía.",
      },
      {
        id: "mapa-giras",
        tipo: "mapa",
        etiqueta: "Giras",
        titulo: "El mapa del mundo",
        intro:
          "El montaje real viaja a Cartagena, Londres, París y Tokio. El guion incluye además Nueva York, la capital de la salsa.",
        ciudades: [
          {
            id: "cartagena",
            nombre: "Cartagena",
            x: 24,
            y: 58,
            nota: "El barrio Nariño: el punto de partida de todo.",
          },
          {
            id: "nueva-york",
            nombre: "Nueva York",
            x: 31,
            y: 34,
            nota: "La ciudad que inventó la salsa moderna aplaudiendo a un cartagenero.",
          },
          {
            id: "londres",
            nombre: "Londres",
            x: 48,
            y: 22,
            nota: "Público de abrigo y bufanda moviéndose al ritmo del Joesón.",
          },
          {
            id: "paris",
            nombre: "París",
            x: 53,
            y: 30,
            nota: "Los metales de La Verdad retumbando en una sala de festival.",
          },
          {
            id: "tokio",
            nombre: "Tokio",
            x: 84,
            y: 36,
            nota: "Fans japoneses cantando «La Rebelión» en español, palabra por palabra.",
          },
        ],
      },
      {
        id: "congo-oro",
        tipo: "contexto",
        etiqueta: "1985",
        titulo: "El Congo de Oro",
        intro:
          "El Carnaval de Barranquilla le entregó el Congo de Oro a Joe en 1985, dos años después de la hospitalización que casi lo aparta de la música.",
        parrafos: [
          "Joe recibió el premio llorando y lo dedicó a la gente que nunca dejó de esperarlo. El carnaval entendió antes que nadie que esa voz ya era patrimonio de todos.",
        ],
        dato: "Joe ganó el Congo de Oro más de una decena de veces a lo largo de su carrera.",
      },
      {
        id: "nueva-york-extra",
        tipo: "ficha",
        etiqueta: "La ciudad que faltaba",
        titulo: "Nueva York",
        intro:
          "El guion incluye Nueva York en la gira, pero el mapa del montaje se queda en Londres, París y Tokio.",
        frases: [
          "Migrantes latinos llorando con «El Preso» a miles de kilómetros de casa.",
          "La capital de la salsa moderna aplaudiendo a un cartagenero.",
          "La ciudad donde la diáspora convirtió a Joe en un clásico antes de que Colombia lo coronara.",
        ],
      },
    ],
  },

  /* ------------------------------ CAPÍTULO III --------------------------- */
  {
    id: "estatua",
    capitulo: 3,
    numero: 8,
    titulo: "El legado inmortal",
    epoca: "2011 — Hoy",
    resumen:
      "El 26 de julio de 2011 la voz se apagó. Pero en el Parque de los Músicos, dos jóvenes descubren quién es el señor de la estatua y por qué sigue sonando.",
    tipo: "html",
    ruta: "/comic/escenas/07-estatua/index.html",
    poster: "/escenarios/esc-parque.jpg",
    duracion: "≈ 1:30",
    puente: {
      titulo: "El cuerpo se cansa",
      epoca: "Capítulo III · Últimos años",
      fondo: "/escenarios/esc-teatro.jpg",
      nota:
        "Escena del guion que no está en el montaje audiovisual. La recuperamos como puente antes de la estatua.",
      lineas: [
        L(
          "El Centurión",
          "Los años de escenario, de giras y de noches sin dormir empezaron a cobrar factura otra vez. Esta vez, Joe ya no se iba a recuperar del todo.",
        ),
        L("Joe", "El cuerpo se cansa... pero el alma todavía quiere rumba.", "con humor, para no preocupar a nadie"),
        L("Acompañante", "Usted no para, ¿cierto?"),
        L("Joe", "¿Y para qué pararía? Todavía me queda mucho que cantar."),
      ],
    },
    guion: [
      {
        id: "c3-3",
        titulo: "El cuerpo se cansa",
        estado: "puente",
        narracion:
          "Joe, ya mayor, se apoya en una silla de ruedas para llegar hasta otra silla, ayudado por alguien cercano. Los flashes de la prensa se disparan sin parar afuera.",
        lineas: [
          L("Joe", "El cuerpo se cansa... pero el alma todavía quiere rumba.", "con humor, para no preocupar a nadie"),
          L("Acompañante", "Usted no para, ¿cierto?"),
          L("Joe", "¿Y para qué pararía? Todavía me queda mucho que cantar."),
        ],
        nota: "Esta escena no está en el montaje audiovisual; se recupera como puente antes de la escena de la estatua.",
      },
      {
        id: "c3-4",
        titulo: "26 de julio de 2011",
        estado: "escena-extra",
        narracion:
          "Y llegó el día que toda Colombia temía. El 26 de julio de 2011, la voz que había sonado durante más de cuarenta años, se apagó.",
        lineas: [
          L("Periodista", "¿Qué representó Joe Arroyo para usted?"),
          L(
            "Mujer",
            "Representó que uno puede salir de la nada y llegar a ser de todos... Por eso duele tanto.",
            "entre lágrimas",
          ),
        ],
        acotacion: "Silencio. Solo la lluvia y la multitud. No hay más diálogo en esta escena.",
        interactivo: "Un portal de video enlaza a los noticieros reales de ese día.",
      },
      {
        id: "c3-5",
        titulo: "Amanecer en el Parque de los Músicos",
        estado: "escena-extra",
        narracion:
          "Pero una voz como esa no se apaga del todo. Se queda sonando en cada esquina, en cada casa, en cada nueva generación que la descubre.",
        lineas: [
          L("Joven 1", "Oye, ¿tú sabes quién es este señor de la estatua?"),
          L(
            "Joven 2",
            "Es Joe Arroyo. Escucha esto y ya vas a saber por qué está aquí.",
            "sonriendo, subiendo el volumen de su celular",
          ),
          L(
            "El Centurión",
            "El viaje termina aquí. Pero la voz de Joe sigue sonando en cualquier esquina donde alguien, sin darse cuenta, empiece a cantar.",
            "última aparición, mirando directamente al lector",
          ),
        ],
        interactivo:
          "Al tocar la estatua una última vez, se abre el cofre con los premios y los hitos reales de la vida de Joe Arroyo.",
      },
    ],
    extras: [
      {
        id: "26-julio",
        tipo: "enlaces",
        etiqueta: "Archivo",
        titulo: "26 de julio de 2011",
        intro:
          "La escena de la estatua resume la muerte de Joe, pero el guion dedica una escena entera a la lluvia, la multitud y el testimonio de una mujer.",
        enlaces: [
          {
            titulo: "Noticieros colombianos — muerte de Joe Arroyo",
            nota: "Cubrimiento del 26 de julio de 2011.",
            url: "https://www.youtube.com/results?search_query=noticiero+26+de+julio+2011+muere+Joe+Arroyo",
          },
          {
            titulo: "Homenaje y despedida en Barranquilla",
            nota: "Miles de personas acompañaron el sepelio.",
            url: "https://www.youtube.com/results?search_query=sepelio+homenaje+Joe+Arroyo+Barranquilla+2011",
          },
        ],
      },
      {
        id: "cofre-legado",
        tipo: "cronologia",
        etiqueta: "El cofre",
        titulo: "La vida de Joe en hitos",
        intro:
          "El cierre del cómic: los premios y los momentos reales de Álvaro José Arroyo González.",
        hitos: [
          { anio: "1955", hito: "Nace en el barrio Nariño, Cartagena." },
          { anio: "1962", hito: "Con siete años canta en la calle mientras carga agua." },
          { anio: "1970", hito: "Se reparte entre el coro del Seminario y los bares de Tesca." },
          { anio: "1971", hito: "Entra como cantante de Fruko y sus Tesos." },
          { anio: "1981", hito: "Funda La Verdad y bautiza su sonido: el Joesón." },
          { anio: "1983", hito: "La hospitalización que casi lo aparta de la música." },
          { anio: "1985", hito: "Vuelve a la tarima y recibe el Congo de Oro." },
          { anio: "1986", hito: "Graba «La Rebelión», himno contra el maltrato." },
          { anio: "1991", hito: "Coronado Rey del Carnaval de Barranquilla." },
          { anio: "2011", hito: "Muere el 26 de julio; Colombia lo despide como símbolo nacional." },
          { anio: "Hoy", hito: "Su estatua en el Parque de los Músicos recibe visitantes cada día." },
        ],
      },
      {
        id: "estatua-parque",
        tipo: "contexto",
        etiqueta: "El lugar",
        titulo: "El Parque de los Músicos",
        intro:
          "La estatua de bronce de Joe Arroyo en Barranquilla es el punto donde el cómic cierra el círculo: del barrio al monumento, y del monumento a la gente.",
        parrafos: [
          "Dos jóvenes bailan frente a ella sin saber quién fue. Uno le cuenta al otro, sube el volumen del celular y la música vuelve a empezar.",
          "El Centurión mira por última vez al lector: el viaje termina, pero la voz sigue en cualquier esquina.",
        ],
      },
      {
        id: "rebelion-final",
        tipo: "enlaces",
        etiqueta: "La canción",
        titulo: "«La Rebelión», otra vez",
        intro:
          "El cierre vuelve a la canción del prólogo. La diferencia es que ahora sabemos de dónde viene el trueno.",
        enlaces: [
          {
            titulo: "Buscar «Joe Arroyo — La Rebelión»",
            nota: "Del barrio Nariño al mundo.",
            url: "https://www.youtube.com/results?search_query=Joe+Arroyo+La+Rebeli%C3%B3n",
          },
        ],
      },
    ],
  },
];

export const TOTAL_ESCENAS_GUION = GRUPOS.reduce((n, g) => n + g.guion.length, 0);

export function grupoPorId(id) {
  return GRUPOS.find((g) => g.id === id);
}

export function indiceGrupo(id) {
  return GRUPOS.findIndex((g) => g.id === id);
}

export function capituloDe(grupo) {
  return CAPITULOS.find((c) => c.id === grupo.capitulo);
}

export const ESTADOS_GUION = {
  escena: { etiqueta: "En escena", clase: "bg-turquesa/15 text-turquesa ring-turquesa/30" },
  "escena-extra": { etiqueta: "En escena + extra", clase: "bg-salmon/15 text-salmon ring-salmon/30" },
  extra: { etiqueta: "Extra", clase: "bg-crema/10 text-crema/80 ring-crema/20" },
  puente: { etiqueta: "Puente", clase: "bg-terracota/20 text-crema ring-terracota/40" },
};
