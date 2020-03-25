import {
    getConfig
} from './config';
 import {drawVisualization} from './charts'
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
    if(!todaysData.length){
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
        })
        .catch(e => alert(e));

}
export function updateGraph(ele) {

    showData(ele.value);

}

export function filterData(dati, region = 'Lombardia') {


    return dati.filter(data => data['denominazione_regione'] === region)
}
export async function setLatLong(map){
// Try HTML5 geolocation.
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(

        position => {
      const {mapZoom} = getConfig();
      map.setView([
           position.coords.latitude,
           position.coords.longitude], mapZoom);
    }, function() {
      handleLocationError();
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError();
  }


function handleLocationError() {

}
}
