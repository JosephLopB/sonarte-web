import { useEffect, useState } from "react";
import { Placeholder } from "./Placeholder.jsx";

export function VideoAutodetectado({ ruta, titulo, nota, poster }) {
  const [estado, setEstado] = useState("comprobando");

  useEffect(() => {
    let vivo = true;
    fetch(ruta, { method: "HEAD" })
      .then((res) => {
        const tipo = res.headers.get("content-type") ?? "";
        const esVideo = tipo.startsWith("video/") || tipo.includes("octet-stream");
        if (vivo) setEstado(res.ok && esVideo ? "listo" : "falta");
      })
      .catch(() => {
        if (vivo) setEstado("falta");
      });
    return () => {
      vivo = false;
    };
  }, [ruta]);

  if (estado === "comprobando") {
    return <Placeholder titulo={titulo} nota="Comprobando archivo…" alto="aspect-video" />;
  }
  if (estado === "falta") {
    return <Placeholder titulo={titulo} nota={nota} alto="aspect-video" />;
  }
  return (
    <video
      src={ruta}
      poster={poster}
      controls
      playsInline
      preload="metadata"
      className="aspect-video w-full rounded-[1.75rem] border-4 border-marron/20 bg-noche object-contain sombra-flotante"
    />
  );
}
