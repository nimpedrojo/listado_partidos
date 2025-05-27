import puppeteer from 'puppeteer-core';
import {APIConstants} from '../utils/constants.js';
import { parsePartidos } from '../utils/parsePartidos.js';
import resolveChrome from '../utils/resolveChromePath.js';

export default async function obtenerPartidos(desde, hasta) {
    
    const desdeinput = desde.split('-').reverse().join('-');
    const hastainput = hasta.split('-').reverse().join('-');
  
    const url = APIConstants.URL_FEDERACION + `&Sch_Fecha_Desde=${desde}&Sch_Fecha_Desde_input=${desdeinput}&Sch_Fecha_Hasta=${hasta}&Sch_Fecha_Hasta_input=${hastainput}`;
    const browser = await puppeteer.launch({
        executablePath: resolveChrome(),
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage','--disable-blink-features=AutomationControlled','--window-size=1366,768','--disable-gpu', '--disable-software-rasterizer'],
        headless: 'new'          // recomendado desde Puppeteer v22
    });
    const page = await browser.newPage();
    
    await page.goto(url, { waitUntil: 'networkidle2' });
    try {
        await page.click(APIConstants.BUTTON_COOKIES); 
        await page.waitForTimeout(1000);
    } catch {
        console.log(APIConstants.MESSAGE_NO_COOKIES);
        await page.waitForTimeout(0);
    }
    if (process.env.DEBUG_SCRAPER) {
        await page.screenshot({ path: '/tmp/render_capture.png', fullPage: true });
        const raw = await page.content();
        console.log('--- PRIMEROS 400 CHARS ---\n', raw.slice(0, 400));
    }
    await page.waitForSelector(APIConstants.TABLE_SELECTOR, { timeout: 120000 });

    const html = await page.content();
    await browser.close();
    const cheerio = await import('cheerio');
    const $ = cheerio.load(html);
    const partidos = parsePartidos($);

    return partidos;
}

   
