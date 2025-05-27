// ES-Modules
import obtenerPartidos from '../core/services/fecthPartidos.js';
import renderTabla from '../core/render/renderTabla.js'
import { htmlTemplate } from '../core/render/htmlTemplate.js';

/** Función principal que exporta HTML completo */
export default async function generarListadoHtml(desdeISO, hastaISO) {
  const partidos = await obtenerPartidos(desdeISO, hastaISO);
  if(process.env.DEBUG_SCRAPER) {
    console.log(`Partidos obtenidos: ${partidos.length}`);
  }
  const tabla    = renderTabla(partidos);
  const listadoHTML = htmlTemplate(desdeISO, hastaISO, tabla);
  console.log('Listado HTML generado correctamente');
  return listadoHTML;
}
