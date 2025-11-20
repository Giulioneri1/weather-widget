import { capitalizeWords, getWeatherIconClass } from "../js/utils.js";
import "./ForecastDay.js";

export class WheatherForecast extends HTMLElement {
	constructor() {
		super();
	}

	/* Specify observed attributes for the custom element */
	static get observedAttributes() {
		return ['data-forecast'];
	}

	/* Called when an observed attribute is changed */
	attributeChangedCallback(name, oldValue, newValue) {
		if (name === 'data-forecast' && oldValue !== newValue) {
			this.render();
		}
	}

	/* Called when the element is added to the DOM */
	connectedCallback() {
		this.render();
	}

	/* Renders the weekly weather forecast */
	render() {
		const forecastData = this.getAttribute('data-forecast');
		if (!forecastData) return;

		let days = JSON.parse(forecastData) || [];

		const header = `
            <div class="forecast-header">
                <i class="fa-regular fa-calendar"></i>
                <p>Weekly forecast</p>
            </div>
        `;

		/* Generate list of forecast days elements */
		const list = days.map(day => {
			const dayName = capitalizeWords(day.day);
			const iconClass = getWeatherIconClass(day.iconCode);
			const tempMin = day.min;
			const tempMax = day.max;

			return `
			<forecast-day 
				day-name="${dayName}" 
				icon-class="${iconClass}"
				temp-min="${tempMin}"
				temp-max="${tempMax}">
			</forecast-day>
			`;
		}).join('');

		this.innerHTML = `
            ${header}
            <div class="forecast-list">
                ${list}
            </div>
        `;

		this.className = 'forecast';
	}
}

customElements.define('weather-forecast', WheatherForecast);