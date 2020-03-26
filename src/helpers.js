import {
    getConfig
} from './config';
import {drawVisualization, drawPie} from './charts'

export function isSameDay(a, b) {

    return a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()

}

export function getCachedData() {
    let res = {
        regions: [],
        data: [],
        todaysData: []
    };
    const olddata = localStorage.getItem('cacheData');
    if (!olddata) {

        return res;
    }

    try {
        const cacheData = JSON.parse(olddata);

        if (!cacheData) {
            return res;
        }

        if (
            isSameDay(new Date(cacheData.created_at), new Date())
        ) {

            return cacheData;
        }

    } catch (e) {
        return res;
    }
}

export async function getData() {
    let cacheData = getCachedData();
    console.log(cacheData);
    if (cacheData && cacheData.data.length) {
        return cacheData;
    }
    const {
        dataRegionUrl
    } = getConfig();

    const data = await fetch(dataRegionUrl).then(res => res.json());
    console.log('fetch', data);
    const regions = {};

    let todaysData = data.filter(
        ele => {
            const today = new Date();
            return isSameDay(new Date(ele.data), today)
        }
    );
    if (!todaysData.length) {
        todaysData = data.filter(
            ele => {
                const today = new Date();
                const yesterday = new Date(
                    today.getFullYear(),
                    today.getMonth(),
                    today.getDate() - 1
                );

                return isSameDay(new Date(ele.data), yesterday)
            }
        );
    }
    data.forEach(reg => {

        regions[reg['denominazione_regione']] = {
            lat: reg.lat,
            long: reg.long
        }

    });
    cacheData = {
        created_at: (new Date()).getTime(),
        data: data,
        regions,
        todaysData
    };
    localStorage.setItem('cacheData', JSON.stringify(cacheData));
    return cacheData;
}


export function showData(region = 'Lombardia', ele = 'all_div') {

    getData().then(res => {


        const data = res.data.filter(data => data['denominazione_regione'] === region);


        drawVisualization(ele, data, region);
        drawPie('reg-piechart', data, region);
    })
        .catch(e => alert(e));

}

export function updateGraph(ele) {

    showData(ele.value);


}

export function filterData(dati, region = 'Lombardia') {


    return dati.filter(data => data['denominazione_regione'] === region)
}

export async function setLatLong(map) {
// Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const {mapZoom} = getConfig();
                map.setView([
                    position.coords.latitude,
                    position.coords.longitude], mapZoom);
            }, function () {
                handleLocationError();
            });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError();
    }


    function handleLocationError() {

    }


}

export function renderJsonTable(tableId, tabledata) {
    const data = tabledata.map(
        ele =>({...ele,data:ele.data.substring(0,10)})).sort((d1, d2) => d1.data < d2.data);
    const numberWidth = 200;
    const formatterParams ={
        decimal:',',
        thousand:'.',
        symbol:'£',
        symbolAfter:'E',
        precision:false,
    }
    const cols = [
        {
            field: 'data', title: 'Data', sorter: 'date',
            formatterParams:{
                inputFormat:'YYYY-MM-DD',
                outputFormat:'DD/MM/YY',
                invalidPlaceholder:'(invalid date)'
            },
            width: numberWidth, sorterParams: {format: 'YYYY-MM-DD'}
        },


        {
            field: 'denominazione_regione', title: 'Regione',
            width: 250, headerFilter: 'select'
        },
        {
            field: 'totale_casi', title: 'Totale casi', width: numberWidth ,formatterParams, sorter:'number'
        },
        {
            field: 'deceduti', title: 'Deceduti', width: numberWidth ,formatterParams, sorter:'number'
        }
        ,
        {
            field: 'totale_ospedalizzati', title: 'Totale ospedalizzati', width: numberWidth,
           formatterParams, sorter:'number'
        }
        ,
        {
            field: 'totale_attualmente_positivi', title: 'totale positivi', width: numberWidth ,formatterParams, sorter:'number'
        }
        ,
        {
            field: 'ricoverati_con_sintomi', title: 'Ricoverati con sintomi', width: numberWidth
            ,formatterParams, sorter:'number'
        },
        {
            field: 'nuovi_attualmente_positivi', title: 'Nuovi positivi', width: numberWidth ,formatterParams, sorter:'number'
        }
        ,

        {
            field: 'terapia_intensiva', title: 'Terapia intensiva', width: numberWidth ,formatterParams, sorter:'number'
        }

        ,
        {
            field: 'isolamento_domiciliare', title: 'Isolamento domiciliare', width: numberWidth ,formatterParams, sorter:'number'
        }
        ,


        {
            field: 'dimessi_guariti', title: 'Dismessi guariti', width: numberWidth ,formatterParams, sorter:'number'
        }

        ,
        {
            title: 'Tamponi', field: 'tamponi', width: numberWidth ,formatterParams, sorter:'number'

        }
    ];
const langs =   {
        'en-gb':{
            'columns':{
                'data':'Date', //replace the title of column name with the value 'Name',
                'deceduti': 'date'

            },
            'ajax':{
                'loading':'Loading', //ajax loader text
                    'error':'Error', //ajax error text
            },
            'groups':{ //copy for the auto generated item count in group header
                'item':'item', //the singular  for item
                    'items':'items', //the plural for items
            },
            'pagination':{
                'page_size':'Page Size', //label for the page size select element
                    'first':'First', //text for the first page button
                    'first_title':'First Page', //tooltip text for the first page button
                    'last':'Last',
                    'last_title':'Last Page',
                    'prev':'Prev',
                    'prev_title':'Prev Page',
                    'next':'Next',
                    'next_title':'Next Page',
            },
            'headerFilters':{
                'default':'filter column...', //default header filter placeholder text
                    'columns':{
                    'name':'filter name...', //replace default header filter text for column name
                }
            }
        }
    };
    const table = new Tabulator('#' + tableId, {
        langs,
      //  groupBy:'denominazione_regione',
        width:'960px',
        height: 405, // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
        data: data, //assign data to table
        layout:'fitDataFill',
        responsiveLayout:'hide',
        columns: cols   ,pagination:'local',
        paginationSize:50,
        paginationSizeSelector:[10, 20, 50, 100],
        movableColumns:true,
    });
    table.setSort([
   //     {column:"denominazione_regione", dir:"asc"}, //then sort by this second
        {column:"date", dir:"desc"} //sort by this first

    ]);
    const trigger = document.querySelector('#sort-trigger');
/*
    trigger.addEventListener('click', function () {
        const f = document.querySelector('#sort-field');
        const d = document.querySelector('#sort-direction');
        table.setSort(f.value, d.value);
    });
    */

}
