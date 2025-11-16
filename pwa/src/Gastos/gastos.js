import GastosHTMLService from './gastosHtmlService.js';
import GastosService from './gastosService.js';

class GastosApp {
    constructor() {
        document.addEventListener("DOMContentLoaded", () => {
            console.log("[Gastos.js] Iniciado!");
            const gastosService = new GastosService();
            this.gastosHTML = new GastosHTMLService(gastosService);
        });
    }
}

new GastosApp();