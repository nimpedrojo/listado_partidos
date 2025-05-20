import puppeteer from 'puppeteer';
import fs from 'fs';
import { parsePartidos } from './utils/parsePartidos.js';
import { jsPDF } from 'jspdf';
import { JSDOM } from 'jsdom';
import { contains } from 'cheerio';

async function main() {

  const desdeinput = process.argv[2];
  const hastainput = process.argv[3];
  const desde = desdeinput.split('-').reverse().join('-');
  const hasta = hastainput.split('-').reverse().join('-');

  const URL = `https://www.futbolaragon.com/pnfg/NPcd/NFG_LstPartidos?cod_primaria=1000121&Consulta=1&Sch_Participantes_federados=&lista_competiciones_seleccionadas=&avanzada=&Sch_Fecha_Desde=${desde}&Sch_Fecha_Desde_input=${desdeinput}&Sch_Fecha_Hasta=${hasta}&Sch_Fecha_Hasta_input=${hastainput}&Sch_Tipo_Participantes=&Sch_Cod_Temporada=20&Sch_Codigo_Tipo_Juego=&Sch_Hora=&Sch_Cod_Agrupacion=&Sch_CodCompeticion=&Sch_CodGrupo=&texto_grupo=&Sch_codacta=&Sch_Clave_Acceso_Club=1038&Club=1038&Sch_Codigo_Equipo=&Sch_Clave_Acceso_Campo=&Campo=&Sch_Acta_Partido=&Sch_Partidos_Jugados=&Ordenacion=&NPcd_PageLines=20`;
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(URL, { waitUntil: 'networkidle2' });

  try {
    await page.click('button#btnAceptar'); 
    await page.waitForTimeout(1000);
  } catch {
    console.log('No se encontró el botón de aceptar cookies.');
  }

  await page.waitForSelector('.table-striped');

  const html = await page.content();
  await browser.close();

  const cheerio = await import('cheerio');
  const $ = cheerio.load(html);
  const partidos = parsePartidos($);

  const htmlTemplate = fs.readFileSync('./template.html', 'utf-8');
  const dom = new JSDOM(htmlTemplate);
  const { document } = dom.window;

  const contenedor = document.querySelector('#contenedor');

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
        partidoDiv.innerHTML = `<div class="competicion">${partido.competicion}</div><div class="linea">
        <div class="hora">${partido.hora}</div>
        <div class="equipos"><p style="color:red;display: inline">${partido.local} </p><img width="20px" src="icono-vs.jpeg"><p style="color:#3283e6;display: inline"> ${partido.visitante}</p></div>
        <div class="campo">${partido.campo}</div>
      </div>`;
      }else{
        partidoDiv.innerHTML = `<div class="competicion">${partido.competicion}</div><div class="linea">
        <div class="hora">${partido.hora}</div>
        <div class="equipos"><p style="color:#3283e6;display: inline">${partido.local}</p> <img width="20px" src="icono-vs.jpeg"> <p style="color:red;display: inline">${partido.visitante}</p></div>
        <div class="campo">${partido.campo}</div>
      </div>`;
      }
      
      contenedor.appendChild(partidoDiv);
    }
  }

  // Guarda HTML actualizado para previsualizar
  fs.writeFileSync('./output/preview.html', dom.serialize());
  console.log("Archivo HTML generado. Ábrelo en navegador y usa jsPDF con html2canvas para exportar como PDF.");
}

main();

