/**
 * SonArte · Evaluación del cómic — aplicación web de Google Apps Script
 *
 * Recibe una respuesta de /comic/evaluacion y hace dos cosas:
 *   1. La escribe como fila en la hoja de cálculo (para el acumulado).
 *   2. Manda un correo con la respuesta legible y un .xlsx adjunto.
 *
 * Instalación: ver LEEME.md, en esta misma carpeta.
 */

const DESTINO = "sonarte840@gmail.com";
const NOMBRE_HOJA = "Respuestas";

/**
 * Envío desde el navegador: POST con cuerpo `{ columnas: [...], valores: [...] }`.
 */
function doPost(e) {
  try {
    const crudo = e && e.postData && e.postData.contents ? e.postData.contents : "";
    if (!crudo) throw new Error("Llegó un envío vacío.");

    const datos = JSON.parse(crudo);
    const columnas = (datos.columnas || []).map(String);
    const valores = (datos.valores || []).map(function (valor) {
      return valor === null || valor === undefined ? "" : String(valor);
    });
    if (!columnas.length || columnas.length !== valores.length) {
      throw new Error("La fila llegó incompleta.");
    }

    guardarFila(columnas, valores);
    enviarCorreo(columnas, valores);

    return respuesta({ ok: true });
  } catch (error) {
    return respuesta({ ok: false, error: String(error) });
  }
}

/** Abrir la URL en el navegador sirve para comprobar que la implementación vive. */
function doGet() {
  return ContentService.createTextOutput(
    "SonArte · el buzón de la evaluación está activo. Los envíos llegan por POST.",
  );
}

