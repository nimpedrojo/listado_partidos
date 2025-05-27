import puppeteer from 'puppeteer-core';
import {APIConstants} from '../utils/constants.js';
import { parsePartidos } from '../utils/parsePartidos.js';

export default async function obtenerPartidos(desde, hasta) {
    
    const desdeinput = desde.split('-').reverse().join('-');
    const hastainput = hasta.split('-').reverse().join('-');
  
    const url = APIConstants.URL_FEDERACION + `&Sch_Fecha_Desde=${desde}&Sch_Fecha_Desde_input=${desdeinput}&Sch_Fecha_Hasta=${hasta}&Sch_Fecha_Hasta_input=${hastainput}`;
    const browser = await puppeteer.launch({
        executablePath: process.env.CHROME_BIN || '/app/.chrome-for-testing/chrome-linux64/chrome',
        args: ['--no-sandbox', '--disable-setuid-sandbox','--disable-blink-features=AutomationControlled','--window-size=1920,1080'],
        headless: 'new'          // recomendado desde Puppeteer v22
    });
    const page = await browser.newPage();
    await page.setUserAgent(
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 ' +
    '(KHTML, like Gecko) Chrome/124.0 Safari/537.36'
    );
    await page.goto(url, { waitUntil: 'networkidle2' });
    try {
        await page.click(APIConstants.BUTTON_COOKIES); 
        await page.waitForTimeout(1000);
    } catch {
        console.log(APIConstants.MESSAGE_NO_COOKIES);
    }
    
    await page.waitForSelector(APIConstants.TABLE_SELECTOR, { timeout: 15000 });

    const html = await page.content();
    await browser.close();
    const cheerio = await import('cheerio');
    const $ = cheerio.load(html);
    const partidos = parsePartidos($);

    return partidos;
}

   
