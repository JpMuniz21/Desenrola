const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connection = require('../config/database');
const autenticarToken = require('../middlewares/auth');

const SECRET_KEY = process.env.JWT_SECRET;

// [CREATE] - Cadastro de Usuário
router.post('/', async (req, res) => {
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

// [READ] - Login
router.post('/login', async (req, res) => {

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

        const token = jwt.sign({ id: usuario.id_usuario, role: usuario.role }, SECRET_KEY, { expiresIn: '2h' });

        res.json({ 
            token, 
            nome: usuario.nome,
            id: usuario.id_usuario,
            role: usuario.role
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: 'Erro no login' });
    }
});

// [READ] - Perfil
router.get('/:id', autenticarToken, async (req, res) => {
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

// [UPDATE] - Atualizar Perfil
router.put('/:id', autenticarToken, async (req, res) => {
    try {
        const campos = req.body;
        const mapeamento = {
            nome: 'nome',
            email: 'email', 
            nome_completo: 'nome_completo',
            cidade: 'cidade',
            estado: 'estado',
            biografia: 'biografia',
            foto_perfil: 'foto_perfil',
            foto_capa: 'foto_capa'
        };

        const sets = [];
        const params = [];
        let idx = 1;

        for (const [key, col] of Object.entries(mapeamento)) {
            if (campos[key] !== undefined) {
                sets.push(`${col} = $${idx}`);
                params.push(campos[key]);
                idx++;
            }
        }

        if (sets.length === 0) return res.json({ mensagem: "Nada para atualizar" });

        params.push(req.params.id);
        await connection.query(
            `UPDATE usuario SET ${sets.join(', ')} WHERE id_usuario = $${idx}`,
            params
        );

        res.json({ mensagem: "Perfil atualizado!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: "Erro ao atualizar perfil" });
    }
});

// [READ] - Listar todos os usuários (admin)
router.get('/', autenticarToken, async (req, res) => {
    try {
        const result = await connection.query(
            'SELECT id_usuario, nome, email, role FROM usuario ORDER BY id_usuario'
        );
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: 'Erro ao buscar usuários' });
    }
});

module.exports = router;