
// je dois me localiser
navigator.geolocation.getCurrentPosition((coord)=>{
    console.log(coord)
    let latitude = coord.coords.latitude
    let longitude = coord.coords.longitude

    let url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min&hourly=temperature_2m,weather_code&current=temperature_2m,weather_code`

    fetch(url)
    .then(rep=>{
        return rep.json()
    })
    .then(data=>{
        console.log(data)
        
        //afficher temps du jour
        afficheTempsDuJour(data.current.weather_code, data.current.temperature_2m)
       
        //changer arrière plan
        arrierePlanBody(data.current.weather_code)
        
        //carousel autres jour
        afficheAutreJour(data.daily)
    })

    
})


//role: affiche le temps et la température du jour 
//dans la div qui a la classe current
//parametres: code, température
//return: rien elle affiche 

function afficheTempsDuJour(code,temperature){
    document.querySelector(".current").innerHTML = 
    `<div class="picto-weather picto-${transformeCodeEnMot(code)}"></div>
                <p class="tmax">${temperature}°C</p>`

}


//role: Transformé le code reçu en un meteo
//parametres:le code
//return: le mot

function transformeCodeEnMot(code){
    if(code == 0){
		// clear sky
		return "sun"
	}else if(code >=1 && code < 45 ){
		// partialy cloudy
		return "suncloud"
	}else if(code >=45 && code < 61){
		// foggy & cloudy
		return "cloud"
	}else if((code >=61 && code < 71) ||(code >=80 && code < 85) ){
		// Rainy
		return "rain"
	}else if((code >=71 && code < 77) || (code>= 85 && code<95 )){
		// snow
		return "snow"
	}else if(code>95){
		// thunder
		return "thunder"
	}else{
		return "coucou"
	}
}

//role: donner au body la bonne classe css pour afficher l'arrière plan
//parametres: code
//return: rien

function arrierePlanBody(code){

    let nomDeClasse = "bg-weather-" + transformeCodeEnMot(code)

    document.querySelector("body").classList.add(nomDeClasse)
}


//role:construire des petites carte pour le temps des jour suivant et qui les affiche dans la div carousel-daily-container
//parametres: meteoDesJour, un objet
//return: non elle affiche

function afficheAutreJour(meteoDesJour){

    let template = ""

    for(i=1; i<7; i++){
        //i pour me balader dans les tableaux

        let picto = transformeCodeEnMot(meteoDesJour.weather_code[i])

        template += `  <div class="dayly-weather">
                    <h4>${meteoDesJour.time[i]}</h4>
                    <div class="minipicto minipicto-${picto}"></div>
                    <h3 class="tmax">${meteoDesJour.temperature_2m_max[i]}°C</h3>
                    <h3 class="tmin">${meteoDesJour.temperature_2m_min[i]}°C</h3>  
                </div>`
    }

    document.querySelector(".carousel-daily-container").innerHTML = template
}