export class WeatherMain extends HTMLElement {
	constructor() {
		super();
	}

	/* Specify observed attributes for the custom element */
	static get observedAttributes() {
		return ['data-current'];
	}

	/* Called when an observed attribute is changed */
	attributeChangedCallback(name, oldValue, newValue) {
		if (name === 'data-current' && oldValue !== newValue) {
			this.render();
		}
	}

	/* Called when the element is added to the DOM */
	connectedCallback() {
		this.render();
	}

	/* Renders the current weather information */
	render() {
		const currentData = this.getAttribute('data-current');
		if (!currentData) return;

		const data = JSON.parse(currentData);

		this.innerHTML = `
			<div class="weather-temp-icon">
                <i class="weather-icon ${data.iconClass}" aria-hidden="true"></i>
				<div class="temperature">
                    <span class="temp-value">${data.temp}</span>
                    <span class="temp-unit" aria-hidden="true">°</span>
                </div>
            </div>    
            <div class="weather-max-min">
				<span class="sr-only">MIN:</span>
                <span class="min-temp">${data.tempMin}°</span>
                <span aria-hidden="true">/</span> 
                <span class="sr-only">MAX:</span>
                <span class="max-temp">${data.tempMax}°</span>
            </div>
		`;

		this.className = 'weather-main';
	}
}

customElements.define('weather-main', WeatherMain);