export function drawPie(eleid, regionData, region = 'Lombardia') {

    const div = document.getElementById(eleid);
    const dataRegion = regionData.filter(reg => reg['denominazione_regione'] === region);
    const reg = dataRegion[dataRegion.length - 1]
    const dati = [
        ['Casi', 'Totali'],
        ['Totali casi ' + new Number(reg.totale_casi).toLocaleString(), reg.totale_casi],
        ['Tamponi ' + reg.tamponi.toLocaleString(), reg.tamponi],
        ['Deceduti ' + reg.deceduti.toLocaleString(), reg.deceduti],

        ['In ospedale ' + reg.totale_ospedalizzati.toLocaleString(), reg.totale_ospedalizzati],

        [
            'Positivi', +reg['totale_attualmente_positivi'].toLocaleString()
        ]
        ,
        [
            'Ricoverati', +reg['ricoverati_con_sintomi'].toLocaleString()
        ]
    ];

    const data = google.visualization.arrayToDataTable(dati);
    var options = {
        legend: true,
        pieSliceText: 'value',
        title: 'Dati di ' + region + ', oggi: ' + moment(reg.data).format('DD/MM/YYYY'),
        pieStartAngle: 100,
    };

    //  alert(JSON.stringify(dati))
    var chart = new google.visualization.PieChart(document.getElementById('reg-piechart'));
    chart.draw(data, options);

}

export function drawVisualization(eleid, dataRegion, region = 'Lombardia') {

    const div = document.getElementById(eleid);
    const dati = [
        ['Region', 'Casi', 'Tamponi', 'Deceduti', 'Ospedalizzati']
    ];
    dataRegion.forEach(reg => {
        // const tokens = reg.data.substring(0,12).split('-')
        const dateFormatted = new Date(reg.data)
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
