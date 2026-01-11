
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector('input');
const but = document.getElementById('btn');
const tod = document.getElementsByClassName('today');
const cityName = document.getElementById('city');
const temperature = document.getElementById('tempnumber');
const dandt = document.getElementById('daydate');
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const date = new Date();
const day = days[date.getDay()];
//final try
async function checkWeather(city) {
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
    if(response.status == 404){
        document.querySelector(".error").style.display = "block"; // Show an error message
        document.querySelector(".weather").style.display = "none"; // Hide the weather card
    } 
    else {
        var data = await response.json();

        cityName.textContent = data.name;
        const todayIcon = data.weather[0].icon;
        document.getElementsByClassName('today')[0].src = `https://openweathermap.org/img/wn/${todayIcon}@2x.png`;
        temperature.textContent = data.main.temp + '\u2103';
        document.getElementById('weathertype').textContent = data.weather[0].description;
        dandt.textContent = day + "," + date.toLocaleDateString();
        getForecast(city);

        document.getElementsByClassName('today')[1].src = `https://openweathermap.org/img/wn/${todayIcon}@2x.png`;
    
        document.getElementById('humidity').textContent = data.main.humidity+"%";
        document.getElementById('wind').textContent = data.wind.speed+" Km/h";
        document.getElementById('pressure').textContent = data.main.pressure+" HPa";
    }
    
}

but.addEventListener("click", function () { checkWeather(searchBox.value); });

const forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?units=metric&q=";
async function getForecast(city) {
    const response = await fetch(forecastUrl + city + `&appid=${apiKey}`);
    const foredata = await response.json();
    const dailyForecast = foredata.list.filter(item => item.dt_txt.includes("12:00:00"));
    console.log(dailyForecast);

    document.getElementsByClassName('day2')[0].textContent = days[(date.getDay() + 1) % 7];
    document.getElementsByClassName('day3')[0].textContent = days[(date.getDay() + 2) % 7];
    document.getElementsByClassName('day4')[0].textContent = days[(date.getDay() + 3) % 7];
    document.getElementsByClassName('day5')[0].textContent = days[(date.getDay() + 4) % 7];


    const icontwo = dailyForecast[1].weather[0].icon;
    const iconthree = dailyForecast[2].weather[0].icon;
    const iconfour = dailyForecast[3].weather[0].icon;
    const iconfive = dailyForecast[4].weather[0].icon;
    document.getElementsByClassName('two')[0].src = `https://openweathermap.org/img/wn/${icontwo}@2x.png`;
    document.getElementsByClassName('three')[0].src = `https://openweathermap.org/img/wn/${iconthree}@2x.png`;
    document.getElementsByClassName('four')[0].src = `https://openweathermap.org/img/wn/${iconfour}@2x.png`;
    document.getElementsByClassName('five')[0].src = `https://openweathermap.org/img/wn/${iconfive}@2x.png`;

    document.getElementsByClassName('temp2')[0].textContent = dailyForecast[1].main.temp + '\u2103';
    document.getElementsByClassName('temp3')[0].textContent = dailyForecast[2].main.temp + '\u2103';
    document.getElementsByClassName('temp4')[0].textContent = dailyForecast[3].main.temp + '\u2103';
    document.getElementsByClassName('temp5')[0].textContent = dailyForecast[4].main.temp + '\u2103';
}
