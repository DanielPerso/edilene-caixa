const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const lancamentoRoutes = require('./routes/lancamentos');
const path = require('path');

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/gestao_financeira', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erro de conexão'));
db.once('open', () => {
    console.log('Conectado ao MongoDB');
});

app.use('/api/lancamentos', lancamentoRoutes);

const frontendPath = path.join(__dirname, '..')


app.use(express.static(frontendPath));

app.get('/', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
})

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
    console.log('Caminho base:', __dirname)
});
