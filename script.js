
const searchBox = document.querySelector("input");
const but = document.getElementById("btn");

const cityName = document.getElementById("city");
const temperature = document.getElementById("tempnumber");
const dandt = document.getElementById("daydate");

const days = [
    "Sunday", "Monday", "Tuesday",
    "Wednesday", "Thursday", "Friday", "Saturday"
];

async function fetchWeather(city, type = "weather") {
    const response = await fetch(
        `/api/weather?city=${encodeURIComponent(city)}&type=${type}`
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || data.error || "Unable to fetch weather");
    }

    return data;
}

function showError(message) {
    const errorElement = document.querySelector(".error");
    const weatherElement = document.querySelector(".weather");

    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = "block";
    }

    if (weatherElement) {
        weatherElement.style.display = "none";
    }
}

function hideError() {
    const errorElement = document.querySelector(".error");
    const weatherElement = document.querySelector(".weather");

    if (errorElement) {
        errorElement.style.display = "none";
    }

    if (weatherElement) {
        weatherElement.style.display = "block";
    }
}

async function checkWeather(city) {
    city = city.trim();

    if (!city) {
        showError("Please enter a city name.");
        return;
    }

    but.disabled = true;

    try {
        const data = await fetchWeather(city);

        const today = new Date();
        const day = days[today.getDay()];

        cityName.textContent = data.name;

        const todayIcon = data.weather[0].icon;

        document.getElementsByClassName("today")[0].src =
            `https://openweathermap.org/img/wn/${todayIcon}@2x.png`;

        temperature.textContent = Math.round(data.main.temp) + "℃";

        document.getElementById("weathertype").textContent =
            data.weather[0].description;

        dandt.textContent =
            day + ", " + today.toLocaleDateString();

        document.getElementsByClassName("today")[1].src =
            `https://openweathermap.org/img/wn/${todayIcon}@2x.png`;

        document.getElementById("humidity").textContent =
            data.main.humidity + "%";

        document.getElementById("wind").textContent =
            data.wind.speed + " m/s";

        document.getElementById("pressure").textContent =
            data.main.pressure + " hPa";

        hideError();

        await getForecast(city);

    } catch (error) {
        console.error("Weather error:", error);
        showError(error.message || "Something went wrong.");
    } finally {
        but.disabled = false;
    }
}

async function getForecast(city) {
    const foredata = await fetchWeather(city, "forecast");

    const dailyForecast = foredata.list.filter(item =>
        item.dt_txt.includes("12:00:00")
    );

    const availableDays = dailyForecast.slice(0, 4);

    const classes = ["two", "three", "four", "five"];
    const tempClasses = ["temp2", "temp3", "temp4", "temp5"];
    const dayClasses = ["day2", "day3", "day4", "day5"];

    const today = new Date();

    availableDays.forEach((item, index) => {
        const forecastDate = new Date(item.dt * 1000);
        const icon = item.weather[0].icon;

        document.getElementsByClassName(classes[index])[0].src =
            `https://openweathermap.org/img/wn/${icon}@2x.png`;

        document.getElementsByClassName(tempClasses[index])[0].textContent =
            Math.round(item.main.temp) + "℃";

        document.getElementsByClassName(dayClasses[index])[0].textContent =
            days[forecastDate.getDay()];
    });
}

but.addEventListener("click", () => {
    checkWeather(searchBox.value);
});

// Search using Enter key
searchBox.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        checkWeather(searchBox.value);
    }
});
