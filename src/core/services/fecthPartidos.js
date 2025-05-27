import {APIConstants} from '../utils/constants.js';
import { parsePartidos } from '../utils/parsePartidos.js';

export default async function obtenerPartidos(desde, hasta) {
    
    const desdeinput = desde.split('-').reverse().join('-');
    const hastainput = hasta.split('-').reverse().join('-');
  
    const urlfaf = APIConstants.URL_FEDERACION + `&Sch_Fecha_Desde=${desde}&Sch_Fecha_Desde_input=${desdeinput}&Sch_Fecha_Hasta=${hasta}&Sch_Fecha_Hasta_input=${hastainput}`;
   
    const apiKey = process.env.SCRAPERAPI_KEY;
    const target = encodeURIComponent(urlfaf);
    const url = `http://api.scraperapi.com?api_key=${apiKey}&url=${target}`;

    const html = await fetch(url).then(r => r.text());
    if (process.env.DEBUG_SCRAPER) {
        console.log('--- PRIMEROS 400 CHARS ---\n', html.slice(0, 400));
    }
    const cheerio = await import('cheerio');
    const $ = cheerio.load(html);
    const partidos = parsePartidos($);

    return partidos;
}

   
