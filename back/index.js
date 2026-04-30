require('dotenv').config();

const mysql = require('mysql2/promise');

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const SECRET_KEY = process.env.JWT_SECRET; // Necessário para UC05
const PORT = process.env.PORT || 3001;

// --- Middlewares ---
app.use(cors());
app.use(express.json());

// ==========================================================
// 🔌 CONEXÃO COM BANCO DE DADOS (MYSQL)
// ==========================================================
let connection;

async function conectarBanco() {
    connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    console.log('🔥 Conectado ao MySQL');
}

conectarBanco();

// ==========================================================
// [MOCKS] BANCO DE DADOS EM MEMÓRIA
// (mantido apenas para itens por enquanto)
// ==========================================================
let anuncios = [ 
    { id: 1, titulo: "Camera Cybershot", preco: 30.00, categoria: "Fotografia", status: "disponivel", trustScore: 4.8 },
    { id: 2, titulo: "Kindle 16gb", preco: 20.00, categoria: "Leitura", status: "alugado", trustScore: 5.0 }
];

// ==========================================================
// SEÇÃO 01: CRUD DE USUÁRIOS (Segurança e Acesso)
// ==========================================================

/**
 * [CREATE] - Cadastro de Usuário (RF01)
 * Aplica Hashing de senha via BCrypt conforme RF06.
 */
app.post('/usuarios', async (req, res) => {
    const { nome, email, senha } = req.body;

    try {
        // Proteção de dados sensíveis (RF06)
        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(senha, salt);

        const [result] = await connection.query(
            'INSERT INTO usuario (nome, email, senha) VALUES (?, ?, ?)',
            [nome, email, senhaHash]
        );

        res.status(201).json({ mensagem: "Usuário cadastrado!", id: result.insertId });

    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: 'Erro ao cadastrar usuário' });
    }
});

/**
 * [READ] - Login e Autenticação JWT (UC05)
 * Valida credenciais e gera token de acesso.
 */
app.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    try {
        const [rows] = await connection.query(
            'SELECT * FROM usuario WHERE email = ?',
            [email]
        );

        if (rows.length === 0) {
            return res.status(404).json({ mensagem: "E-mail não cadastrado" });
        }

        const usuario = rows[0];

        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            return res.status(401).json({ mensagem: "Senha inválida" });
        }

        // Geração do token para sessões seguras
        const token = jwt.sign({ id: usuario.id_usuario }, SECRET_KEY, { expiresIn: '2h' });

        res.json({ 
            token, 
            nome: usuario.nome,
            id: usuario.id_usuario
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: 'Erro no login' });
    }
});

/**
 * [READ/UPDATE/DELETE] - Gerenciar Perfil (UC04)
 */
app.get('/usuarios/:id', async (req, res) => {
    try {
        const [rows] = await connection.query(
            'SELECT id_usuario, nome, email FROM usuario WHERE id_usuario = ?',
            [req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ mensagem: "Usuário não encontrado" });
        }

        res.json(rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: 'Erro ao buscar usuário' });
    }
});

app.put('/usuarios/:id', async (req, res) => {
    try {
        const { nome, email } = req.body;

        await connection.query(
            'UPDATE usuario SET nome = ?, email = ? WHERE id_usuario = ?',
            [nome, email, req.params.id]
        );

        res.json({ mensagem: "Perfil atualizado!" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: "Erro ao atualizar perfil" });
    }
});

// ==========================================================
// SEÇÃO 02: CRUD DE ITENS (Gerenciamento de Ofertas)
// ==========================================================

/**
 * [READ] - Buscar Itens (RF03 / UC01)
 */
app.get('/itens', (req, res) => {
    res.json(anuncios);
});

/**
 * [CREATE] - Cadastrar Item (RF02 / UC03)
 */
app.post('/itens', (req, res) => {
    const novoItem = {
        id: anuncios.length + 1,
        status: "disponivel",
        ...req.body
    };
    anuncios.push(novoItem);
    res.status(201).json(novoItem);
});

/**
 * [UPDATE] - Editar ou Alterar Status (RF04)
 */
app.put('/itens/:id', (req, res) => {
    const { id } = req.params;
    const index = anuncios.findIndex(a => a.id == id);

    if (index !== -1) {
        anuncios[index] = { ...anuncios[index], ...req.body };
        res.json({ mensagem: "Item atualizado!", item: anuncios[index] });
    } else {
        res.status(404).json({ mensagem: "Item não encontrado" });
    }
});

/**
 * [DELETE] - Remover Item
 */
app.delete('/itens/:id', (req, res) => {
    const index = anuncios.findIndex(a => a.id == req.params.id);

    if (index !== -1) {
        anuncios.splice(index, 1);
        res.json({ mensagem: "Item removido com sucesso" });
    } else {
        res.status(404).json({ mensagem: "Erro ao deletar item" });
    }
});

// ==========================================================
// SEÇÃO 03: REGRAS DE NEGÓCIO (Fluxo de Aluguel)
// ==========================================================

/**
 * [LOGIC] - Simular Caução (RN02 / UC06)
 */
app.get('/simular-caucao/:id', (req, res) => {
    const item = anuncios.find(a => a.id == req.params.id);
    if (!item) return res.status(404).json({ mensagem: "Item inexistente" });

    const valorCaucao = item.preco * 0.3;

    res.json({ 
        itemId: item.id, 
        valorCaucao: valorCaucao.toFixed(2),
        regra: "30% do valor do item conforme RN02" 
    });
});

// --- Inicialização do Servidor ---
app.listen(PORT, () => {
    console.log(`🚀 API DESENROLA ATIVA: http://localhost:${PORT}`);
});