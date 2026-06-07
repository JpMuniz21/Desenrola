require('dotenv').config();

const http = require('http');
const { Server } = require('socket.io');
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

const SECRET_KEY = process.env.JWT_SECRET; 
const PORT = process.env.PORT || 3001;

// --- Middlewares ---
app.use(cors());
app.use(express.json());

// ==========================================================
// 🛡️ MIDDLEWARE DE AUTENTICAÇÃO JWT
// ==========================================================
function autenticarToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ mensagem: 'Token não fornecido' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const usuario = jwt.verify(token, SECRET_KEY);
        req.usuario = usuario;
        next();
    } catch (error) {
        return res.status(403).json({ mensagem: 'Token inválido' });
    }
}

// ==========================================================
// 🔌 CONEXÃO COM BANCO DE DADOS (POSTGRESQL)
// ==========================================================
const connection = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

connection.query('SELECT NOW()')
    .then(() => console.log('✅ Banco PostgreSQL conectado'))
    .catch(err => console.error('❌ Erro no banco:', err));

// TODO: Migrar esta array para uma tabela 'item' no PostgreSQL para persistência real
let anuncios = [];

// ==========================================================
// 👤 SEÇÃO 01: CRUD DE USUÁRIOS (Segurança e Acesso)
// ==========================================================

/**
 * [CREATE] - Cadastro de Usuário (RF01)
 * Aplica Hashing de senha via BCrypt conforme RF06.
 */
app.post('/usuarios', async (req, res) => {
    const { nome, email, senha } = req.body;

    try {
        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(senha, salt);

        const result = await connection.query(
            'INSERT INTO usuario (nome, email, senha) VALUES ($1, $2, $3) RETURNING id_usuario',
            [nome, email, senhaHash]
        );

        res.status(201).json({
            mensagem: "Usuário cadastrado!",
            id: result.rows[0].id_usuario
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: 'Erro ao cadastrar usuário' });
    }
});

/**
 * [READ] - Login e Autenticação JWT (UC05)
 */
app.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    try {
        const result = await connection.query(
            'SELECT * FROM usuario WHERE email = $1',
            [email]
        );
        const rows = result.rows;

        if (rows.length === 0) {
            return res.status(404).json({ mensagem: "E-mail não cadastrado" });
        }

        const usuario = rows[0];
        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        
        if (!senhaValida) {
            return res.status(401).json({ mensagem: "Senha inválida" });
        }

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
 * [READ] - Gerenciar Perfil (UC04)
 */
app.get('/usuarios/:id', autenticarToken, async (req, res) => {
    try {
        const result = await connection.query(
            'SELECT id_usuario, nome, email FROM usuario WHERE id_usuario = $1',
            [req.params.id]
        );
        const rows = result.rows;

        if (rows.length === 0) {
            return res.status(404).json({ mensagem: "Usuário não encontrado" });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: 'Erro ao buscar usuário' });
    }
});

/**
 * [UPDATE] - Atualizar Perfil (UC04)
 */
app.put('/usuarios/:id', autenticarToken, async (req, res) => {
    try {
        const { nome, email } = req.body;

        await connection.query(
            'UPDATE usuario SET nome = $1, email = $2 WHERE id_usuario = $3',
            [nome, email, req.params.id]
        );

        res.json({ mensagem: "Perfil updated!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: "Erro ao atualizar perfil" });
    }
});

// ==========================================================
// 💬 SEÇÃO 02: CHAT / MENSAGENS (Real-time)
// ==========================================================

app.get('/mensagens/:id1/:id2', autenticarToken, async (req, res) => {
    const { id1, id2 } = req.params;

    try {
        const result = await connection.query(
            `SELECT * FROM mensagem 
             WHERE (id_remetente = $1 AND id_destinatario = $2)
             OR (id_remetente = $2 AND id_destinatario = $1)
             ORDER BY data_envio`,
            [id1, id2]
        );
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: 'Erro ao buscar mensagens' });
    }
});

// ==========================================================
// 📦 SEÇÃO 03: CRUD DE ITENS (Gerenciamento de Ofertas)
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
app.post('/itens', autenticarToken, (req, res) => {
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
app.put('/itens/:id', autenticarToken, (req, res) => {
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
    app.delete('/itens/:id', autenticarToken, (req, res) => {
    const index = anuncios.findIndex(a => a.id == req.params.id);

    if (index !== -1) {
        anuncios.splice(index, 1);
        res.json({ mensagem: "Item removido com sucesso" });
    } else {
        res.status(404).json({ mensagem: "Erro ao deletar item" });
    }
});

// ==========================================================
// 🧠 SEÇÃO 04: REGRAS DE NEGÓCIO (Fluxo de Aluguel)
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

// ==========================================================
// 🔌 SOCKET.IO (Eventos em tempo real)
// ==========================================================
io.on('connection', (socket) => {
    console.log('🟢 Usuário conectado via Socket');

    socket.on('mensagem', async (msg) => {
        try {
            await connection.query(
                `INSERT INTO mensagem (id_remetente, id_destinatario, conteudo)
                 VALUES ($1, $2, $3)`,
                [msg.id_remetente, msg.id_destinatario, msg.conteudo]
            );

            io.emit('mensagem', msg);
        } catch (error) {
            console.error('Erro ao salvar mensagem via socket:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('🔴 Usuário desconectado do Socket');
    });
});

// --- Inicialização do Servidor ---
server.listen(PORT, () => {
    console.log(`🚀 API DESENROLA ATIVA: http://localhost:${PORT}`);
});