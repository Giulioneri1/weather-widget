export class ForecastDay extends HTMLElement {
	constructor() {
		super();
	}

	/* Called when the element is added to the DOM */
	connectedCallback() {
		const dayName = this.getAttribute('day-name') || '';
		const iconClass = this.getAttribute('icon-class') || '';
		const tempMin = this.getAttribute('temp-min') || '';
		const tempMax = this.getAttribute('temp-max') || '';

		this.innerHTML = `
			<span class="day-name">${dayName}</span>
            <i class="${iconClass} day-icon" aria-hidden="true"></i>
            <div class="temp-container">
                <span class="sr-only">Mininum</span>
                <span class="day-temp-min">${tempMin}°</span> 
                <span aria-hidden="true">/</span>
                <span class="sr-only">Maximun</span>
                <span class="day-temp-max">${tempMax}°</span>
            </div>
		`;

		this.className = 'forecast-day';
	}
}

customElements.define('forecast-day', ForecastDay);