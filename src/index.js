/*
Data provided by 
*/
import {getCachedData,
     getData,isSameDay,
    
      filterData,
      showData,
      updateGraph,
      setLatLong
    } from './helpers';

    import {
         drawLatestVisualization,
         drawVisualization
        
       } from './charts';
import{getConfig}  from './config';
       

 



   
      

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
        combo.addEventListener('change',(e)=>{
            updateGraph(e.target);
        }
      
        );
          const oldvalue = combo.value;
          combo.options.remove(0);
        regionArr.sort().forEach(ele =>{
         combo.options.add(new Option(ele,ele))  ; 
        });
        combo.value = oldvalue;
    });
 
});

window.addEventListener('load', function() {

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
    const { regions, todaysData}= regdata;
    
       if(regions){
         const regionNames = Object.keys(regions);
        
         const firstReg = regions[regionNames[0]]
         mymap.setView([firstReg.lat,firstReg.long], 5);
setLatLong(mymap);
         regionNames.forEach(name=>{
             const regData = regions[name];
             const firstRegionData = filterData(todaysData, name);
             
             const {deceduti,data:whatDate, totale_casi:casi}=firstRegionData [0];
             
    L.circleMarker([regData.lat,regData.long],
                {
                    tooltip: name,
                    name,
                    casi,
                    deceduti,
                    color: 'red',
                    radius: Math.round((casi/3000) * 7)
                }
                    ).addTo(mymap).bindPopup(e=>{
                        const {name,deceduti, casi} = e.options;
                        
                        showData(name);
                        combo.value = name
                        const html = '<p>'+ name  + '  '+casi +' casi</p>';
                              html += '<p>Deceduti '+ deceduti  +' </p>'
                    },{autoClose: true});
                   
    
         });
    
         }

   });
    
    

});