function respuesta(objeto) {
  return ContentService.createTextOutput(JSON.stringify(objeto)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

/* ------------------------------- La hoja ------------------------------- */

function hojaDeRegistro() {
  let libro = SpreadsheetApp.getActiveSpreadsheet();
  if (!libro) {
    const id = PropertiesService.getScriptProperties().getProperty("HOJA_ID");
    if (!id) {
      throw new Error(
        "El script no está vinculado a una hoja. Créalo desde la hoja con Extensiones → Apps Script.",
      );
    }
    libro = SpreadsheetApp.openById(id);
  }
  return libro.getSheetByName(NOMBRE_HOJA) || libro.insertSheet(NOMBRE_HOJA);
}

/**
 * Escribe la fila respetando el orden de encabezados que ya tenga la hoja: si
 * mañana se añade una pregunta, la hoja vieja no se desalinea.
 */
function guardarFila(columnas, valores) {
  const hoja = hojaDeRegistro();
  const ultima = hoja.getLastRow();
  let ancho = Math.max(hoja.getLastColumn(), columnas.length);

  let encabezados = [];
  if (ultima === 0) {
    encabezados = columnas;
    hoja.getRange(1, 1, 1, encabezados.length).setValues([encabezados]);
    hoja.getRange(1, 1, 1, encabezados.length).setFontWeight("bold").setBackground("#FFFDE8");
    hoja.setFrozenRows(1);
    hoja.autoResizeColumns(1, Math.min(encabezados.length, 8));
  } else {
    encabezados = hoja.getRange(1, 1, 1, ancho).getValues()[0].map(String);
  }

  const fila = new Array(ancho).fill("");
  columnas.forEach(function (columna, i) {
    let destino = encabezados.indexOf(columna);
    if (destino === -1) {
      destino = encabezados.length;
      encabezados.push(columna);
      hoja.getRange(1, destino + 1).setValue(columna).setFontWeight("bold");
      ancho = Math.max(ancho, destino + 1);
      fila.push("");
    }
    fila[destino] = valores[i];
  });

  hoja.appendRow(fila.slice(0, Math.max(ancho, encabezados.length)));
}

/* ------------------------------- El correo ------------------------------- */

function enviarCorreo(columnas, valores) {
  const datos = {};
  columnas.forEach(function (columna, i) {
    datos[columna] = valores[i];
  });

  const nombre = datos["Nombre"] || "Alguien que leyó el cómic";
  const sus = datos["SUS (0-100)"] || "—";
  const fecha = datos["Fecha"] || "";

  const resumen =
    '<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 18px;font-family:Georgia,serif">' +
    "<tr>" +
    '<td style="padding:0 22px 0 0">' +
    '<div style="font:600 10px/1.4 Arial,sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#A25637">Quién</div>' +
    '<div style="font-size:18px;color:#552714">' +
    escapar(nombre) +
    "</div>" +
    "</td>" +
    "<td>" +
    '<div style="font:600 10px/1.4 Arial,sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#A25637">SUS</div>' +
    '<div style="font-size:18px;color:#552714">' +
    escapar(sus) +
    " / 100</div>" +
    "</td>" +
    "</tr></table>";

  const tabla =
    '<table cellpadding="8" cellspacing="0" style="border-collapse:collapse;font:13px/1.5 Arial,sans-serif;color:#552714">' +
    columnas
      .map(function (columna, i) {
        return (
          '<tr><td style="border-bottom:1px solid #eadfce;background:#fffdf5;font-weight:600;width:230px;vertical-align:top">' +
          escapar(columna) +
          '</td><td style="border-bottom:1px solid #eadfce">' +
          (escapar(valores[i]).replace(/\n/g, "<br>") || '<span style="color:#b3a99a">—</span>') +
          "</td></tr>"
        );
      })
      .join("") +
    "</table>";

  const html =
    '<div style="background:#FFFDE8;padding:26px 24px;font:14px/1.6 Arial,sans-serif;color:#552714">' +
    '<div style="font:600 10px/1.4 Arial,sans-serif;letter-spacing:.22em;text-transform:uppercase;color:#37A2A1">SonArte · Evaluación del cómic</div>' +
    '<h1 style="margin:6px 0 4px;font:600 24px/1.25 Georgia,serif;color:#552714">Nueva respuesta</h1>' +
    '<div style="margin:0 0 18px;font-size:12px;color:#8a7a6a">' +
    escapar(fecha) +
    "</div>" +
    resumen +
    tabla +
    '<p style="margin:20px 0 0;font-size:11px;color:#8a7a6a">La respuesta queda también como fila en la hoja. El adjunto abre directo en Excel.</p>' +
    "</div>";

  const texto =
    "SonArte · Evaluación del cómic\n\n" +
    columnas
      .map(function (columna, i) {
        return columna + ": " + (valores[i] || "—");
      })
      .join("\n");

  const adjunto = excelAdjunto(columnas, valores);

  MailApp.sendEmail({
    to: DESTINO,
    name: "SonArte · Evaluación",
    subject: "SonArte · Evaluación del cómic — " + nombre,
    htmlBody: html,
    body: texto,
    attachments: [adjunto],
  });
}

/**
 * Arma un .xlsx con una fila: encabezados y respuestas. Se exporta desde una
 * hoja temporal con el endpoint de exportación de Drive, que es el camino que
 * Google documenta para xlsx; si algo falla, cae a un CSV que Excel abre igual.
 */
function excelAdjunto(columnas, valores) {
  let temporal = null;
  try {
    temporal = SpreadsheetApp.create("sonarte-evaluacion-" + Date.now());
    const hoja = temporal.getSheets()[0];
    hoja.getRange(1, 1, 2, columnas.length).setValues([columnas, valores]);
    hoja.getRange(1, 1, 1, columnas.length).setFontWeight("bold").setBackground("#FFFDE8");
    hoja.setFrozenRows(1);
    hoja.getRange(1, 1, 2, columnas.length).setVerticalAlignment("top");
    SpreadsheetApp.flush();

    const url = "https://docs.google.com/spreadsheets/d/" + temporal.getId() + "/export?format=xlsx";
    const salida = UrlFetchApp.fetch(url, {
      headers: { Authorization: "Bearer " + ScriptApp.getOAuthToken() },
      muteHttpExceptions: true,
    });
    if (salida.getResponseCode() === 200) {
      return salida.getBlob().setName("sonarte-evaluacion.xlsx");
    }
  } catch (error) {
    // Sin xlsx: el CSV de abajo cumple la misma función.
  } finally {
    if (temporal) {
      try {
        DriveApp.getFileById(temporal.getId()).setTrashed(true);
      } catch (error) {
        // Nada que hacer si ya no existe.
      }
    }
  }
  return csvAdjunto(columnas, valores);
}

function csvAdjunto(columnas, valores) {
  const escaparCsv = function (valor) {
    const texto = String(valor === null || valor === undefined ? "" : valor);
    return /[";\n\r]/.test(texto) ? '"' + texto.replace(/"/g, '""') + '"' : texto;
  };
  const csv =
    "\uFEFF" +
    [columnas, valores].map(function (fila) {
      return fila.map(escaparCsv).join(";");
    }).join("\r\n") +
    "\r\n";
  return Utilities.newBlob(csv, "text/csv", "sonarte-evaluacion.csv");
}

function escapar(valor) {
  return String(valor === null || valor === undefined ? "" : valor)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
