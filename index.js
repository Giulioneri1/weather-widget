import './components/WeatherDetails.js';
import './components/Forecast.js';
import { getWeatherIconClass } from './js/utils.js';
import { fetchGeoData, fetchWeatherData, fetchForecastData, processForecastData } from './js/api.js';

const cities = ["London", "Milan", "Bangkok", "Los Angeles", "Nairobi"];

/* Get carousel elements */
const slider = document.getElementById('slider-wrapper');
const pagination = document.getElementById('pagination');

/* City images mapping */
const cityImages = {
	"London": "./img/london.webp",
	"Milan": "./img/duomo-milano.jpg",
	"Bangkok": "./img/bangkok.jpg",
	"Los Angeles": "./img/los-angeles.webp",
	"Nairobi": "./img/nairobi.webp"
};

const defaultCity = "London";
const defaultCityImage = cityImages[defaultCity] || "./img/london.webp";

// Swipe Logic (Intersection Observer)
const observer = new IntersectionObserver((entries) => {
	entries.forEach(entry => {

		/* Check if the slide is intersecting (visible) */
		if (entry.isIntersecting) {
			const index = [...slider.children].indexOf(entry.target);
			const cityName = cities[index];

			// Update Background
			changeBackground(cityName);

			// Update Dots
			document.querySelectorAll('.dot').forEach((d, i) => {
				d.classList.toggle('active', i === index);
			});
		}
	});
}, { threshold: 0.5 }); // Starts observing when 50% of the slide is visible

/**
 * Initializes the weather application by creating slides for each city,
 * fetching weather data, and setting up the carousel functionality.
 */
async function initApp() {
	slider.innerHTML = ''; // Clear previous slides
	pagination.innerHTML = ''; // Clear previous dots

	/* Create slides for each city */
	cities.forEach((city, index) => {

		/* Create slide element */
		const currentSlide = document.createElement('div');
		currentSlide.className = 'weather-slide';
		currentSlide.id = `slide-${index}`;

		/* Create HMTL template for the slide */
		currentSlide.innerHTML = getSlideHTMLTemplate(city);

		slider.appendChild(currentSlide);

		/* Create pagination dot */
		const dot = document.createElement('button');
		dot.className = `dot ${index === 0 ? 'active' : ''}`;
		dot.setAttribute('aria-label', `Vai alla meteo di ${city}`);

		/* Add click event to navigate to the corresponding slide */
		dot.addEventListener('click', () => {
			currentSlide.scrollIntoView({ behavior: 'smooth' });
		});

		pagination.appendChild(dot);

		observer.observe(currentSlide); // Start observing the slide

		// Retrieve and populate weather data for the slide
		loadSlideData(city, currentSlide);
	});

	/* Set background for the first city */
	changeBackground(cities[0]);

	setupTabNavigation();
	setupNavigation();
}

/**
 * 
 * @param {string} city 
 * @returns {string}
 * This function returns the HTML template for a weather slide for a given city
 */
function getSlideHTMLTemplate(city) {
	return `
        <header>
            <h2 class="location">${city}</h2>
            <p class="description"></p>
        </header>

        <div class="current-weather">
            <div class="weather-main">
                <div class="weather-temp-icon">
                    <i class="weather-icon" aria-hidden="true"></i>
					<div class="temperature">
                        <span class="temp-value">--</span>
                        <span class="temp-unit" aria-hidden="true">°</span>
                    </div>
                </div>
                
                <div class="weather-max-min">
					<span class="sr-only">Minima:</span>
                    <span class="min-temp">--</span> 
                    <span aria-hidden="true">/</span> 
                    <span class="sr-only">Massima:</span>
                    <span class="max-temp">--</span>
                </div>
            </div>

            <weather-details></weather-details>
        </div>

        <weather-forecast></weather-forecast>
    `;
}

/**
 * 
 * @param {string} city 
 * @param {HTMLElement} slideElement
 * This function fetches weather data for a given city and updates the provided slide element
 * with the fetched data.
 */
