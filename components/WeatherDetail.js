export class WeatherDetail extends HTMLElement {
    constructor() {
        super();
    }

    /* Called when the element is added to the DOM */
    connectedCallback() {
        const icon = this.getAttribute('icon') || '';
        const value = this.getAttribute('value') || '';
        const label = this.getAttribute('label') || '';
        this.innerHTML = `
            <i class="${icon}"></i>
            <span>${value}</span>
            <span class="detail-label">${label}</span>  
        `;

        this.className = 'detail-item';
    }
}

customElements.define('weather-detail', WeatherDetail);
