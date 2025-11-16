import GastosService from "../Gastos/gastosService.js";

if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
        try {
            await navigator.serviceWorker.register('/pwa/sw.js');
            console.log('[SW] Registrado com sucesso!');
        } catch (err) {
            console.error('[SW] Falha ao registrar:', err);
        }
    });
}


class HomeApp {
    constructor() {
        this.gastosService = new GastosService();

        document.addEventListener("DOMContentLoaded", () => {
            this.updateResumo();
        });
    }

    // Função para comparar se duas datas são o mesmo dia
    sameDay(d1, d2) {
        return d1.getFullYear() === d2.getFullYear() &&
               d1.getMonth() === d2.getMonth() &&
               d1.getDate() === d2.getDate();
    }

    async updateResumo() {
        const gastos = await this.gastosService.getAll();

        const agora = new Date();

        let totalDia = 0;
        let totalMes = 0;
        let totalGeral = 0;

        gastos.forEach(gasto => {
            // Corrige o fuso horário para Brasília (UTC-3)
            const dataGasto = new Date(gasto.data);
            dataGasto.setHours(dataGasto.getHours() - 3);

            totalGeral += gasto.valor;

            // Total do mês
            if (dataGasto.getMonth() === agora.getMonth() && dataGasto.getFullYear() === agora.getFullYear()) {
                totalMes += gasto.valor;
            }

            // Total do dia
            if (this.sameDay(dataGasto, agora)) {
                totalDia += gasto.valor;
            }
        });

        // Atualiza os cards da Home
        const cards = document.querySelectorAll("section")[1].querySelectorAll("p");
        cards[0].textContent = `R$ ${totalDia.toFixed(2)}`;
        cards[1].textContent = `R$ ${totalMes.toFixed(2)}`;
        cards[2].textContent = `R$ ${totalGeral.toFixed(2)}`;
    }
}

new HomeApp();
