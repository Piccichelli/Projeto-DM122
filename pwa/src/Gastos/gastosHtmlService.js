export default class GastosHTMLService {

    constructor(gastosService) {
        this.gastosService = gastosService;

        this.form = document.getElementById('formGasto');
        this.container = document.getElementById('listaGastos');

        this.init();
    }

    init() {
        if(!this.form) return;

        this.form.addEventListener('submit', (event) => {
            event.preventDefault();

            const desc = document.getElementById('desc').value;
            const valor = parseFloat(document.getElementById('valor').value);
            const categoria = document.getElementById('categoria').value;
            const date = new Date(document.getElementById('data').value.split('/'));

            const novoGasto = {valor, categoria, desc, "data": date, "insertDate": new Date()};

            this.gastosService.insertData(novoGasto);

            this.form.reset();

            this.fillTable();
        });

        this.fillTable();
    }

    async fillTable() {
        const gastos = await this.gastosService.getAll();
        this.renderizarGastos(this.container, gastos);
    }


    agruparPorAnoEMes(gastos) {
        const agrupado = {};

        gastos.forEach(gasto => {
            const data = new Date(gasto.data);
            const ano = data.getFullYear();
            const mes = data.toLocaleString('pt-BR', { month: 'long' });
            console.log(gasto)

            if (!agrupado[ano]) {
                agrupado[ano] = {};
            }
            if (!agrupado[ano][mes]) {
                agrupado[ano][mes] = [];
            }

            agrupado[ano][mes].push(gasto);
        });

        return agrupado;
    }

    renderizarGastos(container, gastos) {
    container.innerHTML = '';

    const agrupado = this.agruparPorAnoEMes(gastos);

    // Ordena anos decrescentemente
    const anos = Object.keys(agrupado)
        .map(a => parseInt(a))
        .sort((a, b) => b - a);

    anos.forEach(ano => {
        const mesesDoAno = ["janeiro","fevereiro","março","abril","maio","junho",
                            "julho","agosto","setembro","outubro","novembro","dezembro"];
        
        // Filtra meses que têm pelo menos 1 gasto
        const mesesComGastos = Object.keys(agrupado[ano])
            .filter(mes => agrupado[ano][mes] && agrupado[ano][mes].length > 0)
            .sort((a, b) => mesesDoAno.indexOf(b) - mesesDoAno.indexOf(a));

        if (mesesComGastos.length === 0) return; // pula ano se não tiver gastos

        const divAno = document.createElement('div');
        divAno.classList.add('mb-8');

        const h1Ano = document.createElement('h1');
        h1Ano.textContent = ano;
        h1Ano.classList.add('text-2xl', 'font-bold', 'mb-4');
        divAno.appendChild(h1Ano);

        mesesComGastos.forEach(mes => {
            const gastosDoMes = agrupado[ano][mes];

            const divMes = document.createElement('div');
            divMes.classList.add('mb-6');

            const h2Mes = document.createElement('h2');
            h2Mes.classList.add('text-xl', 'font-semibold', 'cursor-pointer', 'mb-2', 'flex', 'items-center', 'justify-between');

            h2Mes.innerHTML = `
                <span>${mes}</span>
                <span class="material-icons transition-transform duration-200 transform">expand_more</span>
            `;
            divMes.appendChild(h2Mes);
            

            const tabela = document.createElement('table');
            tabela.classList.add('table-auto', 'w-full', 'border-collapse', 'hidden', 'rounded-lg', 'overflow-hidden', 'shadow');

            // Cabeçalho
            const thead = document.createElement('thead');
            thead.innerHTML = `
                <tr class="bg-blue-600 text-white">
                    <th class="px-4 py-2 text-left">Descrição</th>
                    <th class="px-4 py-2 text-left">Valor</th>
                    <th class="px-4 py-2 text-left">Categoria</th>
                    <th class="px-4 py-2 text-left">Data</th>
                    <th class="px-4 py-2 text-center">Excluir</th>
                </tr>
            `;
            tabela.appendChild(thead);

            const tbody = document.createElement('tbody');

            gastosDoMes.forEach((gasto, index) => {
                const tr = document.createElement('tr');
                tr.id = `gasto-${gasto.id}`;
                tr.classList.add(index % 2 === 0 ? 'bg-white' : 'bg-gray-100', 'hover:bg-gray-200');
                tr.innerHTML = `
                    <td class="px-4 py-2 border">${gasto.desc}</td>
                    <td class="px-4 py-2 border">R$ ${gasto.valor.toFixed(2)}</td>
                    <td class="px-4 py-2 border">${gasto.categoria}</td>
                    <td class="px-4 py-2 border">${new Date(gasto.data).toLocaleDateString('pt-BR')}</td>
                    <td class="px-4 py-2 border text-red-600 cursor-pointer delete-btn text-center">🗑️</td>
                `;

                const btnDelete = tr.querySelector('.delete-btn');
                btnDelete.addEventListener('click', async () => {
                    await this.gastosService.deleteData(gasto.id);
                    this.fillTable();
                });

                tbody.appendChild(tr);
            });

            tabela.appendChild(tbody);
            divMes.appendChild(tabela);

            // Toggle da tabela ao clicar no mês
            h2Mes.addEventListener('click', () => {
                tabela.classList.toggle('hidden');
            });

            divAno.appendChild(divMes);
        });

        container.appendChild(divAno);
    });
}


    
}