// app.js
// Funções para Fiado, Entradas e Saídas
// Usa localStorage para salvar dados

// Salvar Fiado
function salvarFiado(cliente, valor, pagamento, data) {
  let fiados = JSON.parse(localStorage.getItem('fiados')) || [];
  fiados.push({ cliente, valor: parseFloat(valor), pagamento, data });
  localStorage.setItem('fiados', JSON.stringify(fiados));
}

// Salvar Entrada
function salvarEntrada(valor, forma, taxa, data) {
  let entradas = JSON.parse(localStorage.getItem('entradas')) || [];
  entradas.push({ valor: parseFloat(valor), forma, taxa: parseFloat(taxa||0), data });
  localStorage.setItem('entradas', JSON.stringify(entradas));
}

// Salvar Saída
function salvarSaida(valor, descricao, data) {
  let saidas = JSON.parse(localStorage.getItem('saidas')) || [];
  saidas.push({ valor: parseFloat(valor), descricao, data });
  localStorage.setItem('saidas', JSON.stringify(saidas));
}

// Função para calcular totais
function calcularTotais(tipo, periodo) {
  // tipo: 'fiados', 'entradas', 'saidas'
  let dados = JSON.parse(localStorage.getItem(tipo)) || [];
  if(periodo==='hoje'){
    let hoje = new Date().toISOString().slice(0,10);
    dados = dados.filter(d=>d.data===hoje);
  }
  if(periodo==='mes'){
    let hoje = new Date();
    let mes = hoje.getMonth();
    let ano = hoje.getFullYear();
    dados = dados.filter(d=>{
      let dt = new Date(d.data);
      return dt.getMonth()===mes && dt.getFullYear()===ano;
    });
  }
  if(periodo==='ano'){
    let ano = new Date().getFullYear();
    dados = dados.filter(d=>{
      let dt = new Date(d.data);
      return dt.getFullYear()===ano;
    });
  }
  let total = 0;
  if(tipo==='fiados' || tipo==='entradas'){
    total = dados.reduce((sum,d)=>{
      if(d.tipo==='entradas') return sum + d.valor - (d.taxa||0);
      return sum + d.valor;
    },0);
  } else if(tipo==='saidas'){
    total = dados.reduce((sum,d)=>sum + d.valor,0);
  }
  return total.toFixed(2);
}

// Para testar
// console.log(calcularTotais('fiados','hoje'));
