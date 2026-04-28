const express = require('express');
const cors = require('cors');

const app = express();

//Middlewares

app.use(cors());
app.use(express.json());

// ==========================================================
// [TEMPORÁRIO] - MOCK DE DADOS
// No futuro, este array será removido e os dados virão do MySQL
// ==========================================================
let anuncios = [ 
    {
        id: 1,
        titulo: "Camera Cybershot",
        preco: 30.00,
        categoria: "Eletrônicos",
        status: "disponivel",
        avaliacao: 4.8
    }, 
    {
        id: 2,
        titulo: "Kindle 16gb",
        preco: 20.00,
        categoria: "Leitura",
        status: "alugado",
        avaliacao: 5
    }
];
//Rota de teste

app.get('/', (req, res) => {
    res.send('API do Desenrola ativada');
});

// ==========================================================
// READ: Listar todos os itens
// [FUTURO SQL]: db.query('SELECT * FROM itens', ...)
// ==========================================================
app.get('/itens', (req, res) => {
    res.json(anuncios);
});

app.post('/itens', (req, res) => {
    const novoItem = {
        id: anuncios.length + 1, //o sql fará o ID automático (AUTO_INCREMENT)
        ...req.body
    };
    // [TEMPORÁRIO]: Salvando na memória
    anuncios.push(novoItem);
    res.status(201).json(novoItem);
});

// ==========================================================
// READ: Detalhes de um item específico
// [FUTURO SQL]: db.query('SELECT * FROM itens WHERE id = ?', [id])
// ==========================================================
app.get('/itens/:id', (req, res) => {
    const { id } = req.params;
    const item = anuncios.find(a => a.id == id);

    if (item) {
        res.json(item);
    } else {
        res.status(404).json({ mensagem: "Item não encontrado"});
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
})
