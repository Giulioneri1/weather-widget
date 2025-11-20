import { capitalizeWords } from './utils.js';

/* API key should not be here but I left it for demo purposes */
const API_KEY = "16223e6277a7ad84595573af30938def";
const defaultCity = "London";

/**
 * 
 * @param {string} url 
 * @returns {Promise<Object|null>}
 * This function fetches data from a given URL and returns the parsed JSON response
 */
async function fetchData(url) {
	try {
		const response = await fetch(url);
		if (!response.ok) throw new Error(response.statusText);
		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Error fetching data:", error);
		return null;
	}
}

/**
 * 
 * @param {string} city 
 * @returns {Promise<Object|null>}
 * This function fetches geographical data (latitude and longitude) for a given city
 * using the OpenWeatherMap Geocoding API. 
 */
export async function fetchGeoData(city) {
	if (!city) return null;
	const GEO_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`;
	const data = await fetchData(GEO_URL);
	if (!data || data.length === 0) return null;
	console.log(data);
	return {
		lat: data[0].lat,
		lon: data[0].lon,
		cityName: data[0].name
	};
}

/**
 * 
 * @param {string} lat 
 * @param {string} lon 
 * @returns {Promise<Object|null>}
 * This function fetches weather forecast data for given latitude and longitude
 */
export async function fetchForecastData(lat, lon) {
	const FORECAST_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}&lang=en`;
	const forecastData = await fetchData(FORECAST_URL);
	return forecastData;
}

/**
 * 
 * @param {string} city 
 * @param {string} lat 
 * @param {string} lon 
 * @returns {Promise<Object|null>}
 * This function fetches weather data for a given city using its latitude and longitude
 * and returns an object containing relevant weather information
 */
export async function fetchWeatherData(city, lat, lon) {
	const WEATHER_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}&lang=en`;
	const weatherData = await fetchData(WEATHER_URL);
	if (!weatherData) return null;
	return {
		location: city,
		temperature: Math.round(weatherData.main.temp),
		weatherIconCode: weatherData.weather[0].icon,
		maxTemp: Math.round(weatherData.main.temp_max),
		minTemp: Math.round(weatherData.main.temp_min),
		weatherDescription: capitalizeWords(weatherData.weather[0].description),
		humidity: weatherData.main.humidity,
		windSpeed: weatherData.wind.speed,
		visibility: weatherData.visibility / 1000 // convert to km
	}
}

/**
 * 
 * @param {Array} forecastList
 * @returns {Object} dailyForecasts
 * Process forecast data to get daily forecasts.
 * Daily entries are returned as block of 3 hours, so we need to
 * aggregate them to get daily max and min temperatures
 */
export function processForecastData(forecastList) {
	const dailyForecasts = {};
	const today = new Date().getDate();
	forecastList.forEach(entry => {
		/* Convert Unix timestamp to JS Date */
		const date = new Date(entry.dt * 1000);

		if (date.getDate() === today) return; // Skip today's date

		const day = date.toLocaleDateString('en-GB', { weekday: 'short' });
		const isDay = entry.sys.pod === 'd';

		/* Create new day entry if not exists */
		if (!dailyForecasts[day]) {
			dailyForecasts[day] = {
				day: day,
				iconCode: entry.weather[0].icon, // Initial icon at midnight (will be updated on next iterations)
				max: Math.round(entry.main.temp_max), // Initial max temp
				min: Math.round(entry.main.temp_min) // Initial min temp
			};
		}

		/* Temperature taken from each 3-hour entry */
		const temp = Math.round(entry.main.temp);

		/* Current icon code */
		const weatherIcon = dailyForecasts[day].iconCode;

		/* Update max and min temps */
		if (temp > dailyForecasts[day].max) dailyForecasts[day].max = temp;
		if (temp < dailyForecasts[day].min) dailyForecasts[day].min = temp;

		/* Update icon if it's daytime */
		if (weatherIcon.endsWith('n') && isDay) {
			dailyForecasts[day].iconCode = entry.weather[0].icon;
		}

	});
	return dailyForecasts;
}