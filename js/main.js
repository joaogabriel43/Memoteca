import ui from "./ui.js"
import api from "./api.js"

function RemoverEspacos(string){
  return string.replace(/\s+/g, "")
}

const regexConteudo = /^[A-Za-z\s]{10,}$/
const regexAutoria = /^[a-Za-Z]{3,15}$/

function validarConteudo(conteudo) {
  return regexConteudo.test(conteudo)
}

function validarAutoria(autoria) {
  return regexAutoria.test(autoria)
}

document.addEventListener("DOMContentLoaded", () => {
  ui.renderizarPensamentos()

  const formularioPensamento = document.getElementById("pensamento-form")
  const botaoCancelar = document.getElementById("botao-cancelar")
  const inputBusca = document.getElementById("campo-busca")
  
  formularioPensamento.addEventListener("submit", manipularSubmissaoFormulario)
  botaoCancelar.addEventListener("click", manipularCancelamento)
  inputBusca.addEventListener("input", manipularBusca)
})

async function manipularSubmissaoFormulario(event) {
  event.preventDefault()
  const id = document.getElementById("pensamento-id").value
  const conteudo = document.getElementById("pensamento-conteudo").value
  const autoria = document.getElementById("pensamento-autoria").value
  const data = document.getElementById("pensamento-data").value

  const conteudoSemEspacos = RemoverEspacos(conteudo)
  const autoriaSemEspacos = RemoverEspacos(autoria)

  if (!validarConteudo(conteudoSemEspacos)) {
    alert("Conteúdo inválido. O conteúdo deve ter pelo menos 10 caracteres.")
    return
  }

  if (!validarAutoria(autoriaSemEspacos)) {
    alert("Autoria inválida. A autoria deve ter entre 3 e 15 caracteres sem espaços.")
    return
  }

  if (!validarData(data)) {
    alert("Data inválida. A data deve ser menor ou igual à data atual.")
    return
  }

  try {
    if (id) {
      await api.editarPensamento({ id, conteudo, autoria, data })
    } else {
      await api.salvarPensamento({ conteudo, autoria, data })
    }
    ui.renderizarPensamentos()
  } catch {
    alert("Erro ao salvar pensamento")
  }
}

function manipularCancelamento() {
  ui.limparFormulario()
}

async function manipularBusca(){
  const termoBusca = document.getElementById("campo-busca").value
  try {
    const pensamentosFiltrados = await api.buscarPensamentosPorTermo(termoBusca)
    ui.renderizarPensamentos(pensamentosFiltrados)
  } catch (error) {
    alert("Erro ao buscar pensamentos")
  }
}

  function validarData(data) {
    const dataAtual = new Date()
    const dataInserida = new Date(data)
    return dataInserida <= dataAtual
  }
