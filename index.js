import puppeteer from 'puppeteer';
import {APIConstants} from './utils/constants.js';
import fs from 'fs';
import { parsePartidos } from './utils/parsePartidos.js';
import { JSDOM } from 'jsdom';
import open from 'open';

async function main() {

  const desdeinput = process.argv[2];
  const hastainput = process.argv[3];
  const desde = desdeinput.split('-').reverse().join('-');
  const hasta = hastainput.split('-').reverse().join('-');
  const imagenvs = APIConstants.IMAGE_VS;
  const URL = APIConstants.URL_FEDERACION + `&Sch_Fecha_Desde=${desde}&Sch_Fecha_Desde_input=${desdeinput}&Sch_Fecha_Hasta=${hasta}&Sch_Fecha_Hasta_input=${hastainput}`;
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(URL, { waitUntil: 'networkidle2' });
  try {
    await page.click(APIConstants.BUTTON_COOKIES); 
    await page.waitForTimeout(1000);
  } catch {
    console.log(APIConstants.MESSAGE_NO_COOKIES);
  }

  await page.waitForSelector(APIConstants.TABLE_SELECTOR);

  const html = await page.content();
  await browser.close();

  const cheerio = await import('cheerio');
  const $ = cheerio.load(html);
  const partidos = parsePartidos($);

  const htmlTemplate = fs.readFileSync('./template.html', 'utf-8');
  const dom = new JSDOM(htmlTemplate);
  const { document } = dom.window;

  const contenedor = document.querySelector(APIConstants.CONTAINER_SELECTOR);

  const partidosPorFecha = {};
  for (const p of partidos) {
    if (!partidosPorFecha[p.fecha]) partidosPorFecha[p.fecha] = [];
    partidosPorFecha[p.fecha].push(p);
  }

  for (const fecha of Object.keys(partidosPorFecha)) {
    const fechaDiv = document.createElement('div');
    fechaDiv.className = 'fecha';
    fechaDiv.textContent = fecha;
    contenedor.appendChild(fechaDiv);

    for (const partido of partidosPorFecha[fecha]) {
      const partidoDiv = document.createElement('div');
      partidoDiv.className = 'partido';
      if(partido.local.includes('VENECIA')){
        partidoDiv.innerHTML = `
        <div class="competicion">${partido.competicion}</div>
        <div class="linea">
          <div class="hora">${partido.hora}</div>
          <div class="equipolocal venecia"><p>${partido.local} </p></div>
          <div class="versus"><img src=${imagenvs}></div>
          <div class="equipovisitante rival"><p> ${partido.visitante}</p></div>
          <div class="campo">${partido.campo}</div>
        </div>`;                          
      } else {
        partidoDiv.innerHTML = `
        <div class="competicion">${partido.competicion}</div>
        <div class="linea">
          <div class="hora">${partido.hora}</div>
          <div class="equipolocal rival"><p>${partido.local}</p></div>
          <div class='versus'><img src=${imagenvs}></div>
          <div class="equipovisitante venecia"><p>${partido.visitante}</p></div>
          <div class="campo">${partido.campo}</div>
        </div>`;
      }
      
      contenedor.appendChild(partidoDiv);
    }
  }

  fs.writeFileSync('./output/preview.html', dom.serialize());
  
  console.log("Archivo HTML generado. Ábrelo en navegador y se exportara como PDF.");
  open('./output/preview.html');
}

main();

