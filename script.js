const PRECOS = {
    saciedade: 90,
    fortificante: 90,
    sono: 500,
    limpeza: 500
};

function calcular() {
    const qSac = parseInt(document.getElementById('qtd-elixir').value) || 0;
    const qFor = parseInt(document.getElementById('qtd-ensopado').value) || 0;
    const qSon = parseInt(document.getElementById('qtd-sono').value) || 0;
    const qLim = parseInt(document.getElementById('qtd-limpeza').value) || 0;

    const totalBruto = (qSac * PRECOS.saciedade) + (qFor * PRECOS.fortificante) + (qSon * PRECOS.sono) + (qLim * PRECOS.limpeza);
    const repasse = totalBruto * 0.30;
    const liquido = totalBruto - repasse;

    document.getElementById('bruto').innerText = `R$ ${totalBruto}`;
    document.getElementById('repasse').innerText = `R$ ${repasse}`;
    document.getElementById('liquido').innerText = `R$ ${liquido}`;
}

document.querySelectorAll('input[type="number"]').forEach(input => {
    input.addEventListener('input', calcular);
});

function salvarVenda() {
    const e = document.getElementById('qtd-elixir').value;
    const f = document.getElementById('qtd-ensopado').value;
    const s = document.getElementById('qtd-sono').value;
    const l = document.getElementById('qtd-limpeza').value;
    const valor = document.getElementById('bruto').innerText;

    if (valor === "R$ 0") return alert("Adicione rituais antes de selar a venda!");

    const venda = {
        id: Date.now(),
        data: new Date().toLocaleString('pt-BR'),
        detalhes: `Saciedade: ${e} | Fort: ${f} | Sono: ${s} | Limp: ${l}`,
        valor: valor
    };

    let historico = JSON.parse(localStorage.getItem('vendas_archavon_v2')) || [];
    historico.push(venda);
    localStorage.setItem('vendas_archavon_v2', JSON.stringify(historico));
    
    alert("Venda selada no histórico local!");
    zerarCampos();
}

function zerarCampos() {
    document.querySelectorAll('input[type="number"]').forEach(i => i.value = 0);
    calcular();
}

function gerarPDF() {
    const historico = JSON.parse(localStorage.getItem('vendas_archavon_v2')) || [];
    if (historico.length === 0) return alert("Não há registros ocultos para exportar.");

    const tabela = document.getElementById('pdf-tabela');
    tabela.innerHTML = "";
    let somaTotal = 0;

    historico.forEach(v => {
        somaTotal += parseInt(v.valor.replace('R$ ', ''));
        tabela.innerHTML += `<tr>
            <td style="border:1px solid #000000; padding:10px;">${v.data}</td>
            <td style="border:1px solid #000000; padding:10px;">${v.detalhes}</td>
            <td style="border:1px solid #000000; padding:10px; text-align:right;">${v.valor}</td>
        </tr>`;
    });

    document.getElementById('pdf-total').innerText = `R$ ${somaTotal}`;
    document.getElementById('pdf-data-relatorio').innerText = new Date().toLocaleDateString('pt-BR');

    const content = document.getElementById('pdf-content');
    document.getElementById('pdf-area').style.display = 'block';
    
    const opt = {
        margin: 0.5,
        filename: 'relatorio_archavon.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(content).save().then(() => {
        document.getElementById('pdf-area').style.display = 'none';
    });
}

function limparHistorico() {
    if (confirm("Deseja expurgar todo o registro de turno deste navegador?")) {
        localStorage.removeItem('vendas_archavon_v2');
        alert("Histórico limpo!");
    }
}