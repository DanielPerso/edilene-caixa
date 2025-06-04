const form = document.getElementById('form-lancamento');
const tipo = document.getElementById('tipo');
const descricao = document.getElementById('descricao');
const valor = document.getElementById('valor');
const tabela = document.querySelector('#tabela-lancamentos tbody');
const totalEntradas = document.getElementById('total-entradas');
const totalSaidas = document.getElementById('total-saidas');
const totalLucro = document.getElementById('total-lucro');
const responsavel = document.getElementById('responsavel');


let entradas = 0;
let saidas = 0;

form.addEventListener('submit', async function (event) {
    event.preventDefault();

    const tipoLancamento = tipo.value;
    const descricaoLancamento = descricao.value.trim();
    const valorLancamento = parseFloat(valor.value);
    const responsavelLancamento = responsavel.value;

    if (!descricaoLancamento || isNaN(valorLancamento)) {
        alert('Preencha todos os campos corretamente');
        return;
    }

    const lancamento = {
        tipo: tipoLancamento,
        descricao: descricaoLancamento,
        valor: valorLancamento,
        responsavel: responsavelLancamento
    };

    console.log('Lancamento enviado:', lancamento);

    try {
        const response = await fetch('/api/lancamentos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(lancamento)
        });
        if (!response.ok) {
            throw new Error('Erro ao salvar laçamento');
        }
        const lancamentoSalvo = await response.json();

        adicionarLinha(
            lancamentoSalvo.tipo,
            lancamentoSalvo.descricao,
            lancamentoSalvo.valor,
            new Date(lancamentoSalvo.data),
            lancamentoSalvo._id,
            lancamentoSalvo.responsavel
        );

        atualizarResumo(lancamentoSalvo.tipo, lancamentoSalvo.valor);

        form.reset();

    } catch (error) {
        alert(error.message);
    }

    form.reset();
})

function adicionarLinha(tipo, descricao, valor, data, id, responsavel) {
    const linha = document.createElement('tr');
    const dataFormatada = data ? data.toLocaleDateString('pt-BR') : new Date().toLocaleDateString('pt-BR')

    linha.innerHTML = `
        <td>${tipo}</td>
        <td>${descricao}</td>
        <td>${valor.toFixed(2)}</td>
        <td>${dataFormatada}</td>
        <td>${responsavel}</td>
        <td><button class='btn-excluir'>Excluir</button></td>
    `;

    linha.style.color = tipo.toLowerCase() === 'entrada' ? 'green' : 'red';

    linha.querySelector('.btn-excluir').addEventListener('click', async () => {
        try {
            const response = await fetch(`/api/lancamentos/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Erro ao excluir lançamento');

            linha.remove();

            atualizarResumo(tipo, -valor);
        } catch (error) {
            alert(error.message);
        }
    });

    tabela.appendChild(linha);
}

function atualizarResumo(tipo, valor) {
    const tipoLower = tipo.toLowerCase();

    if (tipoLower === 'entrada') {
        entradas += valor;
    } else {
        saidas += valor;
    }

    const lucro = entradas - saidas;

    totalEntradas.textContent = entradas.toFixed(2);
    totalSaidas.textContent = saidas.toFixed(2);
    totalLucro.textContent = lucro.toFixed(2);
}

window.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api/lancamentos');
        const dados = await response.json();

        dados.forEach(lancamento => {
            adicionarLinha(
                lancamento.tipo,
                lancamento.descricao,
                lancamento.valor,
                new Date(lancamento.data),
                lancamento._id,
                lancamento.responsavel
            );
            atualizarResumo(lancamento.tipo, lancamento.valor)
        });

    } catch (error) {
        console.error('Erro ao carregar lançamentos:', error);
        alert('Erro ao carregar lançamentos')
    }
})

