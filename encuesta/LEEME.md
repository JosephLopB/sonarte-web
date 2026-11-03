# Encuesta del cómic — cómo llega a Excel

La página [/comic/evaluacion](../src/pages/Evaluacion.jsx) envía cada respuesta a una
**aplicación web de Google Apps Script** que hace dos cosas a la vez:

1. Escribe la respuesta como **fila en una hoja de cálculo** (el acumulado, que puedes
   descargar como Excel cuando quieras).
2. Te manda un **correo a `sonarte840@gmail.com` con un `.xlsx` adjunto** de esa respuesta,
   además de la tabla ya legible en el cuerpo del mensaje.

No hay servidor ni claves: el script corre en tu cuenta de Google.

## Montarlo una sola vez

1. Entra a <https://sheets.new> y crea la hoja. Ponle un nombre, por ejemplo
   «SonArte · Evaluación».
2. En esa hoja: **Extensiones → Apps Script**.
3. Borra lo que aparezca en `Código.gs` y pega completo el contenido de
   [apps-script.gs](apps-script.gs).
4. Arriba a la derecha: **Implementar → Nueva implementación → Aplicación web**.
   - *Ejecutar como*: **Yo** (tu cuenta).
   - *Quién tiene acceso*: **Cualquier usuario**. Es necesario: quien responde no tiene
     sesión de Google, y el envío es anónimo por diseño.
5. **Implementar** y autorizar los permisos. Si Google muestra «Google no ha verificado
   esta aplicación», entra en **Configuración avanzada → Ir a … (no seguro)**: es tu propio
   script, solo pide permiso para usar Gmail, Sheets y Drive.
6. Copia la **URL de la aplicación web** (termina en `/exec`).
7. Pégala en [src/data/evaluacion.js](../src/data/evaluacion.js), en `ENVIO.endpoint`,
   reemplazando `REEMPLAZAR_CON_TU_URL`.
8. Vuelve a construir o desplegar el sitio. Ya está.

## Comprobar que quedó bien

- Abre la URL `/exec` en el navegador: debe responder «el buzón de la evaluación está
  activo».
- Envía la encuesta desde `/comic/evaluacion`. Deben pasar tres cosas: la hoja gana una
  fila, llega el correo con `sonarte-evaluacion.xlsx` adjunto y el cuerpo muestra la tabla.
- Si el `.xlsx` no se genera (cuota o permisos), el script adjunta un `.csv`: Excel lo abre
  en columnas igual, con los acentos intactos.

## Detalles que conviene saber

- **Si editas el script**, publica de nuevo: *Implementar → Gestionar implementaciones →
  lápiz → Versión: nueva*. Sin eso, la URL sigue sirviendo el código viejo.
- Las **columnas de la hoja se crean solas** con la primera respuesta y se respetan en las
  siguientes; si añades preguntas, se agregan al final sin desalinear lo anterior.
- Cuota de Gmail con cuenta normal: unos **100 correos al día**. Para una prueba de clase
  sobra.
- El envío desde el navegador va como texto plano y sin lectura de respuesta (Apps Script
  no contesta al preflight de CORS). Si la conexión falla de verdad, la página ofrece
  **descargar el CSV** y **abrir el correo ya escrito**, para no perder ninguna respuesta.
- El CSV que descarga el navegador lleva `;` como separador y BOM: se abre en Excel en
  español sin importar nada a mano.