async function loadSlideData(city, slideElement) {
	try {
		/* Get city geo data required to fetch weather data (lat, lon) and name */
		const cityData = await fetchGeoData(city);
		if (!cityData) throw new Error("City geo data not found");

		/* Fetch weather and forecast data in parallel */
		const [weatherData, forecastData] = await Promise.all([
			fetchWeatherData(cityData.cityName, cityData.lat, cityData.lon),
			fetchForecastData(cityData.lat, cityData.lon)
		]);

		/* Update current weather section */
		if (weatherData) updateCurrentWeather(slideElement, weatherData);

		/* Update forecast section */
		if (forecastData) {
			const dailyForecasts = processForecastData(forecastData.list);
			updateForecast(slideElement, dailyForecasts);
		}
	} catch (error) {
		slideElement.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Impossibile caricare i dati per ${city}</p>
            </div>
        `;
		console.error(error);
	}
}

/**
 * 
 * @param {HTMLElement} slide
 * @param {Object} weatherData
 * This function updates the current weather section of a slide with the provided weather data
 */
function updateCurrentWeather(slide, weatherData) {
	const location = slide.querySelector('.location');
	location.textContent = `${weatherData.location}`;

	const descriptionElement = slide.querySelector('.description');
	descriptionElement.textContent = `${weatherData.weatherDescription}`;

	const tempElement = slide.querySelector('.temp-value');
	tempElement.textContent = `${weatherData.temperature}`;

	const maxTempElement = slide.querySelector(".max-temp");
	const minTempElement = slide.querySelector(".min-temp");
	maxTempElement.textContent = `${weatherData.maxTemp}°`;
	minTempElement.textContent = `${weatherData.minTemp}°`;

	const weatherIconElement = slide.querySelector('.weather-icon');
	const iconClass = getWeatherIconClass(weatherData.weatherIconCode);
	weatherIconElement.innerHTML = `<i class="${iconClass}"></i>`;

	// Update additional weather details
	const weatherDetailsElement = slide.querySelector('weather-details');
	const details = [
		{ icon: "fas fa-tint", val: `${weatherData.humidity}%`, label: "Humidity" },
		{ icon: "fas fa-wind", val: `${weatherData.windSpeed} m/s`, label: "Wind" },
		{ icon: "fas fa-eye", val: `${weatherData.visibility} km`, label: "Visibility" },
	];
	weatherDetailsElement.setAttribute('data-items', JSON.stringify(details));
}

/**
 * 
 * @param {HTMLElement} slide 
 * @param {Object} dailyForecasts
 * This function updates the forecast section of a slide with weekly forecast data
 */
function updateForecast(slide, dailyForecasts) {
	const forecastComp = slide.querySelector('weather-forecast');
	const len = Object.values(dailyForecasts).length;

	const forecastArray = Object.values(dailyForecasts).slice(0, len);
	forecastComp.setAttribute('data-forecast', JSON.stringify(forecastArray));
}

/**
 * 
 * @param {string} city
 * This function changes the background image based on the selected city 
 */
function changeBackground(city) {
	const bgImage = document.getElementById('bg-image');

	const imageUrl = cityImages[city] || defaultCityImage;
	bgImage.style.backgroundImage = `url('${imageUrl}')`;
}

/**
 * This function sets up keyboard navigation for the pagination dots
 * to allow cycling through them using the TAB key.
 */
function setupTabNavigation() {
    const pagination = document.getElementById('pagination');

    pagination.addEventListener('keydown', (e) => {
        if (e.key !== 'Tab') return; // Exit if the pressed key is not TAB

        const dots = pagination.querySelectorAll('.dot');
        const firstDot = dots[0];
        const lastDot = dots[dots.length - 1];

        // Pressing TAB on the LAST dot
        if (!e.shiftKey && document.activeElement === lastDot) {
            e.preventDefault();
            firstDot.focus();
        }

        // Pressing SHIFT + TAB on the FIRST dot
        else if (e.shiftKey && document.activeElement === firstDot) {
            e.preventDefault();
            lastDot.focus();
        }
    });
}

/**
 * This function sets up keyboard navigation for the carousel slides
 * to allow cycling through them using the arrow keys.
 */
function setupNavigation() { 
	/* Listen for arrow key presses on the whole document */
    document.addEventListener('keydown', (e) => {
        
        // Exit if the pressed key is not an arrow key
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;

        // Find current active dot and its index
        const dots = Array.from(document.querySelectorAll('.dot'));
        const activeDot = document.querySelector('.dot.active');
        
        // If no active dot, default to the first one
        let currentIndex = activeDot ? dots.indexOf(activeDot) : 0;

        let nextIndex;

		/* Determine the next index based on the pressed key */
        if (e.key === 'ArrowRight') {
			/* Use modulo to wrap around to the first dot */
            nextIndex = (currentIndex + 1) % dots.length;
        } else {
            nextIndex = (currentIndex - 1 + dots.length) % dots.length;
        }

        // Simulate a click on the next dot to navigate
        dots[nextIndex].click();
        
        // Move focus to the new active dot
        dots[nextIndex].focus();
    });
}

initApp();
