const mapBoxToken = 'pk.eyJ1IjoiaGlkcmFuIiwiYSI6ImNrN3Z4YXd1ZzFidGUzZXBneThlNjhlZ2cifQ.MA7_4jQcrFPSxRv5kwldGg';
export function getConfig() {
    return  {
        mapBoxToken :mapBoxToken ,
        mapZoom:6,
        dataNationUrl: 'https://github.com/pcm-dpc/COVID-19/blob/master/dati-json/dpc-covid19-ita-andamento-nazionale.json',
        dataRegionUrl: 'https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-regioni.json',
        tileId:'mapbox/streets-v11',
		
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
			'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		
       
        tileLayer: 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' +mapBoxToken
       
       };
}
