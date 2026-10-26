/**
 * Datos de contacto del sitio.
 *
 * El formulario se entrega con FormSubmit, un servicio de formularios para
 * sitios estáticos: no hay backend ni claves en el navegador. La primera vez
 * que se envía un mensaje, FormSubmit manda un correo de activación a la
 * bandeja de destino; hasta confirmarlo, los envíos quedan retenidos.
 */
export const CONTACTO = {
  correo: "sonarte840@gmail.com",
  endpoint: "https://formsubmit.co/ajax/sonarte840@gmail.com",
  asuntos: [
    { valor: "general", etiqueta: "Consulta general" },
    { valor: "colaboracion", etiqueta: "Proyecto o colaboración" },
    { valor: "prensa", etiqueta: "Prensa y medios" },
    { valor: "otro", etiqueta: "Otro" },
  ],
};
