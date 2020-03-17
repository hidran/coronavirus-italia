export function drawVisualization(eleid, dataRegion, region = 'Lombardia') {

    const div = document.getElementById(eleid);
    const dati = [
        ['Region', 'Casi', 'Tamponi', 'Deceduti', 'Ospedalizzati']
    ];
    dataRegion.forEach(reg => {
       // const tokens = reg.data.substring(0,12).split('-')
         const dateFormatted = new Date( reg.data)
        dati.push([
            dateFormatted.toLocaleDateString(),
            reg.totale_casi,
            reg.tamponi,
            reg.deceduti,
            reg.totale_ospedalizzati
        ])
    });
    const options = {
        width: 600,
        title: 'Corona virus for : ' + region,
        height: 500,
        legend: {
            position: 'top',
            maxLines: 3
        },
        bar: {
            groupWidth: '75%'
        },
        isStacked: true,
    };
    const data = google.visualization.arrayToDataTable(dati);

    var chart = new google.visualization.ColumnChart(div);

    chart.draw(data, options);
}

export function drawLatestVisualization(eleid, dataRegion) {

    const div = document.getElementById(eleid);
    const dati = [
        ['Region', 'Casi', 'Tamponi', 'Deceduti', 'Ospedalizzati']
    ];
    dataRegion.forEach(reg => {
        dati.push([
            reg.denominazione_regione,
            reg.totale_casi,
            reg.tamponi,
            reg.deceduti,
            reg.totale_ospedalizzati
        ])
    })
    const data = google.visualization.arrayToDataTable(dati);
    console.log(dati)
    const options = {
        width: 600,
        title: 'Trend nazionale : ' + dataRegion[0].data,
        height: 500,
        legend: {
            position: 'top',
            maxLines: 3
        },
        bar: {
            groupWidth: '75%'
        },
        isStacked: true
    };
    var chart = new google.visualization.ColumnChart(div);

    chart.draw(data, options);
}
