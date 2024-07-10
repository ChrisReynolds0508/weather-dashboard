
const apiKey = 'b2c0cada2a454973fb405fd2c759c8e5'; // OpenWeatherMap API key

const submitBtn = document.getElementById('submitBtn');
const locationInput = document.getElementById('locationInput');
const locationElement = document.getElementById('location');
const temperatureElement = document.getElementById('temperature');
const descriptionElement = document.getElementById('description');
const humidityElement = document.getElementById('humidity');
const windSpeedElement = document.getElementById('windSpeed');
const weatherIconElement = document.getElementById('weatherIcon');
const forecastContainer = document.getElementById('forecast');

document.addEventListener('DOMContentLoaded', () => {
    const searchHistory = JSON.parse(localStorage.getItem ('weatherSearchHistory')) || []; // Get search history from local storage
    renderSearchHistory(searchHistory); // Display search history
  });

submitBtn.addEventListener('click', () => {
    const location = locationInput.value.trim();
  
    if (location) {
      const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`;
  
      // Fetch current weather
      fetch(currentWeatherUrl)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          console.log(data);
          displayCurrentWeather(data);
        })
        .catch(error => {
          console.error('Fetch error:', error);
          alert('Unable to fetch weather. Please try again.');
        });
  
      // Fetch 5-day forecast
      fetch(forecastUrl)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          console.log(data);
          displayForecast(data);
        })
        .catch(error => {
          console.error('Fetch error:', error);
          alert('Unable to fetch forecast. Please try again.');
        });
    } else {
      alert('Please enter a location.');
    }
    return addToSearchHistory(location);
  });

function displayCurrentWeather(data) {
  locationElement.textContent = `Weather in ${data.name}, ${data.sys.country}`;
  temperatureElement.textContent = `Temperature: ${data.main.temp} °C`;
  descriptionElement.textContent = `Description: ${data.weather[0].description}`;
  humidityElement.textContent = `Humidity: ${data.main.humidity} %`;
  windSpeedElement.textContent = `Wind Speed: ${data.wind.speed} m/s`;
  weatherIconElement.src = `http://openweathermap.org/img/w/${data.weather[0].icon}.png`;
  weatherIconElement.alt = `${data.weather[0].main} Icon`;
}


function displayForecast(data) {
    forecastContainer.innerHTML = ''; // Clear previous forecast elements
  
    // Loop through forecast data (every 3 hours for 5 days, total 40 items)
    for (let i = 0; i < data.list.length; i += 8) { // Fetching data for every 3 hours (8 times a day)
      const forecastItem = data.list[i];
      const forecastDate = new Date(forecastItem.dt * 1000); // Convert UNIX timestamp to milliseconds
  
      const forecastElement = document.createElement('div');
      forecastElement.classList.add('forecast-item');
      forecastElement.innerHTML = `
        <h3>${forecastDate.toLocaleDateString('en-US', { weekday: 'short' })}</h3>
        <img src="http://openweathermap.org/img/w/${forecastItem.weather[0].icon}.png" alt="${forecastItem.weather[0].main} Icon">
        <p>${forecastItem.weather[0].description}</p>
        <p>Temp: ${forecastItem.main.temp} °C</p>
        <p>Humidity: ${forecastItem.main.humidity} %</p>
      `;
      forecastContainer.appendChild(forecastElement);
    }
  }

  function addToSearchHistory(location) {
    let searchHistory = JSON.parse(localStorage.getItem('weatherSearchHistory')) || [];
    // Ensure location is not already in the search history
    if (!searchHistory.includes(location)) {
      // Limit search history to 5 entries (adjust as needed)
      if (searchHistory.length >= 5) {
        searchHistory.shift(); // Remove the oldest entry
      }
      searchHistory.push(location); // Add new location to the end
      localStorage.setItem('weatherSearchHistory', JSON.stringify(searchHistory));
      renderSearchHistory(searchHistory);
    }
  }
  
  function renderSearchHistory(history) {
    searchHistoryContainer.innerHTML = ''; // Clear previous history
  
    history.forEach(item => {
      const historyItem = document.createElement('div');
      historyItem.textContent = item;
      historyItem.classList.add('search-history-item');
      historyItem.addEventListener('click', () => {
        locationInput.value = item; // Set location input value to clicked history item
        submitBtn.click(); // Simulate click on submit button to fetch weather
      });
      searchHistoryContainer.appendChild(historyItem);
    });
  }