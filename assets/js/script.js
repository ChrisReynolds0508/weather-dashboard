
const apiKey = 'b2c0cada2a454973fb405fd2c759c8e5'; // OpenWeatherMap API key

const submitBtn = document.getElementById('submitBtn');
const locationInput = document.getElementById('locationInput');
const locationElement = document.getElementById('location');
const temperatureElement = document.getElementById('temperature');
const descriptionElement = document.getElementById('description');
const humidityElement = document.getElementById('humidity');
const windSpeedElement = document.getElementById('windSpeed');
const weatherIconElement = document.getElementById('weatherIcon');

submitBtn.addEventListener('click', () => {
  const location = locationInput.value.trim();

  if (location) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        displayWeather(data);
      })
      .catch(error => {
        console.error('Fetch error:', error);
        alert('Unable to fetch weather. Please try again.');
      });
  } else {
    alert('Please enter a location.');
  }
});

function displayWeather(data) {
  locationElement.textContent = `Weather in ${data.name}, ${data.sys.country}`;
  temperatureElement.textContent = `Temperature: ${data.main.temp} °C`;
  descriptionElement.textContent = `Description: ${data.weather[0].description}`;
  humidityElement.textContent = `Humidity: ${data.main.humidity} %`;
  windSpeedElement.textContent = `Wind Speed: ${data.wind.speed} m/s`;
  weatherIconElement.src = `http://openweathermap.org/img/w/${data.weather[0].icon}.png`;
  weatherIconElement.alt = `${data.weather[0].main} Icon`;
}