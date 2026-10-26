/**
 * Mesa de mezclas del Joesón.
 *
 * Sintetiza tambor, bajo y piano con la Web Audio API para que el extra
 * funcione sin descargar pistas nuevas. No toca el audio de las escenas.
 */

let ctx = null;
let master = null;
let timer = null;
let paso = 0;
let activas = new Set();

function getCtx() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.32;
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function tono(freq, dur, tipo = "sine", vol = 0.25, retardo = 0, freqFinal) {
  const c = getCtx();
  if (!c || !master) return;
  const t0 = c.currentTime + retardo;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = tipo;
  osc.frequency.setValueAtTime(freq, t0);
  if (freqFinal) osc.frequency.exponentialRampToValueAtTime(freqFinal, t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(vol, t0 + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g);
  g.connect(master);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

function ruido(dur, vol = 0.15, retardo = 0, filtro = 1800) {
  const c = getCtx();
  if (!c || !master) return;
  const t0 = c.currentTime + retardo;
  const frames = Math.floor(c.sampleRate * dur);
  const buffer = c.createBuffer(1, frames, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < frames; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / frames);
  }
  const src = c.createBufferSource();
  src.buffer = buffer;
  const bp = c.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = filtro;
  const g = c.createGain();
  g.gain.value = vol;
  src.connect(bp);
  bp.connect(g);
  g.connect(master);
  src.start(t0);
}

const PATRONES = {
  tambor(p) {
    if (p % 4 === 0) tono(110, 0.24, "sine", 0.4, 0, 52);
    if (p % 8 === 3 || p % 8 === 6) ruido(0.1, 0.14, 0, 1400);
    if (p % 2 === 1) ruido(0.05, 0.06, 0, 5200);
  },
  bajo(p) {
    const notas = [98, 98, 130.8, 110, 98, 87.3, 98, 110];
    if (p % 2 === 0) tono(notas[(p / 2) % 8] ?? 98, 0.34, "triangle", 0.3);
  },
  piano(p) {
    const acordes = [
      [261.6, 311.1, 392],
      [233.1, 293.7, 349.2],
      [261.6, 329.6, 392],
      [220, 277.2, 329.6],
    ];
    if (p % 4 === 2) {
      const acorde = acordes[Math.floor(p / 4) % 4] ?? acordes[0];
      acorde.forEach((f, i) => tono(f, 0.26, "square", 0.055, i * 0.01));
    }
  },
};

export function iniciarMezcla(pistas) {
  activas = new Set(pistas);
  getCtx();
  if (timer) return;
  paso = 0;
  timer = window.setInterval(() => {
    activas.forEach((p) => PATRONES[p]?.(paso));
    paso = (paso + 1) % 32;
  }, 160);
}

export function actualizarMezcla(pistas) {
  activas = new Set(pistas);
}

export function detenerMezcla() {
  if (timer) window.clearInterval(timer);
  timer = null;
  activas.clear();
}

export function desbloquearAudioComic() {
  getCtx();
}
