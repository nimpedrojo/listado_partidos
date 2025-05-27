import {APIConstants} from '../utils/constants.js';
import fs from 'fs';
import { JSDOM } from 'jsdom';
/** Renderiza la tabla HTML */
export default function renderTabla(partidos) {
  
    const htmlTemplate = fs.readFileSync('./src/core/render/template.html', 'utf-8');
    const dom = new JSDOM(htmlTemplate);
    const { document } = dom.window;
    const imagenvs = APIConstants.IMAGE_VS;
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
    return dom.serialize();
}