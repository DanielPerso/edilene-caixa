const express = require('express');
const router = express.Router();
const Lancamento = require('../models/Lancamento')

router.post('/', async (req, res) => {
    try {
        const novoLancamento = new Lancamento(req.body);
        const LancamentoSalvo = await novoLancamento.save();
        res.status(201).json(LancamentoSalvo);
    } catch (err) {
        res.status(400).json({ erro: 'Erro ao salvar lançamento' });
    }
});

router.get('/', async (req, res) => {
    try {
        const lancamentos = await Lancamento.find().sort({ data: -1 });
        res.json(lancamentos);
    } catch (err) {
        res.status(500).json({ erro: 'Erro ao buscar lançamentos' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletado = await Lancamento.findByIdAndDelete(id);

        if (!deletado) {
            return res.stauts(404).json({ erro: 'Lançamento não encontrado' })
        }
        res.sendStatus(204);
    } catch (err) {
        res.status(500).json({ erro: 'Erro ao excluir lançamento' });
    }
})

module.exports = router;