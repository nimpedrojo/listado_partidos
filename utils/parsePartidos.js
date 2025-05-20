export function parsePartidos($) {
    const partidos = [];
    
    // Seleccionamos la tabla principal de partidos
    const table = $('table.table-striped.table-light');

    // Recorremos cada bloque de fecha: thead + tbody
    const theads = table.find('thead');
    const tbodies = table.find('tbody');

    theads.each((i, thead) => {
        const $thead = $(thead);
        const dateRow = $thead.find('tr').first();
        const dateText = dateRow.find('span.font_responsive').text().trim();
        const currentDate = dateText.split(',')[0];

        const $tbody = $(tbodies[i]);
        $tbody.find('tr').each((_, row) => {
            
            const cells = $(row).find('td');
            if (cells.length > 5) {
                // Celda 1: equipos (local <br> visitante)
                const equiposHtml = cells.eq(1).html() || '';
                const equiposText = equiposHtml.replace(/<br\s*\/?>/gi, ' vs ').replace(/&nbsp;/g, '').trim();
                // Celda 4: campo
                const campo = cells.eq(4).text().trim();
                // Celda 5: hora
                const hora = cells.eq(5).text().trim();
                if (hora != 'Resultado'){
                    partidos.push({
                        fecha: currentDate,
                        hora,
                        campo,
                        equipos: equiposText                        
                    });
                }
                
            }
        });
    });

    return partidos;
}
