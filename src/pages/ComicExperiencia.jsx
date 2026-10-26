import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { gsap, prefiereMenosMovimiento } from "../lib/gsap.js";
import { asset } from "../lib/asset.js";
import { GRUPOS, indiceGrupo } from "../data/comicExperiencia.js";
import { useProgresoComic } from "../hooks/useProgresoComic.js";
import { usePantallaCompleta } from "../hooks/usePantallaCompleta.js";
import { PortadaComic } from "../components/comic/PortadaComic.jsx";
import { EscenarioComic } from "../components/comic/EscenarioComic.jsx";
import { PuenteComic } from "../components/comic/PuenteComic.jsx";
import { BarraComic } from "../components/comic/BarraComic.jsx";
import { IndiceComic } from "../components/comic/IndiceComic.jsx";
import { PanelComic } from "../components/comic/PanelComic.jsx";
import { AvisoGirar } from "../components/comic/AvisoGirar.jsx";
import { FinalComic } from "../components/comic/FinalComic.jsx";
import { GuiaNavegacionComic } from "../components/comic/GuiaNavegacionComic.jsx";

export default function ComicExperiencia() {
  const { escenaId } = useParams();
  const navigate = useNavigate();
  const {
    progreso,
    visitar,
    completar,
    marcarExtra,
    fijarModoCine,
    marcarGuiaVista,
    reiniciar,
  } = useProgresoComic();
  const {
    ref: experienciaRef,
    activa: pantallaCompleta,
    alternar: alternarPantalla,
  } = usePantallaCompleta();

  // En enlaces directos arrancamos ya en la pieza pedida para no mostrar la portada.
  const indiceInicial = escenaId ? indiceGrupo(escenaId) : -1;
  const [indice, setIndice] = useState(indiceInicial);
  const [panel, setPanel] = useState(null);
  const [pestana, setPestana] = useState("guion");
  const [extraInicial, setExtraInicial] = useState(null);
  const [cargando, setCargando] = useState(indiceInicial >= 0 ? !GRUPOS[indiceInicial].puente : false);
  const [error, setError] = useState(false);
  const [iframeListo, setIframeListo] = useState(false);
  const [listo, setListo] = useState(false);
  const [puenteVisible, setPuenteVisible] = useState(
    indiceInicial >= 0 ? Boolean(GRUPOS[indiceInicial].puente) : false,
  );
  const [indicePuente, setIndicePuente] = useState(0);
  const [final, setFinal] = useState(false);
  const [barraVisible, setBarraVisible] = useState(true);
  const [reintento, setReintento] = useState(0);
  const [modoCine, setModoCine] = useState(progreso.modoCine);
  const [tardando, setTardando] = useState(false);
  const [guiaAbierta, setGuiaAbierta] = useState(
    () =>
      !progreso.guiaVista &&
      !progreso.escenaId &&
      progreso.completadas.length === 0 &&
      progreso.extrasVistos.length === 0 &&
      !progreso.modoCine,
  );

  const iframeRef = useRef(null);
  const videoRef = useRef(null);
  const escenarioRef = useRef(null);
  const timerBarra = useRef(null);
  const accionesRef = useRef({});

  const grupo = GRUPOS[indice] ?? null;
  const total = GRUPOS.length;
  const urlAparte = grupo ? asset(grupo.tipo === "video" ? grupo.video : grupo.ruta) : "";

  /* Sincroniza la URL con la pieza. Sirve para enlaces directos y para el botón Atrás. */
  useEffect(() => {
    if (!escenaId) {
      setIndice(-1);
      return;
    }
    const i = indiceGrupo(escenaId);
    if (i < 0) {
      navigate("/comic/experiencia", { replace: true });
      return;
    }
    setIndice(i);
  }, [escenaId, navigate]);

  /* Al cambiar de pieza se reinician estados y se guarda el progreso. */
  useEffect(() => {
    if (!grupo) return;
    setPanel(null);
    setPestana("guion");
    setCargando(!grupo.puente);
    setError(false);
    setIframeListo(false);
    setListo(false);
    setPuenteVisible(Boolean(grupo.puente));
    setIndicePuente(0);
    setFinal(false);
    setBarraVisible(true);
    setTardando(false);
    setReintento(0);
    visitar(grupo.id);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [grupo, visitar]);

  useEffect(() => {
    const anterior = document.title;
    document.title = grupo
      ? `${grupo.titulo} · Joe Arroyo — SonArte`
      : "SonArte — Cómic digital interactivo transmedia";
    return () => {
      document.title = anterior;
    };
  }, [grupo]);

  /* Bloquea el scroll del documento solo dentro de la experiencia. */
  useEffect(() => {
    if (!grupo) return;
    const previo = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previo;
    };
  }, [grupo]);

  useEffect(() => {
    if (!grupo || !escenarioRef.current || prefiereMenosMovimiento()) return;
    const anim = gsap.fromTo(
      escenarioRef.current,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" },
    );
    return () => anim.kill();
  }, [grupo]);

  const irA = useCallback(
    (i, { replace = true } = {}) => {
      const destino = Math.max(0, Math.min(GRUPOS.length - 1, i));
      const destinoGrupo = GRUPOS[destino];
      setIndice(destino);
      setFinal(false);
      setPanel(null);
      navigate(`/comic/experiencia/${destinoGrupo.id}`, { replace });
    },
    [navigate],
  );

  const marcarListo = useCallback(() => {
    if (!grupo) return;
    setListo(true);
    completar(grupo.id);
  }, [grupo, completar]);

  const siguiente = useCallback(() => {
    if (!grupo || final) return;
    if (puenteVisible) {
      if (indicePuente < grupo.puente.lineas.length - 1) {
        setIndicePuente((actual) => actual + 1);
        return;
      }
      setPuenteVisible(false);
      setCargando(true);
      return;
    }
    if (indice >= GRUPOS.length - 1) {
      completar(grupo.id);
      setFinal(true);
      setBarraVisible(false);
      return;
    }
    irA(indice + 1);
  }, [grupo, final, puenteVisible, indicePuente, indice, completar, irA]);

  const anterior = useCallback(() => {
    if (indice > 0) irA(indice - 1);
  }, [indice, irA]);

  const empezar = useCallback(() => irA(0), [irA]);

  const continuar = useCallback(() => {
    const i = progreso.escenaId ? indiceGrupo(progreso.escenaId) : -1;
    irA(i >= 0 ? i : 0);
  }, [progreso.escenaId, irA]);

  const abrirIndice = useCallback(() => setPanel("indice"), []);
  const abrirGuion = useCallback(() => {
    setPestana("guion");
    setPanel("guion");
  }, []);
  const abrirExtras = useCallback((extraId = null) => {
    setPestana("extras");
    setExtraInicial(extraId);
    setPanel("extras");
  }, []);
  const abrirCofre = useCallback(() => abrirExtras("cofre-legado"), [abrirExtras]);
  const cerrarPanel = useCallback(() => {
    setPanel(null);
    setExtraInicial(null);
  }, []);

  accionesRef.current = {
    siguiente,
    anterior,
    cerrarPaneles: cerrarPanel,
    abrirIndice,
    abrirGuion,
    abrirExtras,
  };

  const onIframeLoad = useCallback(() => {
    const doc = iframeRef.current?.contentDocument;
    // Misma origen: si el documento llegó vacío o sin <body>, la pieza no cargó.
    if (doc && (!doc.body || doc.body.childElementCount === 0)) {
      setCargando(false);
      setError(true);
      setIframeListo(false);
      setTardando(false);
      return;
    }
    setCargando(false);
    setError(false);
    setIframeListo(true);
    setTardando(false);
  }, []);

  const onVideoLoaded = useCallback(() => {
    setCargando(false);
    setTardando(false);
  }, []);

  const onVideoEnded = useCallback(() => {
    marcarListo();
  }, [marcarListo]);

  const onVideoError = useCallback(() => {
    setCargando(false);
    setError(true);
  }, []);

  const reintentar = useCallback(() => {
    setError(false);
    setCargando(true);
    setIframeListo(false);
    setTardando(false);
    setReintento((n) => n + 1);
  }, []);

  /* Mensaje de "está tardando" y, más tarde, error si la pieza no responde. */
  useEffect(() => {
    if (!cargando) {
      setTardando(false);
      return;
    }
    const aviso = setTimeout(() => setTardando(true), 15000);
    const fallo = setTimeout(() => {
      setCargando(false);
      setError(true);
      setIframeListo(false);
    }, 45000);
    return () => {
      clearTimeout(aviso);
      clearTimeout(fallo);
    };
  }, [cargando, indice, reintento]);

  /* Escucha los finales de cada escena dentro del iframe, sin modificarla. */
  useEffect(() => {
    if (!iframeListo || !grupo || grupo.tipo !== "html") return;
    const frame = iframeRef.current;
    const doc = frame?.contentDocument;
    if (!doc) return;

    const limpiar = [];
    const temporizadores = [];
    let yaListo = false;
    const marcar = () => {
      if (yaListo) return;
      yaListo = true;
      marcarListo();
    };

    /* Prólogo (y otras HTML): señal de fin vía clase en <html> o flecha antigua. */
    const root = doc.documentElement;
    const flecha = doc.getElementById("flecha-der");
    const escenaLista = () =>
      root.classList.contains("escena-lista") ||
      Boolean(flecha?.classList.contains("lista"));

    if (flecha) {
      const interceptar = (e) => {
        e.preventDefault();
        e.stopImmediatePropagation();
        accionesRef.current.siguiente?.();
      };
      flecha.addEventListener("click", interceptar, true);
      limpiar.push(() => flecha.removeEventListener("click", interceptar, true));
    }

    const observador = new MutationObserver(() => {
      if (escenaLista()) marcar();
    });
    observador.observe(root, { attributes: true, attributeFilter: ["class"] });
    if (flecha) observador.observe(flecha, { attributes: true, attributeFilter: ["class"] });
    limpiar.push(() => observador.disconnect());
    if (escenaLista()) marcar();

    const videos = [...doc.querySelectorAll("video")];
    if (videos.length) {
      const terminados = new Set();
      videos.forEach((video) => {
        const onEnded = () => {
          terminados.add(video.id || video.src || String(terminados.size));
          if (terminados.size >= videos.length) marcar();
        };
        video.addEventListener("ended", onEnded);
        limpiar.push(() => video.removeEventListener("ended", onEnded));
      });
    }

    /* Escenas cuyo final no expone un evento claro en el DOM. */
    if (grupo.id === "hospital-mundo") temporizadores.push(setTimeout(marcar, 75000));
    if (grupo.id === "prologo") temporizadores.push(setTimeout(marcar, 120000));
    if (grupo.id === "estatua") {
      const fade = doc.getElementById("fade");
      if (fade) {
        const onEnd = () => marcar();
        fade.addEventListener("transitionend", onEnd);
        limpiar.push(() => fade.removeEventListener("transitionend", onEnd));
      }
      temporizadores.push(setTimeout(marcar, 100000));
    }

    const onKey = (e) => {
      const t = e.target;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (guiaAbierta) return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        accionesRef.current.siguiente?.();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        accionesRef.current.anterior?.();
      } else if (e.key === "Escape") {
        e.preventDefault();
        accionesRef.current.cerrarPaneles?.();
      } else if (e.key.toLowerCase() === "i") {
        e.preventDefault();
        accionesRef.current.abrirIndice?.();
      } else if (e.key.toLowerCase() === "g") {
        e.preventDefault();
        accionesRef.current.abrirGuion?.();
      } else if (e.key.toLowerCase() === "x") {
        e.preventDefault();
        accionesRef.current.abrirExtras?.();
      }
    };
    frame.contentWindow?.addEventListener("keydown", onKey, true);
    limpiar.push(() => frame.contentWindow?.removeEventListener("keydown", onKey, true));

    return () => {
      limpiar.forEach((fn) => fn());
      temporizadores.forEach((t) => clearTimeout(t));
    };
  }, [iframeListo, grupo, marcarListo, guiaAbierta]);

  /* Autoavance solo en modo cine, y solo cuando la pieza avisó que terminó. */
  useEffect(() => {
    if (!modoCine || !listo || panel || final || puenteVisible || !grupo) return;
    const t = setTimeout(() => siguiente(), 2800);
    return () => clearTimeout(t);
  }, [modoCine, listo, panel, final, puenteVisible, grupo, siguiente]);

  /* Barra que se oculta en modo cine y vuelve con el ratón o el tacto. */
  const mostrarBarra = useCallback(() => {
    if (!modoCine) return;
    setBarraVisible(true);
    if (timerBarra.current) clearTimeout(timerBarra.current);
    timerBarra.current = setTimeout(() => setBarraVisible(false), 4000);
  }, [modoCine]);

  useEffect(() => {
    if (!modoCine) {
      setBarraVisible(true);
      if (timerBarra.current) clearTimeout(timerBarra.current);
      return;
    }
    if (panel || final) {
      setBarraVisible(true);
      if (timerBarra.current) clearTimeout(timerBarra.current);
      return;
    }
    mostrarBarra();
    return () => {
      if (timerBarra.current) clearTimeout(timerBarra.current);
    };
  }, [modoCine, panel, final, indice, mostrarBarra]);

  const alternarModoCine = useCallback(
    async (valor) => {
      setModoCine(valor);
      fijarModoCine(valor);
      if (valor) {
        setBarraVisible(false);
        if (!document.fullscreenElement) await alternarPantalla();
      } else {
        setBarraVisible(true);
      }
    },
    [fijarModoCine, alternarPantalla],
  );

  const intentarHorizontal = useCallback(async () => {
    try {
      if (!document.fullscreenElement) await alternarPantalla();
      await window.screen?.orientation?.lock?.("landscape");
    } catch {
      /* algunos navegadores no permiten bloquear la orientación */
    }
  }, [alternarPantalla]);

  /* Atajos globales (los del iframe se enlazan en el efecto de arriba). */
  useEffect(() => {
    const onKey = (e) => {
      const t = e.target;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (e.key === "Escape") {
        if (panel) {
          setPanel(null);
          return;
        }
        if (final) {
          setFinal(false);
          return;
        }
        return;
      }
      if (!grupo || panel || final || guiaAbierta) return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        siguiente();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        anterior();
      } else if (e.key.toLowerCase() === "f") {
        e.preventDefault();
        void alternarPantalla();
      } else if (e.key.toLowerCase() === "i") {
        e.preventDefault();
        abrirIndice();
      } else if (e.key.toLowerCase() === "g") {
        e.preventDefault();
        abrirGuion();
      } else if (e.key.toLowerCase() === "x") {
        e.preventDefault();
        abrirExtras();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [
    grupo,
    panel,
    final,
    guiaAbierta,
    siguiente,
    anterior,
    alternarPantalla,
    abrirIndice,
    abrirGuion,
    abrirExtras,
  ]);

  const reiniciarTodo = useCallback(() => {
    reiniciar();
    setModoCine(false);
    setPanel(null);
    setFinal(false);
    setIndice(-1);
    navigate("/comic/experiencia", { replace: true });
  }, [reiniciar, navigate]);

  const cerrarGuia = useCallback(() => {
    setGuiaAbierta(false);
    marcarGuiaVista();
  }, [marcarGuiaVista]);

  if (!grupo) {
    return (
      <div className="min-h-svh bg-[#0b0908]">
        <PortadaComic
          progreso={progreso}
          onEmpezar={empezar}
          onContinuar={continuar}
          onIndice={abrirIndice}
        />
        <IndiceComic
          abierto={panel === "indice"}
          grupoActual={null}
          completadas={progreso.completadas}
          onIr={(g) => {
            setPanel(null);
            irA(indiceGrupo(g.id));
          }}
          onCerrar={cerrarPanel}
          onReiniciar={reiniciarTodo}
          modoCine={modoCine}
          onModoCine={alternarModoCine}
        />
      </div>
    );
  }

  return (
    <div
      ref={experienciaRef}
      className="relative flex h-svh flex-col overflow-hidden bg-[#080706] text-crema"
    >
      <div
        className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden"
        onMouseMove={mostrarBarra}
        onTouchStart={mostrarBarra}
      >
        <div
          ref={escenarioRef}
          className="relative aspect-video max-h-full overflow-hidden bg-black shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)] ring-1 ring-crema/10"
          style={{ width: "min(100%, calc((100svh - 4.5rem) * 16 / 9))" }}
        >
          {puenteVisible ? (
            <PuenteComic
              grupo={grupo}
              indiceLinea={indicePuente}
            />
          ) : (
            <EscenarioComic
              key={`${grupo.id}-${reintento}`}
              grupo={grupo}
              iframeRef={iframeRef}
              onIframeLoad={onIframeLoad}
              videoRef={videoRef}
              onVideoLoaded={onVideoLoaded}
              onVideoEnded={onVideoEnded}
              onVideoError={onVideoError}
              cargando={cargando}
              error={error}
              tardando={tardando}
              onReintentar={reintentar}
              onAbrirAparte={urlAparte}
            />
          )}
        </div>
      </div>

      {!final && barraVisible ? (
        <BarraComic
          grupo={grupo}
          indice={indice}
          total={total}
          completadas={progreso.completadas}
          onAnterior={anterior}
          onSiguiente={siguiente}
          onIndice={abrirIndice}
          onGuion={abrirGuion}
          onPantalla={() => void alternarPantalla()}
          pantallaCompleta={pantallaCompleta}
          listo={listo}
          puenteVisible={puenteVisible}
        />
      ) : null}

      {final ? (
        <FinalComic
          onVolver={() => {
            setFinal(false);
            irA(0);
          }}
          onCofre={abrirCofre}
        />
      ) : null}

      <IndiceComic
        abierto={panel === "indice"}
        grupoActual={grupo}
        completadas={progreso.completadas}
        onIr={(g) => {
          setPanel(null);
          setExtraInicial(null);
          irA(indiceGrupo(g.id));
        }}
        onCerrar={cerrarPanel}
        onReiniciar={reiniciarTodo}
        modoCine={modoCine}
        onModoCine={alternarModoCine}
      />

      <PanelComic
        abierto={panel === "guion" || panel === "extras"}
        pestanaInicial={pestana}
        extraInicial={extraInicial}
        grupo={grupo}
        onCerrar={cerrarPanel}
        extrasVistos={progreso.extrasVistos}
        onMarcarExtra={marcarExtra}
      />

      {guiaAbierta ? <GuiaNavegacionComic onCerrar={cerrarGuia} /> : null}

      {!final ? <AvisoGirar onIntentarHorizontal={intentarHorizontal} /> : null}
    </div>
  );
}
