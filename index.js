// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const locationElement = document.querySelector('.location');
    const countryFlagElement = document.querySelector('.country-flag');
    const weatherIcon = document.querySelector('.weather-icon');
    const temperatureElement = document.querySelector('.temperature');
    const descriptionElement = document.querySelector('.description');
    const humidityElement = document.querySelector('.humidity');
    const latitude_longitudeElement = document.querySelector('.latitudelongitude');
    const windspeedElement = document.querySelector('.wind-speed'); // Select the wind-speed element

    // Function to update the weather card with fetched data
    async function updateWeatherCard(weatherData) {
        locationElement.textContent = `${weatherData.name}, ${weatherData.sys.country}`;
        temperatureElement.textContent = `${weatherData.main.temp}°C`;
        descriptionElement.textContent = weatherData.weather[0].description;
        humidityElement.textContent = `Humidity: ${weatherData.main.humidity}%`;
        latitude_longitudeElement.textContent = `Latitude & Longitude: ${weatherData.coord.lat}°N & ${weatherData.coord.lon}°E`;
        windspeedElement.textContent = `Wind Speed: ${weatherData.wind.speed} km/h`;

        try {
            // Fetch and display country flag based on the country code
            const countryCode = weatherData.sys.country;
            const countryFlagUrl = await fetchCountryFlagUrl(countryCode);
            countryFlagElement.src = countryFlagUrl;
        } catch (error) {
            console.error('Error fetching country flag:', error);
            countryFlagElement.src = 'fallback-country-flag.png';
        }

        // Display weather icon
        weatherIcon.src = `https://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`;
        weatherIcon.onerror = () => {
            weatherIcon.src = 'fallback-weather-icon.png';
        };
    }

    // Function to fetch the country flag URL
    async function fetchCountryFlagUrl(countryCode) {
        const apiUrl = `https://restcountries.com/v2/alpha/${countryCode.toLowerCase()}`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch country flag');
        }

        return data.flags.png;
    }

    // Function to fetch weather data using the OpenWeatherMap API
    function fetchWeatherData(city) {
        const apiKey = 'f2c6cd8c7baf12a91bb5880fee6d7378';
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.cod === 200) {
                    updateWeatherCard(data);
                } else {
                    console.error('Error:', data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    // Function to handle search button click
    function onSearchButtonClick() {
        const searchInput = document.getElementById('searchInput');
        const city = searchInput.value.trim();
        if (city !== '') {
            fetchWeatherData(city);
            searchInput.value = ''; // Clear the search input after fetching weather data
        }
    }

    // Attach click event listener to the search button
    const searchButton = document.getElementById('searchButton');
    searchButton.addEventListener('click', onSearchButtonClick);
});
