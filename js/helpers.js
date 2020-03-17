function isSameDay (a, b){
  
    return a.getFullYear() === b.getFullYear() &&
       a.getMonth() === b.getMonth() &&
       a.getDate()=== b.getDate()
   
   }

   function getCachedData(){
     let res ={
         regions:[],
         data:[],
         todaysData: []
     }
    const olddata =    localStorage.getItem('cacheData');
    if(!olddata){
       
        return res;
    }
    
        try {
        const cacheData = JSON.parse(olddata);
      
        if(!cacheData){
            return res;
        }
      
            if(
                isSameDay(new Date(cacheData.created_at), new Date())
                ){
                    
                    return cacheData;
                }
        
    }catch(e) {
return ret;
        }
    
}

async function getData(){
    
    let cacheData = getCachedData();
    console.log(cacheData)

    if(cacheData.data.length){
      
        return cacheData;
    } 

    const {dataRegionUrl} = getConfig() ;
    
     data = await fetch(dataRegionUrl).then(res=>res.json());
     const regions = {};
      
     let todaysData = data.filter(
         ele => {
            const today = new Date();
            console.log(today.getFullYear(), today.getMonth(), today.getDate())
            const yesterday = new Date(
                today.getFullYear(), 
            today.getMonth(), 
            today.getDate()-1
            );
       
            return isSameDay( new Date(ele.data), today ) || isSameDay( new Date(ele.data), yesterday )
         }
     );
  if(!todaysData.length ){

  }
     data.forEach( reg =>{
       
            regions[reg.denominazione_regione] = {
                lat: reg.lat,
                long: reg.long
            }
        
     })
    cacheData = {
        created_at : (new Date()).getTime(),
        data : data,
        regions,
        todaysData
    }
   localStorage.setItem('cacheData', JSON.stringify(cacheData))
    return cacheData;
}

function drawVisualization(eleid, data1, region = 'Lombardia') {
         
    const div = document.getElementById(eleid);
    console.log(data1)
        var data = google.visualization.arrayToDataTable([
          ['Date', 'Cases'],
         ...data1
        ]);
  
        var options = {
          title: 'Corona virus for  '+region,
          legend: { position: 'top', maxLines: 3 },
          hAxis: {
            title: 'Data',
            minValue: 0
          },
          vAxis: {
            title: 'Casi'
             
          }
        };
  
        var chart = new google.visualization.ColumnChart(div);
  
        chart.draw(data, options);
        }
        function drawLatestVisualization(eleid, dataRegion) {
         
            const div = document.getElementById(eleid);
            const dati = [
                ['Region', 'Casi','Tamponi','Deceduti','Ospedalizzati']
            ];
            dataRegion.forEach( reg =>{
                dati.push([
                    reg.denominazione_regione,
                    reg.totale_casi,
                   reg.tamponi,
                    reg.deceduti,
                    reg.totale_ospedalizzati
                ])
            })
                var data = google.visualization.arrayToDataTable(dati);
          console.log(dati)
          var options = {
            width: 600,
            title:'Trend nazionale : ' + dataRegion[0].data,
            height: 500,
            legend: { position: 'top', maxLines: 3 },
            bar: { groupWidth: '75%' },
            isStacked: true,
          };
                var chart = new google.visualization.ColumnChart(div);
          
                chart.draw(data, options);
                }
                  