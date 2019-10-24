// _ = helper functions
function _parseMillisecondsIntoReadableTime(timestamp) {
  //Get hours from milliseconds
  const date = new Date(timestamp * 1000);
  // Hours part from the timestamp
  const hours = '0' + date.getHours();
  // Minutes part from the timestamp
  const minutes = '0' + date.getMinutes();
  // Seconds part from the timestamp (gebruiken we nu niet)
  // const seconds = '0' + date.getSeconds();

  // Will display time in 10:30(:23) format
  return hours.substr(-2) + ':' + minutes.substr(-2); //  + ':' + s
}

// 5 TODO: maak updateSun functie

const updateSun = function(timePassedPercent) {
  const sunLocation = document.querySelector('.js-sun');

  if (timePassedPercent <= 50) {
    sunLocation.style.bottom = timePassedPercent * 2 + '%';
    sunLocation.style.left = timePassedPercent + '%';
  } else {
    sunLocation.style.bottom = (100 - timePassedPercent) * 2 + '%';
    sunLocation.style.left = timePassedPercent + '%';
  }
  sunLocation.setAttribute(
    'data-time',
    _parseMillisecondsIntoReadableTime(Math.floor(Date.now() / 1000))
  );
};

// 4 Zet de zon op de juiste plaats en zorg ervoor dat dit iedere minuut gebeurt.
let placeSunAndStartMoving = (totalMinutes, sunrise) => {
  // In de functie moeten we eerst wat zaken ophalen en berekenen.
  // Haal het DOM element van onze zon op en van onze aantal minuten resterend deze dag.
  // Bepaal het aantal minuten dat de zon al op is.
  // Nu zetten we de zon op de initiële goede positie ( met de functie updateSun ). Bereken hiervoor hoeveel procent er van de totale zon-tijd al voorbij is.
  // We voegen ook de 'is-loaded' class toe aan de body-tag.
  // Vergeet niet om het resterende aantal minuten in te vullen.
  // Nu maken we een functie die de zon elke minuut zal updaten
  // Bekijk of de zon niet nog onder of reeds onder is
  // Anders kunnen we huidige waarden evalueren en de zon updaten via de updateSun functie.
  // PS.: vergeet weer niet om het resterend aantal minuten te updaten en verhoog het aantal verstreken minuten.

  // selecting time left text
  const time = document.querySelector('.js-time-left');

  // some math...
  const timePassed = Math.floor(Date.now() / 1000) - sunrise;
  const timePassedPercent = (timePassed / totalMinutes) * 100;
  const timeleft = Math.floor((totalMinutes - timePassed) / 60);

  // setting the time text
  if (timeleft < 0) {
    time.innerHTML = 0;
    document.querySelector('html').classList.remove('is-day');
    document.querySelector('html').classList.add('is-night');
  } else {
    document.querySelector('html').classList.add('is-day');
    time.innerHTML = timeleft;
  }

  // update the suns position
  updateSun(timePassedPercent);

  // adding is-loaded class
  const bodyLoaded = document.querySelector('body');
  bodyLoaded.classList.add('is-loaded');
};

// 3 Met de data van de API kunnen we de app opvullen
let showResult = queryResponse => {
  // We gaan eerst een paar onderdelen opvullen
  // Zorg dat de juiste locatie weergegeven wordt, volgens wat je uit de API terug krijgt.
  // Toon ook de juiste tijd voor de opkomst van de zon en de zonsondergang.
  // Hier gaan we een functie oproepen die de zon een bepaalde positie kan geven en dit kan updaten.
  // Geef deze functie de periode tussen sunrise en sunset mee en het tijdstip van sunrise.

  // selecting the elements
  const locatie = document.querySelector('.js-location');
  const sunrise = document.querySelector('.js-sunrise');
  const sunset = document.querySelector('.js-sunset');

  // filling them in
  locatie.innerHTML = queryResponse.city.name;
  sunrise.innerHTML = _parseMillisecondsIntoReadableTime(
    queryResponse.city.sunrise
  );
  sunset.innerHTML = _parseMillisecondsIntoReadableTime(
    queryResponse.city.sunset
  );

  // calculating daytime & sunrisetime
  const daytime = queryResponse.city.sunset - queryResponse.city.sunrise;
  placeSunAndStartMoving(daytime, queryResponse.city.sunrise);
};

// 2 Aan de hand van een longitude en latitude gaan we de yahoo wheater API ophalen.
let getAPI = (lat, lon) => {
  // Eerst bouwen we onze url op
  // Met de fetch API proberen we de data op te halen.
  // Als dat gelukt is, gaan we naar onze showResult functie.
  fetch(
    `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=bba80dd8d02b49823e67467f61c8351a&units=metric&lang=nl&cnt=1`
  )
    .then(function(response) {
      if (!response.ok) {
        throw Error(`Probleem bij de fetch(). Status Code: ${response.status}`);
      } else {
        console.info('Er is een response teruggekomen van de server');
        return response.json();
      }
    })
    .then(function(jsonObject) {
      console.info('json object is aangemaakt');
      console.info('verwerken data');
      showResult(jsonObject);
    })
    .catch(function(error) {
      console.error(`fout bij verwerken json ${error}`);
    });
};

document.addEventListener('DOMContentLoaded', function() {
  // 1 We will query the API with longitude and latitude.
  getAPI(50.8027841, 3.2097454);
  setInterval(function() {
    getAPI(50.8027841, 3.2097454);
  }, 60 * 1000);
  console.log('DOM content loaded :-)');
});
