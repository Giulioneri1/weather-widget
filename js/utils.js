/**
 * 
 * @param {string} str
 * @returns {string}
 * This function capitalizes the first letter of each word in a string 
 * and returns the formatted string
 */
export function capitalizeWords(str) {
	if (!str) return "";
	const words = str.split(" ");
	for (let i = 0; i < words.length; i++) {
		/* Capitalize first letter of each word */
		words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
	}

	// Join the words back into a single string
	return words.join(" ");
}

/**
 * 
 * @param {string} apiIconCode 
 * @returns {string}
 * This function maps OpenWeatherMap icon codes to Font Awesome icon classes
 */
export function getWeatherIconClass(apiIconCode) {
	const iconMap = {
		'01d': 'fas fa-sun',
		'01n': 'fas fa-moon',
		'02d': 'fas fa-cloud-sun',
		'02n': 'fas fa-cloud-moon',
		'03d': 'fas fa-cloud',
		'03n': 'fas fa-cloud',
		'04d': 'fas fa-cloud',
		'04n': 'fas fa-cloud',
		'09d': 'fas fa-cloud-showers-heavy',
		'09n': 'fas fa-cloud-showers-heavy',
		'10d': 'fas fa-cloud-sun-rain',
		'10n': 'fas fa-cloud-moon-rain',
		'11d': 'fas fa-bolt',
		'11n': 'fas fa-bolt',
		'13d': 'fas fa-snowflake',
		'13n': 'fas fa-snowflake',
		'50d': 'fas fa-smog',
		'50n': 'fas fa-smog'
	};

	return iconMap[apiIconCode] || 'fas fa-question'; // Default icon if not found
}