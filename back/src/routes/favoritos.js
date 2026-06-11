const express = require('express');
const router = express.Router();
const connection = require('../config/database');

// [READ] - Buscar favoritos por usuário
router.get('/', async (req, res) => {
    try {
        const { usuarioId, itemId } = req.query;
        
        if (usuarioId && itemId) {
            const result = await connection.query(
                'SELECT * FROM favorito WHERE id_usuario = $1 AND id_item = $2',
                [usuarioId, itemId]
            );
            return res.json(result.rows);
        }
        
        const result = await connection.query(
            `SELECT favorito.*, item.nome, item.imagem, item.preco, item.periodo
             FROM favorito
             JOIN item ON favorito.id_item = item.id_item
             WHERE favorito.id_usuario = $1`,
            [usuarioId]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar favoritos:', error);
        res.status(500).json({ erro: 'Erro ao buscar favoritos' });
    }
});

// [CREATE] - Adicionar favorito
router.post('/', async (req, res) => {
    try {
        const { usuarioId, itemId } = req.body;
        const result = await connection.query(
            'INSERT INTO favorito (id_usuario, id_item) VALUES ($1, $2) RETURNING *',
            [usuarioId, itemId]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao salvar favorito:', error);
        res.status(500).json({ erro: 'Erro ao salvar favorito' });
    }
});

// [DELETE] - Remover favorito
router.delete('/:id', async (req, res) => {
    try {
        await connection.query(
            'DELETE FROM favorito WHERE id_favorito = $1',
            [req.params.id]
        );
        res.json({ mensagem: 'Favorito removido!' });
    } catch (error) {
        console.error('Erro ao remover favorito:', error);
        res.status(500).json({ erro: 'Erro ao remover favorito' });
    }
});

module.exports = router;