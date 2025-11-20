import './WeatherDetail.js';

export class WeatherDetails extends HTMLElement {
	constructor() {
		super();
	}

	/* Specify observed attributes for the custom element */
	static get observedAttributes() {
		return ['data-items'];
	}

	/* Called when an observed attribute is changed */
	attributeChangedCallback(name, oldValue, newValue) {
		if (name === 'data-items' && oldValue !== newValue) {
			this.render();
		}
	}

	/* Called when the element is added to the DOM */
	connectedCallback() {
		this.render();
	}

	/* Renders the weather details */
	render() {
		const details = this.getAttribute('data-items');
		if (!details || details === "") return;
		
		let items = JSON.parse(details) || [];

		this.innerHTML = items.map(item => `
            <weather-detail 
                icon="${item.icon}" 
                value="${item.val}" 
                label="${item.label}">
            </weather-detail>
        `).join('');
		
		this.className = 'weather-details';
	}
}

customElements.define('weather-details', WeatherDetails);