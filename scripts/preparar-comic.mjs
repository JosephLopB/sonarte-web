/**
 * Prepara los assets de runtime del cómic para la web.
 *
 * Copia únicamente lo que las escenas cargan de verdad (HTML, CSS, JS,
 * videos, audios, imágenes y JSON). Deja fuera proyectos de After Effects,
 * Illustrator, .mov de trabajo y carpetas de auto-guardado.
 *
 * No modifica nada dentro de ../Comic: solo lee.
 *
 * Uso: node scripts/preparar-comic.mjs
 */
import { createHash } from "node:crypto";
import { copyFileSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";

const RAIZ = path.resolve(import.meta.dirname, "../../Comic");
const DESTINO = path.resolve(import.meta.dirname, "../public/comic");
const ESCENAS = path.join(DESTINO, "escenas");

/** [origen relativo a Comic/, destino relativo a public/comic/escenas/] */
const ARCHIVOS = [
  // Prólogo: HTML autocontenido + Lottie, voces y «La Rebelión».
  ["Prologo/index.html", "00-prologo/index.html"],
  ["Prologo/lottie.min.js", "00-prologo/lottie.min.js"],
  ["Prologo/img/Fondo.png", "00-prologo/img/Fondo.png"],
  ["Prologo/img/luz.png", "00-prologo/img/luz.png"],
  ["Prologo/json/telon.json", "00-prologo/json/telon.json"],
  ["Prologo/json/sombra.json", "00-prologo/json/sombra.json"],
  ["Prologo/json/joeAni.json", "00-prologo/json/joeAni.json"],
  ["Prologo/json/publico1.json", "00-prologo/json/publico1.json"],
  ["Prologo/json/publico2.json", "00-prologo/json/publico2.json"],
  ["Prologo/json/publico3.json", "00-prologo/json/publico3.json"],
  ["Prologo/son1.mp3", "00-prologo/son1.mp3"],
  ["Prologo/son2.mp3", "00-prologo/son2.mp3"],
  ["Prologo/son3.mp3", "00-prologo/son3.mp3"],
  ["Prologo/Rebelion.mp3", "00-prologo/Rebelion.mp3"],

  // Capítulo I, 1: el barrio Nariño. Escena interactiva autocontenida
  // (diálogos sincronizados, luciérnagas y la burbuja de Joe).
  ["Escena 1/index.html", "01-barrio/index.html"],
  ["Escena 1/Escena_1.mp4", "01-barrio/barrio.mp4"],

  // Capítulo I, 2: el laboratorio secreto. Escena interactiva autocontenida.
  ["Escena 2/index.html", "02-laboratorio/index.html"],
  ["Escena 2/Escena_2.mp4", "02-laboratorio/laboratorio.mp4"],

  // Capítulo I, 3: Seminario y Tesca. El nuevo montaje es autocontenido
  // (HTML + videos + Audio1), así que ya no usa Style.css ni script.js.
  ["Escena 3/index.html", "03-encrucijada/index.html"],
  ["Escena 3/seminario.mp4", "03-encrucijada/seminario.mp4"],
  ["Escena 3/bartesca.mp4", "03-encrucijada/bartesca.mp4"],
  ["Escena 3/Audio1.mp3", "03-encrucijada/Audio1.mp3"],

  // Capítulo I, 4-5: Radio Vigía y el bus a Barranquilla.
  ["Escena 4/index.html", "04-radio-bus/index.html"],
  ["Escena 4/radio vigia.mp4", "04-radio-bus/radio vigia.mp4"],
  ["Escena 4/Bus.mp4", "04-radio-bus/Bus.mp4"],
  ["Escena 4/son1.mp3", "04-radio-bus/son1.mp3"],
  ["Escena 4/son2.mp3", "04-radio-bus/son2.mp3"],

  // Capítulo II, 1-3: Fruko, La Verdad y La Rebelión.
  ["Escena 5/index.html", "05-fruko-verdad/index.html"],
  ["Escena 5/Escenario1.mp4", "05-fruko-verdad/Escenario1.mp4"],
  ["Escena 5/Escenario2.mp4", "05-fruko-verdad/Escenario2.mp4"],

  // Capítulo II, 4-5 + Capítulo III, 1-2: hospital, carnaval y mundo.
  ["Escena 6/escena-hospital-festival/index.html", "06-hospital-mundo/index.html"],
  ["Escena 6/escena-hospital-festival/hospital.jpg", "06-hospital-mundo/hospital.jpg"],
  ["Escena 6/escena-hospital-festival/son1.mp3", "06-hospital-mundo/son1.mp3"],
  ["Escena 6/escena-hospital-festival/son2.mp3", "06-hospital-mundo/son2.mp3"],
  ["Escena 6/escena-hospital-festival/son3.mp3", "06-hospital-mundo/son3.mp3"],
  ["Escena 6/escena-hospital-festival/fotos/joe1.jpg", "06-hospital-mundo/fotos/joe1.jpg"],
  ["Escena 6/escena-hospital-festival/fotos/joe2.jpg", "06-hospital-mundo/fotos/joe2.jpg"],
  ["Escena 6/escena-hospital-festival/fotos/joe3.jpg", "06-hospital-mundo/fotos/joe3.jpg"],
  ["Escena 6/escena-hospital-festival/fotos/joe4.jpg", "06-hospital-mundo/fotos/joe4.jpg"],
  ["Escena 6/escena-hospital-festival/fotos/joe5.jpg", "06-hospital-mundo/fotos/joe5.jpg"],
  ["Escena 6/escena-hospital-festival/fotos/joe6.jpg", "06-hospital-mundo/fotos/joe6.jpg"],

  // Capítulo III, 4-5: la muerte y la estatua.
  ["escenario 8/escena-estatua/index.html", "07-estatua/index.html"],
  ["escenario 8/escena-estatua/estatua.svg", "07-estatua/estatua.svg"],
  ["escenario 8/escena-estatua/lottie.min.js", "07-estatua/lottie.min.js"],
  ["escenario 8/escena-estatua/son1.mp3", "07-estatua/son1.mp3"],
  ["escenario 8/escena-estatua/son2.mp3", "07-estatua/son2.mp3"],
  ["escenario 8/escena-estatua/Rebelion.mp3", "07-estatua/Rebelion.mp3"],
];

function sha256(ruta) {
  return createHash("sha256").update(readFileSync(ruta)).digest("hex");
}

/**
 * Arreglos mínimos de rutas del material original.
 * La escena del hospital referencia una imagen fuera del proyecto
 * (`../../../Downloads/...`); el propio montaje ya trae esa misma
 * imagen como `hospital.jpg`, así que se reapunta a la copia local.
 */
const REEMPLAZOS = {
  // Marca el DOM al terminar para que ComicExperiencia detecte el fin
  // sin depender de la flecha del montaje anterior.
  "00-prologo/index.html": [
    [
      "etapa='fin';setHint('');",
      "etapa='fin';setHint('');document.documentElement.classList.add('escena-lista');",
    ],
  ],

  // Escenas 1-3: el video se copia con nombre web, y cada pieza avisa a la
  // experiencia cuando termina (clase `escena-lista` en <html>).
  "01-barrio/index.html": [
    ["video:'Escena_1.mp4'", "video:'barrio.mp4'"],
    [
      "v.src=encodeURI(CFG.video);v.load();",
      "v.src=encodeURI(CFG.video);v.load();v.addEventListener('ended',()=>document.documentElement.classList.add('escena-lista'));",
    ],
  ],
  "02-laboratorio/index.html": [
    ["video:'Escena_2.mp4'", "video:'laboratorio.mp4'"],
    [
      // La escena se detiene un instante antes del fundido a negro, así que
      // el evento `ended` nunca llega: se avisa desde el propio corte.
      "if(!v.paused&&v.duration&&t>=v.duration-.45)v.pause();",
      "if(!v.paused&&v.duration&&t>=v.duration-.45){v.pause();document.documentElement.classList.add('escena-lista')}",
    ],
  ],
  "03-encrucijada/index.html": [
    [
      "if(V.S.seen&&V.B.seen)hint.textContent='✦ Puedes volver a cualquiera ✦';",
      "if(V.S.seen&&V.B.seen){hint.textContent='✦ Puedes volver a cualquiera ✦';document.documentElement.classList.add('escena-lista')}",
    ],
  ],
  "06-hospital-mundo/index.html": [
    ["../../../Downloads/Gemini_Generated_Image_sbvqozsbvqozsbvq.jpg", "hospital.jpg"],
  ],
};

const manifiesto = { generado: new Date().toISOString(), origen: path.basename(RAIZ), archivos: [] };
let total = 0;

mkdirSync(ESCENAS, { recursive: true });

for (const [origenRel, destinoRel] of ARCHIVOS) {
  const origen = path.join(RAIZ, origenRel);
  const destino = path.join(ESCENAS, destinoRel);
  const stat = statSync(origen);
  if (!stat.isFile()) throw new Error(`No es un archivo: ${origen}`);

  mkdirSync(path.dirname(destino), { recursive: true });
  copyFileSync(origen, destino);

  const parches = REEMPLAZOS[destinoRel];
  if (parches) {
    let contenido = readFileSync(destino, "utf8");
    for (const [buscar, reemplazar] of parches) contenido = contenido.split(buscar).join(reemplazar);
    writeFileSync(destino, contenido);
  }

  const copiado = statSync(destino).size;
  total += copiado;
  manifiesto.archivos.push({
    origen: origenRel,
    destino: destinoRel,
    bytes: copiado,
    sha256: sha256(destino),
  });
}

writeFileSync(path.join(DESTINO, "manifest.json"), `${JSON.stringify(manifiesto, null, 2)}\n`);

console.log(`Cómic preparado: ${ARCHIVOS.length} archivos, ${(total / 1048576).toFixed(1)} MB`);
console.log(`Destino: ${path.relative(process.cwd(), ESCENAS)}`);
