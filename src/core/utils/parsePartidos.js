export function parsePartidos($) {

    var competicion='';
    const partidos = [];
    const table = $('table.table-striped.table-light');
    const theads = table.find('thead');
    const tbodies = table.find('tbody');

    theads.each((i, thead) => {
        const $thead = $(thead);
        const dateRow = $thead.find('tr').first();
        competicion=dateRow.next().find('th').first().next().text().split("Grupo")[0].replace(",","");
        const dateText = dateRow.find('span.font_responsive').text().trim();
        const currentDate = dateText.split(',')[0];
        const $tbody = $(tbodies[i]);

        $tbody.find('tr').each((_, row) => {
            const cells = $(row).find('td');

            if (cells.length > 5) {
                const equiposHtml = cells.eq(1).html() || '';
                const equiposText = equiposHtml.replace(/<br\s*\/?>/gi, ' vs ').replace(/&nbsp;/g, '').trim();
                const equipoLocal= equiposText.split('vs')[0].trim();
                const equipoVisitante= equiposText.split('vs')[1].trim();
                const campo = cells.eq(4).text().trim();
                const hora = cells.eq(5).text().trim();

                if (hora != 'Resultado'){
                    partidos.push({fecha: currentDate,hora,campo,local:equipoLocal,visitante:equipoVisitante,equipos: equiposText,competicion:competicion});
                } else {
                    competicion = cells.eq(1).text().split("Grupo")[0].replace(",","");
                }
            }
        });
    });

    return partidos;
}
