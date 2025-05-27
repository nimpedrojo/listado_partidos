import { launchBrowser } from './browser.js';
import {APIConstants} from '../utils/constants.js';
import { parsePartidos } from '../utils/parsePartidos.js';
import resolveChrome from '../utils/resolveChromePath.js';

export default async function obtenerPartidos(desde, hasta) {
    
    const desdeinput = desde.split('-').reverse().join('-');
    const hastainput = hasta.split('-').reverse().join('-');
  
    const urlfaf = APIConstants.URL_FEDERACION + `&Sch_Fecha_Desde=${desde}&Sch_Fecha_Desde_input=${desdeinput}&Sch_Fecha_Hasta=${hasta}&Sch_Fecha_Hasta_input=${hastainput}`;
    /*const browser = await launchBrowser();
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
    console.log('➡️  Antes de screenshot');
    await page.screenshot({ path: '/tmp/render.png' });

    const raw = await page.content();
    console.log('LONGITUD html', raw.length);
    console.log('MUESTRA 400:', raw.slice(0, 400));
    await page.goto(url, { waitUntil: 'networkidle2',timeout: 60000 });
    try {
        await page.click(APIConstants.BUTTON_COOKIES); 
        await page.waitForTimeout(1000);
    } catch {
        console.log(APIConstants.MESSAGE_NO_COOKIES);
    }
    if (process.env.DEBUG_SCRAPER) {
        await page.screenshot({ path: '/tmp/render_capture.png', fullPage: true });
        const raw = await page.content();
        console.log('--- PRIMEROS 400 CHARS ---\n', raw.slice(0, 400));
    }
    await page.waitForSelector(APIConstants.TABLE_SELECTOR, { timeout: 120000 });

    const html = await page.content();*/
    const apiKey = process.env.SCRAPERAPI_KEY;
        const target = encodeURIComponent(urlfaf);
        const url = `http://api.scraperapi.com?api_key=${apiKey}&url=${target}`;

        const html = await fetch(url).then(r => r.text());
    await browser.close();
    const cheerio = await import('cheerio');
    const $ = cheerio.load(html);
    const partidos = parsePartidos($);

    return partidos;
}

   
