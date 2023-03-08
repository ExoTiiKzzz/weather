const API_KEY = '13d6e4bbe2a84bd7b68154543230103 ';
const iframe = document.querySelector('iframe');
const datetime = document.querySelector('.datetime');
const city = document.querySelector('.city');
const temperature = document.querySelector('.temperature');
const description = document.querySelector('.description');
const minMax = document.querySelector('.min-max');
const pressure = document.querySelector('.pressure');
const humidity = document.querySelector('.humidity');
const visibility = document.querySelector('.visibility');
const morning = document.querySelector('.morning');
const evening = document.querySelector('.evening');
const night = document.querySelector('.night');

const forecast = document.querySelector('.forecast');
const form = document.querySelector('form');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    await callApi(
        {
            q: form.querySelector('input').value,
        }
    );
});

const callApi = async (body) => {
    body.key = API_KEY;
    body.lang = 'fr';
    body.days = 8;
    let url = 'http://api.weatherapi.com/v1/forecast.json';
    //add the body to the url
    let bodyParams = Object.keys(body).map(key => key + '=' + body[key]).join('&');
    url += '?' + bodyParams;

    let req = fetch(url);
    let res = await req;
    let json = await res.json();

    datetime.textContent = new Date(json.location.localtime).toLocaleString();
    city.textContent = json.location.name + ', ' + json.location.country;
    temperature.querySelector('img').src = json.current.condition.icon;
    temperature.querySelector('.temp').textContent = json.current.temp_c + '°C';
    description.textContent = `Ressenti: ${json.current.feelslike_c}°C. ` + json.current.condition.text;
    minMax.textContent = `Min: ${json.forecast.forecastday[0].day.mintemp_c}°C / Max: ${json.forecast.forecastday[0].day.maxtemp_c}°C`;
    pressure.textContent = `Pression: ${json.current.pressure_mb}hPa`;
    humidity.textContent = `Humidité: ${json.current.humidity}%`;
    visibility.textContent = `Visibilité: ${json.current.vis_km}km`;

    morning.querySelector('.temp').textContent = json.forecast.forecastday[0].hour[9].temp_c + '°C';
    morning.querySelector('.feelslike').textContent = `Ressenti: ${json.forecast.forecastday[0].hour[9].feelslike_c}°C`;
    morning.querySelector('.description').textContent = json.forecast.forecastday[0].hour[9].condition.text;

    evening.querySelector('.temp').textContent = json.forecast.forecastday[0].hour[16].temp_c + '°C';
    evening.querySelector('.feelslike').textContent = `Ressenti: ${json.forecast.forecastday[0].hour[16].feelslike_c}°C`;
    evening.querySelector('.description').textContent = json.forecast.forecastday[0].hour[16].condition.text;

    night.querySelector('.temp').textContent = json.forecast.forecastday[0].hour[22].temp_c + '°C';
    night.querySelector('.feelslike').textContent = `Ressenti: ${json.forecast.forecastday[0].hour[22].feelslike_c}°C`;
    night.querySelector('.description').textContent = json.forecast.forecastday[0].hour[22].condition.text;

    forecast.innerHTML = `<div>Les prochains ${body.days} jours</div>`;
    json.forecast.forecastday.forEach(day => {
        forecast.innerHTML += `
            <div class="row">
                <div class="col-md-3 forecast_date">${new Date(day.date).toLocaleDateString()}</div>
                <div class="col-md-3 forecast_icon"><img src="${day.day.condition.icon}"></div>
                <div class="col-md-3 forecast_temp">${day.day.mintemp_c} / ${day.day.maxtemp_c}°C</div>
                <div class="col-md-3 forecast_condition">${day.day.condition.text}</div>
            </div>
        `;
    });

    //use openstreetmap to get the map and dezoom it
    iframe.src = `https://www.openstreetmap.org/export/embed.html?bbox=${json.location.lon - 0.5}%2C${json.location.lat - 0.5}%2C${json.location.lon + 0.5}%2C${json.location.lat + 0.5}&layer=mapnik&marker=${json.location.lat}%2C${json.location.lon}`;
}

document.addEventListener('DOMContentLoaded', async () => {
    await callApi({
        q: 'London',
    })
});
