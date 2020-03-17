/*
Data provided by 
*/
const regions = [
    "Veneto",
    "Valle d'Aosta",
    "Umbria",
     "P.A. Trento",
     "Toscana",
     "Sicilia",
    "Sardegna",
    "Puglia",
    "Piemonte",
    "Molise",
    "Marche",
    "Lombardia",
     "Liguria",
     "Lazio",
    "Friuli Venezia Giulia",
    "Emilia Romagna",
    "Campania",
     "Calabria",
    "P.A. Bolzano",
    "Basilicata",
    "Abruzzo"
];

       
function filterData(dati, region ='Lombardia'){

    
    return dati.filter(data=> data.denominazione_regione === region).map(d => {
        return  [moment(d.data).format('DD MMM '), d.totale_casi];
       
       
    });
     
 

}
        
        function showData(region ='Lombardia',ele='all_div'){

    getData().then(res=>{
      
    
    const data = res.data.filter(data=> data.denominazione_regione === region).map(d => {
        return  [moment(d.data).format('DD MMM '), d.totale_casi];
       
       
    });
     
       
  drawVisualization(ele,data, region);
})
        .catch(e=> alert(e));
    
}




   
        function updateGraph(ele){
            
            showData(ele.value);
            
        }

document.addEventListener('DOMContentLoaded', function(){
    getData().then( regdata =>{
        console.log(regdata)
        const { regions, data, todaysData}= regdata;
        const regionArr = Object.keys(regions);
        google.charts.setOnLoadCallback(()=>{
            drawVisualization('all_div',filterData(data));
            drawLatestVisualization('latest_div',todaysData);
        });
        const combo = document.querySelector('#regions');
          const oldvalue = combo.value;
          combo.options = [];
        regionArr.sort().forEach(ele =>{
         combo.options.add(new Option(ele,ele))  ; 
        });
        combo.value = oldvalue;
    });
 
});

window.addEventListener('load', () =>{

    var mymap = L.map('mapid');
    const combo = document.querySelector('#regions');

    const {tileLayer, attribution, tileId} = getConfig();
    L.tileLayer(tileLayer, {
        maxZoom: 18,
        attribution,
        id: tileId,
		
		tileSize: 512,
		zoomOffset: -1
    }).addTo(mymap);
    
   getData().then( regdata =>{
    const { regions, data, todaysData}= regdata;
    
       if(regions){
         const regionNames = Object.keys(regions);
         const firstReg = regions[regionNames[0]]
         mymap.setView([firstReg.lat,firstReg.long], 5);
         regionNames.forEach(name=>{
             const regData = regions[name];
             const [whatDate, casi] = filterData(todaysData, name)[0];
             console.log('whatdate', whatDate, casi);
            var marker =L.circleMarker([regData.lat,regData.long],
                {
                    tooltip: name,
                    name,
                    casi,
                    color: 'red',
                    radius: Math.round((casi/2000) * 7)
                }
                    ).addTo(mymap).bindPopup(e=>{
                        const name = e.options.name;
                        const casi = e.options.casi;
                        showData(name);
                        combo.value = name
                        return name + ' '+ casi + ' casi'
                    },{autoClose: true});
                   
    
         });
    
         }

   });
    
    

});
