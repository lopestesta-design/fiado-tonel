// Funções para Entradas
function salvarEntrada(valor, forma, taxa, data){
    let entradas = JSON.parse(localStorage.getItem('entradas')) || [];
    entradas.push({valor: parseFloat(valor), forma, taxa: parseFloat(taxa), data});
    localStorage.setItem('entradas', JSON.stringify(entradas));
}

// Funções para Saídas
function salvarSaida(valor, descricao, data){
    let saidas = JSON.parse(localStorage.getItem('saidas')) || [];
    saidas.push({valor: parseFloat(valor), descricao, data});
    localStorage.setItem('saidas', JSON.stringify(saidas));
}

// Funções para Fiado
function salvarFiado(cliente, valor, pagamento, data){
    let fiados = JSON.parse(localStorage.getItem('fiados')) || [];
    fiados.push({cliente, valor: parseFloat(valor), pagamento, data});
    localStorage.setItem('fiados', JSON.stringify(fiados));
}

// Funções para Clientes
function salvarCliente(nome){
    let clientes = JSON.parse(localStorage.getItem('clientes')) || [];
    clientes.push({nome});
    localStorage.setItem('clientes', JSON.stringify(clientes));
}

// Cálculos de Totais
function calcularTotais(){
    let entradas = JSON.parse(localStorage.getItem('entradas')) || [];
    let saidas = JSON.parse(localStorage.getItem('saidas')) || [];
    let fiados = JSON.parse(localStorage.getItem('fiados')) || [];

    let totalEntradas = entradas.reduce((acc,e)=> acc + e.valor - e.taxa, 0);
    let totalSaidas = saidas.reduce((acc,s)=> acc + s.valor, 0);
    let totalFiado = fiados.reduce((acc,f)=> acc + f.valor,0);
    
    return {totalEntradas, totalSaidas, totalFiado, saldo: totalEntradas - totalSaidas};
}

// Exemplo de uso do cálculo
function mostrarResumo(){
    let res = calcularTotais();
    console.log("Entradas: R$", res.totalEntradas.toFixed(2));
    console.log("Saídas: R$", res.totalSaidas.toFixed(2));
    console.log("Fiado: R$", res.totalFiado.toFixed(2));
    console.log("Saldo: R$", res.saldo.toFixed(2));
}

// Deixar disponível no console para teste
window.calcularTotais = calcularTotais;
window.mostrarResumo = mostrarResumo;
