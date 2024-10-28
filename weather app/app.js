// script.js

const apiKey = '72ebe1670136bdf91d94f116c916a58b'; // Your API Key
const weatherInfo = document.getElementById('weatherInfo');
const getWeatherBtn = document.getElementById('getWeatherBtn');
const locationInput = document.getElementById('locationInput');
const getCurrentLocationBtn = document.getElementById('getCurrentLocationBtn');
const loading = document.getElementById('loading');

// Show loading while fetching data
function showLoading() {
    loading.style.display = 'block';
    weatherInfo.innerHTML = ''; // Clear previous info
}

// Hide loading when data is fetched
function hideLoading() {
    loading.style.display = 'none';
}

// Fetch weather data when button is clicked
getWeatherBtn.addEventListener('click', () => {
    const location = locationInput.value;
    if (location) {
        showLoading();
        getWeatherData(location);
    } else {
        alert('Please enter a location.');
    }
});

// Fetch weather data from OpenWeatherMap API
function getWeatherData(location) {
    const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;

    fetch(apiURL)
        .then(response => {
            if (!response.ok) {
                throw new Error('City not found');
            }
            return response.json();
        })
        .then(data => {
            hideLoading();
            displayWeatherData(data);
        })
        .catch(error => {
            hideLoading();
            console.error('Error fetching weather data:', error);
            weatherInfo.innerHTML = 'Error fetching weather data. Please try again.';
        });
}

// Display weather data
function displayWeatherData(data) {
    weatherInfo.innerHTML = `
        <div class="weather-data">Location: ${data.name}, ${data.sys.country}</div>
        <div class="weather-data">Temperature: ${data.main.temp}°C</div>
        <div class="weather-data">Weather: ${data.weather[0].description}</div>
        <div class="weather-data">Humidity: ${data.main.humidity}%</div>
        <div class="weather-data">Wind Speed: ${data.wind.speed} m/s</div>
    `;
}

// Get weather data based on user's current location
getCurrentLocationBtn.addEventListener('click', () => {
    if (navigator.geolocation) {
        showLoading();
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            const apiURL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
            
            fetch(apiURL)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Location not found');
                    }
                    return response.json();
                })
                .then(data => {
                    hideLoading();
                    displayWeatherData(data);
                })
                .catch(error => {
                    hideLoading();
                    console.error('Error fetching weather data:', error);
                    weatherInfo.innerHTML = 'Error fetching weather data. Please try again.';
                });
        }, () => {
            hideLoading();
            alert('Unable to retrieve your location');
        });
    } else {
        alert('Geolocation is not supported by your browser');
    }
});