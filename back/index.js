const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const SECRET_KEY = "desenrola_unifor_2026"; // Necessário para UC05

// --- Middlewares ---
app.use(cors());
app.use(express.json());

// ==========================================================
// [MOCKS] BANCO DE DADOS EM MEMÓRIA
// ==========================================================
let usuarios = []; // Armazena Locadores e Locatários (RF01)
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
    
    // Proteção de dados sensíveis (RF06)
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);

    const novoUsuario = {
        id: usuarios.length + 1,
        nome,
        email,
        senha: senhaHash,
        trustScore: 4.5 // Reputação inicial (Glossário)[cite: 1]
    };

    usuarios.push(novoUsuario);
    res.status(201).json({ mensagem: "Usuário cadastrado!", id: novoUsuario.id });
});

/**
 * [READ] - Login e Autenticação JWT (UC05)
 * Valida credenciais e gera token de acesso[cite: 1].
 */
app.post('/login', async (req, res) => {
    const { email, senha } = req.body;
    const usuario = usuarios.find(u => u.email === email);

    if (!usuario) return res.status(404).json({ mensagem: "E-mail não cadastrado" });

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) return res.status(401).json({ mensagem: "Senha inválida" });

    // Geração do token para sessões seguras[cite: 1]
    const token = jwt.sign({ id: usuario.id }, SECRET_KEY, { expiresIn: '2h' });
    res.json({ token, nome: usuario.nome, trustScore: usuario.trustScore });
});

/**
 * [READ/UPDATE/DELETE] - Gerenciar Perfil (UC04)
 */
app.get('/usuarios/:id', (req, res) => {
    const usuario = usuarios.find(u => u.id == req.params.id);
    if (!usuario) return res.status(404).json({ mensagem: "Usuário não encontrado" });
    const { senha, ...dadosPublicos } = usuario;
    res.json(dadosPublicos);
});

app.put('/usuarios/:id', (req, res) => {
    const index = usuarios.findIndex(u => u.id == req.params.id);
    if (index !== -1) {
        usuarios[index] = { ...usuarios[index], ...req.body };
        res.json({ mensagem: "Perfil atualizado!" });
    } else {
        res.status(404).json({ mensagem: "Erro ao atualizar perfil" });
    }
});

// ==========================================================
// SEÇÃO 02: CRUD DE ITENS (Gerenciamento de Ofertas)
// ==========================================================

/**
 * [READ] - Buscar Itens (RF03 / UC01)
 * Listagem de itens de nicho para o Locatário[cite: 1].
 */
app.get('/itens', (req, res) => {
    res.json(anuncios);
});

/**
 * [CREATE] - Cadastrar Item (RF02 / UC03)
 * Permite ao Locador disponibilizar novos itens[cite: 1].
 */
app.post('/itens', (req, res) => {
    const novoItem = {
        id: anuncios.length + 1,
        status: "disponivel", // Status inicial (RF04)[cite: 1]
        ...req.body
    };
    anuncios.push(novoItem);
    res.status(201).json(novoItem);
});

/**
 * [UPDATE] - Editar ou Alterar Status (RF04)
 * Necessário para o fluxo de reserva e manutenção[cite: 1].
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
 * Exclui a oferta da plataforma.
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
 * Obrigatório para confirmar o aluguel de itens valiosos[cite: 1].
 */
app.get('/simular-caucao/:id', (req, res) => {
    const item = anuncios.find(a => a.id == req.params.id);
    if (!item) return res.status(404).json({ mensagem: "Item inexistente" });

    // Simulação: Caução calculada como 30% do valor do item[cite: 1]
    const valorCaucao = item.preco * 0.3;
    res.json({ 
        itemId: item.id, 
        valorCaucao: valorCaucao.toFixed(2),
        regra: "30% do valor do item conforme RN02" 
    });
});

// --- Inicialização do Servidor ---
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`API DESENROLA ATIVA: http://localhost:${PORT}`);
});