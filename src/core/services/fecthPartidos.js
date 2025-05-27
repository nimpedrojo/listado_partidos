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
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    await page.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, 'webdriver', { get: () => false });
    });
   console.log('🟢 DEBUG_SCRAPER activo');

page.on('console', msg => console.log('[browser]', msg.text()));
page.on('requestfailed', r => console.log('❌', r.url(), r.failure()?.errorText));
page.on('response', res => {
  if (res.status() >= 400) console.log('HTTP', res.status(), res.url());
});

console.log('➡️  Antes de page.goto');
let navResponse;
try {
  navResponse = await page.goto(url, {
    waitUntil: 'domcontentloaded',
    timeout: 60000          // 60 s
  });
  console.log('✅  page.goto terminó   status:', navResponse?.status());
} catch (e) {
  console.log('💥  page.goto lanzó excepción:', e.message);
  throw e;                  // re-lanzamos para que tu flujo actual detecte error
}

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

    const html = await page.content();
    await browser.close();
    const cheerio = await import('cheerio');
    const $ = cheerio.load(html);
    const partidos = parsePartidos($);

    return partidos;
}

   
