const mongoose = require('mongoose');

const LancamentoSchema = new mongoose.Schema({
    tipo: {
        type: String,
        enum: ['entrada', 'saida'],
        required: true
    },
    descricao: {
        type: String,
        required: true
    },
    valor: {
        type: Number,
        required: true
    },
    data: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Lancamento', LancamentoSchema);