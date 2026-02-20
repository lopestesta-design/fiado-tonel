let clientes = JSON.parse(localStorage.getItem("clientes")) || [];

function salvar() {
  localStorage.setItem("clientes", JSON.stringify(clientes));
  atualizarLista();
  atualizarSelect();
}

function carregar() {
  clientes = JSON.parse(localStorage.getItem("clientes")) || [];
  atualizarLista();
  atualizarSelect();
}

function cadastrarCliente() {
  let nome = document.getElementById("nome").value.trim();
  let telefone = document.getElementById("telefone").value.trim();
  if(!nome || !telefone){ alert("Preencha todos os campos"); return; }
  clientes.push({ nome, telefone, saldo:0, historico:[] });
  document.getElementById("nome").value = "";
  document.getElementById("telefone").value = "";
  salvar();
}

function atualizarSelect() {
  let select = document.getElementById("clienteSelect");
  select.innerHTML = "";
  clientes.forEach(c => {
    let option = document.createElement("option");
    option.value = c.nome;
    option.textContent = c.nome;
    select.appendChild(option);
  });
}

function adicionarConsumo() {
  let nome = document.getElementById("clienteSelect").value;
  let valor = parseFloat(document.getElementById("valor").value);
  if(!valor){ alert("Digite um valor"); return; }
  let cliente = clientes.find(c => c.nome === nome);
  if(cliente){
    cliente.saldo += valor;
    cliente.historico.push({data: new Date().toLocaleDateString(), tipo:"Consumo", valor});
  }
  document.getElementById("valor").value = "";
  salvar();
}

function registrarPagamento() {
  let nome = document.getElementById("clienteSelect").value;
  let valor = parseFloat(document.getElementById("valor").value);
  if(!valor){ alert("Digite um valor"); return; }
  let cliente = clientes.find(c => c.nome === nome);
  if(cliente){
    cliente.saldo -= valor;
    if(cliente.saldo<0) cliente.saldo=0;
    cliente.historico.push({data:new Date().toLocaleDateString(),tipo:"Pagamento",valor});
  }
  document.getElementById("valor").value = "";
  salvar();
}

function enviarWhatsApp(index) {
  let cliente = clientes[index];
  let telefone = cliente.telefone.replace(/\D/g,"");
  let mensagem = "Extrato - Tonel 333\n\n";
  cliente.historico.forEach(h => { mensagem += h.data+" - "+h.tipo+" - R$ "+h.valor.toFixed(2)+"\n"; });
  mensagem += "\nSaldo atual: R$ " + cliente.saldo.toFixed(2);
  mensagem += "\n\nChave PIX: 14341419000111"; // PIX fixo
  let url = "https://wa.me/" + telefone + "?text=" + encodeURIComponent(mensagem);
  window.open(url,"_blank");
}

function atualizarLista() {
  let lista = document.getElementById("lista");
  lista.innerHTML = "";
  clientes.forEach((c,i) => {
    let historicoHTML = c.historico.map(h=>h.data+" - "+h.tipo+" - R$ "+h.valor.toFixed(2)).join("<br>");
    lista.innerHTML += `
      <div class="cliente-box">
        <b>${c.nome}</b>
        <span style="float:right;cursor:pointer;color:red;" onclick="excluirCliente(${i})">✖</span><br>
        Telefone: ${c.telefone}<br>
        <b>Saldo: R$ ${c.saldo.toFixed(2)}</b><br><br>
        <b>Histórico:</b><br>
        ${historicoHTML || "Sem movimentações"}<br><br>
        <button onclick="enviarWhatsApp(${i})" style="background:#25D366;color:white;padding:10px;border-radius:8px;">WhatsApp</button>
      </div>
    `;
  });
}

function excluirCliente(index){
  if(confirm("Deseja realmente excluir este cliente?")){
    clientes.splice(index,1);
    salvar();
  }
}

// Backup
function exportarBackup(){
  const dataStr = JSON.stringify(clientes);
  const blob = new Blob([dataStr], {type:"application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "backup_fiado.json"; a.click();
  URL.revokeObjectURL(url);
}

function importarBackup(file){
  const reader = new FileReader();
  reader.onload = e => {
    clientes = JSON.parse(e.target.result);
    salvar();
  };
  reader.readAsText(file);
}

carregar();
