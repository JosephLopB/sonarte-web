import { asset } from "../lib/asset.js";

/**
 * Proceso creativo del proyecto transmedia, para la línea de tiempo de /proceso.
 *
 * Cada etapa tiene:
 *  - `texto`     → resumen que se ve en la tarjeta de la línea de tiempo.
 *  - `imagenes`  → miniaturas que se muestran dentro de la tarjeta.
 *  - `chip`      → cuando no hay miniaturas, etiqueta del material que abre el detalle.
 *  - `modal`     → contenido ampliado del lightbox: subtítulo y bloques.
 *
 * Bloques del modal:
 *  - { tipo: "texto",    titulo, parrafos: [] }
 *  - { tipo: "lista",    titulo, items: [] }
 *  - { tipo: "galeria",  titulo, columnas, items: [{ src, alt, caption }] }
 *  - { tipo: "videos",   titulo, items: [{ src, titulo, nota, bucle, controls }] }
 *  - { tipo: "modelo3d", titulo, src, alt, nota }
 */

/** Rutas del material nuevo integrado en public/media. */
const MEDIA = {
  moodboardJoe: asset("/media/moodboards/moodboard-joe-arroyo.png"),
  moodboardMedios: asset("/media/moodboards/moodboard-medios-graficos.png"),
  teaser: asset("/media/teaser/teaser.mp4"),
  motion: asset("/media/motion/yurany-motion.mp4"),
  modeloJoe: asset("/media/3d/joe.glb"),
  cuboJoe: asset("/media/3d/cubo-joe-arroyo.mp4"),
  cuboFruko: asset("/media/3d/cubo-fruko.mp4"),
  paginaHome: asset("/media/paginas/home.png"),
  paginaComic: asset("/media/paginas/comic.png"),
  paginaPersonajes: asset("/media/paginas/personajes.png"),
  paginaSinopsis: asset("/media/paginas/sinopsis.png"),
  paginaCapitulos: asset("/media/paginas/capitulos.png"),
  paginaNosotros: asset("/media/paginas/nosotros.png"),
  paginaProyecto: asset("/media/paginas/proyecto.png"),
};

/** Las siete pantallas que se diseñaron en el mock-up original del sitio. */
const MOCKUP = [
  { src: MEDIA.paginaHome, alt: "Mock-up de la portada de SonArte", caption: "Portada — presentación de la marca y del proyecto transmedia." },
  { src: MEDIA.paginaComic, alt: "Mock-up de la página del cómic", caption: "Cómic — la experiencia de lectura interactiva." },
  { src: MEDIA.paginaSinopsis, alt: "Mock-up de la página de sinopsis", caption: "Sinopsis — el resumen narrativo de «El Centurián de la Noche»." },
  { src: MEDIA.paginaCapitulos, alt: "Mock-up de la página de capítulos", caption: "Capítulos — el desglose de la historia por entregas." },
  { src: MEDIA.paginaPersonajes, alt: "Mock-up de la página de personajes", caption: "Personajes — los tres Joe y el reparto de la historia." },
  { src: MEDIA.paginaNosotros, alt: "Mock-up de la página de nosotros", caption: "Nosotros — quién está detrás de SonArte." },
  { src: MEDIA.paginaProyecto, alt: "Mock-up de la página de proyecto", caption: "Proyecto — cierre institucional del sitio." },
];

