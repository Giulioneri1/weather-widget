import { capitalizeWords, getWeatherIconClass } from "../js/utils.js";

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

		const list = days.map(day => {
			const dayName = capitalizeWords(day.day);
			const iconClass = getWeatherIconClass(day.iconCode);

			return `
			<div class="forecast-day">
				<span class="day-name">${dayName}</span>
				<i class="${iconClass} day-icon" aria-hidden="true"></i>
				<div class="temp-container">
                    <span class="sr-only">Minima</span>
                	<span class="day-temp-min">${day.min}°</span> 
                	<span aria-hidden="true">/</span>
                	<span class="sr-only">Massima</span>
                	<span class="day-temp-max">${day.max}°</span>
                </div>
			</div>
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