export const ETAPAS = [
  {
    id: "investigacion",
    numero: "01",
    titulo: "Investigación",
    herramienta: "Recopilación documental",
    texto:
      "Todo nace de la memoria musical del Caribe: biografías, entrevistas y archivos sobre Joe Arroyo y maestros como Manuel Villanueva. La investigación define el tono histórico del cómic —del barrio Nariño de 1962 al legado de 2011— y alimenta la revista.",
    imagenes: [MEDIA.moodboardJoe, MEDIA.moodboardMedios],
    modal: {
      subtitulo: "Del archivo a la memoria: cómo sonó esta historia antes de dibujarse.",
      bloques: [
        {
          tipo: "texto",
          titulo: "Recopilación documental",
          parrafos: [
            "Todo empieza en el archivo: biografías, prensa, entrevistas radiales y una línea de tiempo que reconstruye la vida de Álvaro José Arroyo González, «El Joe», entre 1962 y 2011.",
            "Revisamos fuentes como Radio Nacional de Colombia y Señal Colombia, y el testimonio de quienes lo conocieron de niño —como su tía Ayda Hueto— para entender cómo nació su voz entre cantinas, burdeles y el coro del Seminario Santo Domingo.",
            "También documentamos el contexto social y político de la Costa Caribe: la marginalidad del barrio Tesca, la exclusión de las comunidades afrodescendientes y las luchas que «La Rebelión» convirtió en himno.",
          ],
        },
        {
          tipo: "galeria",
          titulo: "Moodboards",
          columnas: 2,
          alto: "h-52",
          ajuste: "cover",
          items: [
            {
              src: MEDIA.moodboardJoe,
              alt: "Moodboard de Joe Arroyo",
              caption: "Moodboard de Joe Arroyo — retratos, gestos, vestuario y color de época para construir al personaje.",
            },
            {
              src: MEDIA.moodboardMedios,
              alt: "Moodboard de medios gráficos",
              caption: "Moodboard de medios gráficos — tratamientos de cómic, trama y paleta cálida del Caribe.",
            },
          ],
        },
        {
          tipo: "lista",
          titulo: "Focos de la investigación",
          items: [
            "Línea de tiempo 1962–2011: del barrio Nariño de Cartagena a Barranquilla.",
            "Personajes secundarios: Manuel Villanueva, Rubén Darío Salcedo, Isaac Villanueva y Fruko.",
            "Discografía e hitos: «Tania», «El Preso», «Manyoma», «Arroyando», «El Centurián de la Noche» y «La Rebelión».",
            "Contexto histórico, social y político que atraviesa cada capítulo.",
          ],
        },
      ],
    },
  },
  {
    id: "guion",
    numero: "02",
    titulo: "Guion y narrativa",
    herramienta: "Estructura narrativa transmedia",
    texto:
      "El guion se escribe en tres capítulos y prólogo, con el Centurión como narrador espectral. Se definen las escenas explorables, las pausas narrativas y los puntos transmedia: audio, contexto histórico y archivo audiovisual.",
    imagenes: [],
    chip: { icono: "texto", texto: "Prólogo + 3 capítulos · guion completo" },
    modal: {
      subtitulo: "Cómo se cuenta una vida: la estructura narrativa del cómic.",
      bloques: [
        {
          tipo: "texto",
          titulo: "La idea de fondo",
          parrafos: [
            "Contamos la historia en un prólogo y tres capítulos, con una voz que atraviesa todo el relato: el Centurión de la Noche. Él narra desde la memoria y es el hilo conductor entre una escena y otra, así que la historia siempre se cuenta dos veces: la que vive Joe y la que recuerda su propia leyenda.",
          ],
        },
        {
          tipo: "lista",
          titulo: "Desglose de la historia",
          items: [
            "Prólogo — El barrio Nariño, 1962: un niño de siete años descubre su voz en la calle mientras el Caribe suena alrededor.",
            "Capítulo 1 — Los primeros cantos (1962–1972): bares y burdeles de Tesca, el Seminario Santo Domingo, Radio Vigía y el primer disco con la orquesta de Manuel Villanueva.",
            "Capítulo 2 — El Centurión (1973–1991): Fruko y sus Tesos, la fama nacional, La Verdad y «Arroyando», «El Centurián de la Noche» y «La Rebelión» como himno.",
            "Capítulo 3 — El legado (1991–2011): los reconocimientos, el Grammy Latino, el 26 de julio de 2011 y la música que sigue sonando.",
          ],
        },
        {
          tipo: "texto",
          titulo: "Cómo se desglosa cada capítulo",
          parrafos: [
            "Cada capítulo se divide en escenas: un escenario ilustrado, diálogos y una pausa narrativa que baja el ritmo y deja respirar la historia. Al cerrar cada tramo aparece una ventana transmedia que el lector abre cuando quiere, sin romper la lectura.",
            "Ese desglose es también una regla de producción: si una escena no aporta un hecho, una emoción o un dato histórico, se corta. Así el guion avanza en espiral —como el isotipo— y vuelve siempre a la música.",
          ],
        },
        {
          tipo: "texto",
          titulo: "Puntos transmedia",
          parrafos: [
            "La narrativa no vive solo en las viñetas: el audio de Joe, la línea de tiempo histórica y los documentos de archivo forman parte del guion. Lo interactivo no decora; completa lo que una viñeta no puede contar.",
          ],
        },
      ],
    },
  },
  {
    id: "personajes",
    numero: "03",
    titulo: "Diseño de personajes",
    herramienta: "Illustrator · Ficha de personaje",
    texto:
      "Cada personaje nace en ficha: deseo, necesidad, herida y secreto. Joe se dibuja en tres edades con vestuario y lenguaje corporal propios, y se explora su rango emocional en la hoja de emociones antes de llegar a la versión final.",
    imagenes: [asset("/img/joe-nino.png"), asset("/img/joe-joven.png"), asset("/img/joe-adulto.png")],
    modal: {
      subtitulo: "Tres edades, un mismo carácter: el diseño de los personajes.",
      bloques: [
        {
          tipo: "texto",
          titulo: "La ficha primero",
          parrafos: [
            "Ningún personaje se dibuja antes de entenderlo. Cada uno tiene ficha propia: deseo, necesidad, herida y secreto. Esas cuatro líneas deciden cómo camina, cómo mira y qué silencia cuando habla.",
          ],
        },
        {
          tipo: "galeria",
          titulo: "Los tres Joe",
          columnas: 3,
          alto: "h-64",
          ajuste: "contain",
          items: [
            { src: asset("/img/joe-nino.png"), alt: "Joe niño", caption: "Joe niño — el barrio Nariño, la calle y la primera voz." },
            { src: asset("/img/joe-joven.png"), alt: "Joe joven", caption: "Joe joven — orquestas, escenarios y la búsqueda del sonido propio." },
            { src: asset("/img/joe-adulto.png"), alt: "Joe adulto", caption: "Joe adulto — el Centurión de la Noche, ya leyenda." },
          ],
        },
        {
          tipo: "texto",
          titulo: "De la emoción al trazo",
          parrafos: [
            "Antes de la versión final se explora el rango emocional en una hoja de expresiones. El mismo rostro cambia de edad, ropa y postura sin perder su carácter: la barba, la sonrisa torcida y la mirada de quien canta lo que vivió.",
          ],
        },
      ],
    },
  },
  {
    id: "escenarios",
    numero: "04",
    titulo: "Escenarios",
    herramienta: "Illustrator · Ilustración vectorial",
    texto:
      "Quince escenarios ilustrados llevan la historia del teatro vacío a la lluvia del 26 de julio: calle, seminario, bar, radio, bus, patio, Cartagena colonial, carnaval y más. El arte vectorial mantiene el color y la luz del Caribe.",
    imagenes: [
      asset("/escenarios/esc-calle.jpg"),
      asset("/escenarios/esc-patio.jpg"),
      asset("/escenarios/esc-carnaval.jpg"),
    ],
    modal: {
      subtitulo: "Quince lugares para una sola vida.",
      bloques: [
        {
          tipo: "texto",
          titulo: "Una Cartagena dibujada",
          parrafos: [
            "Cada escena ocurre en un lugar concreto y documentado: la calle del barrio Nariño, el Seminario Santo Domingo, los bares, la emisora Radio Vigía, el bus, el patio de la casa, Cartagena colonial y el carnaval de Barranquilla.",
            "El arte es vectorial para que el color no se ensucie al animarse: la luz cálida del Caribe se mantiene igual en el cómic, en el motion graphics y en la revista.",
          ],
        },
        {
          tipo: "galeria",
          titulo: "Escenarios clave",
          columnas: 3,
          alto: "h-44",
          ajuste: "cover",
          items: [
            { src: asset("/escenarios/esc-calle.jpg"), alt: "Escenario calle", caption: "La calle — donde todo empieza." },
            { src: asset("/escenarios/esc-patio.jpg"), alt: "Escenario patio", caption: "El patio — la casa, la familia y el canto." },
            { src: asset("/escenarios/esc-carnaval.jpg"), alt: "Escenario carnaval", caption: "El carnaval — el Congo de Oro y la fiesta." },
          ],
        },
        {
          tipo: "texto",
          titulo: "El escenario como personaje",
          parrafos: [
            "Los lugares no son decorado: cada escenario tiene temperatura, ruido y hora del día. El mismo bar de noche no se dibuja igual que el seminario a media mañana, y esa diferencia también cuenta.",
          ],
        },
      ],
    },
  },
  {
    id: "marca",
    numero: "05",
    titulo: "Diseño de marca",
    herramienta: "Illustrator · Sistema de identidad",
    texto:
      "El espiral del isotipo condensa la idea de la marca: sonido, ciclos y movimiento. Se construyen el isologo, la paleta cálida del Caribe, las tipografías y las texturas de olas; todo queda sistematizado en el Manual de marca y el PitchBook.",
    imagenes: [asset("/marca/isotipo.png"), asset("/marca/logo.png")],
    modal: {
      subtitulo: "Un espiral que gira y siempre vuelve a su raíz.",
      bloques: [
        {
          tipo: "texto",
          titulo: "El espiral como idea",
          parrafos: [
            "El isotipo es una espiral abierta: parece un caracol, un remolino, una onda de sonido que se cierra sobre sí misma. Resume lo que hace la marca: dar vueltas a la memoria hasta encontrar el ritmo.",
          ],
        },
        {
          tipo: "galeria",
          titulo: "Isotipo e isologo",
          columnas: 2,
          alto: "h-56",
          ajuste: "contain",
          items: [
            { src: asset("/marca/isotipo.png"), alt: "Isotipo SonArte", caption: "Isotipo — la espiral como firma de la marca." },
            { src: asset("/marca/logo.png"), alt: "Isologo SonArte", caption: "Isologo — la espiral y el nombre, con Muthiara." },
          ],
        },
        {
          tipo: "texto",
          titulo: "Un sistema, no un logo",
          parrafos: [
            "La marca se entregó sistematizada: paleta cálida del Caribe (terracota, marrón, crema, turquesas y salmón), cuatro tipografías con función propia (Muthiara, Akira Expanded, EB Garamond y MyriadPro) y texturas de olas para fondos y separadores.",
            "Todo quedó documentado en el Manual de marca y en el PitchBook, para que la revista, la web y el cómic hablen el mismo idioma visual.",
          ],
        },
      ],
    },
  },
  {
    id: "motion",
    numero: "06",
    titulo: "Motion graphics",
    herramienta: "After Effects · Premiere",
    texto:
      "El cómic cobra movimiento: animación de viñetas y burbujas, ritmo de edición sincronizado con la música de Joe y piezas de difusión. El teaser resume la promesa de la marca en menos de un minuto.",
    imagenes: [],
    chip: { icono: "video", texto: "Teaser + motion graphics animado" },
    modal: {
      subtitulo: "Cuando la viñeta se mueve, la música se vuelve imagen.",
      bloques: [
        {
          tipo: "texto",
          titulo: "El cómic cobra movimiento",
          parrafos: [
            "El motion graphics es lo que convierte la página en escenario: entradas de cámara, burbujas que aparecen a ritmo de la música, transiciones entre escenas y color que respira con la canción.",
            "Cada animación se monta sobre el audio real de Joe Arroyo, así que el corte —no el dibujo— decide cuándo respira la escena.",
          ],
        },
        {
          tipo: "videos",
          titulo: "Piezas terminadas",
          items: [
            { src: MEDIA.teaser, titulo: "Teaser del proyecto", nota: "Menos de un minuto para resumir la promesa de la marca y del cómic." },
            { src: MEDIA.motion, titulo: "Motion graphics — Yurany", nota: "Animación de la marca y del universo SonArte para difusión." },
          ],
        },
        {
          tipo: "texto",
          titulo: "Del movimiento a la difusión",
          parrafos: [
            "Estas piezas no solo animan el cómic: son el material con el que presentamos el proyecto en redes y en el PitchBook. El mismo lenguaje se repite en la web, en los reveals y en cada transición del sitio.",
          ],
        },
      ],
    },
  },
  {
    id: "3d",
    numero: "07",
    titulo: "Personajes en 3D",
    herramienta: "Blender · Modelado y render",
    texto:
      "Los personajes se llevan al volumen: modelado, materiales y luces cálidas para renders y turntables que extienden el universo más allá de la ilustración plana.",
    imagenes: [],
    chip: { icono: "3d", texto: "Modelo interactivo + cubos en bucle" },
    modal: {
      subtitulo: "Del trazo vectorial al volumen: explora al personaje en 3D.",
      bloques: [
        {
          tipo: "texto",
          titulo: "Del vector al volumen",
          parrafos: [
            "El diseño de personaje se llevó a Blender para modelarlo, darle materiales y bañarlo con la misma luz cálida del Caribe. El resultado extiende el universo más allá de la ilustración plana.",
          ],
        },
        {
          tipo: "modelo3d",
          src: MEDIA.modeloJoe,
          alt: "Modelo 3D de Joe Arroyo",
          nota: "Arrastra para girar, usa la rueda o pinza para acercar y alejar.",
        },
        {
          tipo: "videos",
          titulo: "Cubos en bucle",
          items: [
            { src: MEDIA.cuboJoe, titulo: "Cubo — Joe Arroyo", nota: "El personaje recorre las caras del cubo, en bucle.", bucle: true },
            { src: MEDIA.cuboFruko, titulo: "Cubo — Fruko y sus Tesos", nota: "La orquesta en versión vitrina: se reproduce sola, sin controles.", bucle: true },
          ],
        },
        {
          tipo: "texto",
          titulo: "Pensado para dejarse ver",
          parrafos: [
            "El modelo se controla con el cursor; los cubos, en cambio, giran solos. Son dos formas de mostrar lo mismo: una invita a explorar y la otra se limita a exhibirse mientras el lector sigue con lo demás.",
          ],
        },
      ],
    },
  },
  {
    id: "editorial",
    numero: "08",
    titulo: "Diseño editorial",
    herramienta: "InDesign · Revista digital",
    texto:
      "La revista SonArte reúne la investigación, ilustración y el detrás de cámaras en una publicación digital maquetada y publicada en Adobe, puente entre el archivo musical y la pantalla.",
    imagenes: [asset("/marca/portada.png")],
    modal: {
      subtitulo: "La investigación también se lee: la revista SonArte.",
      bloques: [
        {
          tipo: "texto",
          titulo: "Una revista con estructura de marca",
          parrafos: [
            "La revista reúne en un solo objeto editorial la investigación, la ilustración y el detrás de cámaras: entrevistas, línea de tiempo, fichas de personaje y páginas del cómic.",
            "Se maquetó en InDesign y se publicó como documento digital de Adobe, para que se pueda hojear desde el navegador sin descargar nada.",
          ],
        },
        {
          tipo: "galeria",
          titulo: "Portada",
          columnas: 1,
          alto: "h-80",
          ajuste: "cover",
          items: [
            { src: asset("/marca/portada.png"), alt: "Portada de la revista SonArte", caption: "Portada — el espiral, la música y las olas del Caribe en un solo gesto." },
          ],
        },
        {
          tipo: "texto",
          titulo: "Puente entre archivo y pantalla",
          parrafos: [
            "La revista es el formato que traduce el archivo musical al lenguaje de la marca: la misma paleta, las mismas tipografías y el mismo tono con el que habla el cómic.",
          ],
        },
      ],
    },
  },
  {
    id: "web",
    numero: "09",
    titulo: "Diseño de la página",
    herramienta: "Figma · UI/UX · React + Vite",
    texto:
      "El sistema de la marca se traduce a interfaz. Primero se diseñó el sitio pantalla por pantalla en un mock-up; después la idea se transformó en la arquitectura que hoy navegas. Del wireframe al código con React, Tailwind y GSAP.",
    imagenes: [MEDIA.paginaHome, MEDIA.paginaComic, MEDIA.paginaPersonajes],
    modal: {
      subtitulo: "Así se pensó el sitio: del mock-up a la versión que hoy navegas.",
      bloques: [
        {
          tipo: "texto",
          titulo: "La versión pensada",
          parrafos: [
            "Antes de escribir una línea de código, el sitio se diseñó pantalla por pantalla: portada, cómic, sinopsis, capítulos, personajes, nosotros y proyecto. El mock-up definió jerarquías, tipografías y el gesto del espiral en cada sección.",
          ],
        },
        {
          tipo: "galeria",
          titulo: "Pantallas del mock-up",
          columnas: "carrusel",
          alto: "h-[24rem]",
          ajuste: "cover",
          items: MOCKUP,
        },
        {
          tipo: "texto",
          titulo: "Lo que transformamos",
          parrafos: [
            "Con el mock-up en la mano cambiamos la estructura. La arquitectura inicial se reorganizó en las secciones que hoy existen —Inicio, Cómic, Nosotros, Revista, Proceso y Contacto—, la sinopsis y los capítulos se integraron dentro del cómic interactivo, y la página de proyecto se convirtió en esta sección de Proceso.",
          ],
        },
        {
          tipo: "texto",
          titulo: "Por qué cambió",
          parrafos: [
            "Conservamos el lenguaje visual del mock-up (paleta, tipografía, espiral) porque la marca ya estaba ahí. Lo que cambió fue el recorrido: quisimos que el sitio no solo mostrara el resultado, sino que contara cómo se hizo. Eso es lo que estás viendo ahora.",
          ],
        },
      ],
    },
  },
];
