const express = require('express');
const router = express.Router();
const connection = require('../config/database');
const SecurityAspect = require('../aspects/securityAspect');

router.get('/', async (req, res) => {
    try {
        const { usuarioId, categoriaId, busca } = req.query;
        let query = `SELECT item.*, usuario.nome AS anunciante FROM item LEFT JOIN usuario ON item.id_usuario = usuario.id_usuario WHERE 1=1`;
        const params = [];
        let paramIndex = 1;
        if (usuarioId) { query += ` AND item.id_usuario = $${paramIndex}`; params.push(usuarioId); paramIndex++; }
        if (categoriaId) { query += ` AND item.id_categoria = $${paramIndex}`; params.push(categoriaId); paramIndex++; }
        if (busca) { query += ` AND item.nome ILIKE $${paramIndex}`; params.push(`%${busca}%`); paramIndex++; }
        query += ' ORDER BY item.id_item DESC';
        const result = await connection.query(query, params);
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar itens:', error);
        res.status(500).json({ erro: 'Erro ao buscar itens no banco de dados' });
    }
});

router.get('/recomendados/:excluirId', async (req, res) => {
    try {
        const { excluirId } = req.params;
        const resultado = await connection.query('SELECT * FROM item WHERE id_item != $1 ORDER BY RANDOM() LIMIT 3', [excluirId]);
        res.json(resultado.rows);
    } catch (error) {
        console.error("Erro ao buscar recomendados:", error);
        res.status(500).json({ error: "Erro interno ao buscar recomendações." });
    }
});

router.get('/simular-caucao/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await connection.query('SELECT id_item, preco FROM item WHERE id_item = $1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ status: 404, message: "Item inexistente" });
        const item = result.rows[0];
        const valorCaucao = (parseFloat(item.preco) * 0.3).toFixed(2);
        res.json({ itemId: item.id_item, valorCaucao, regra: "30% do valor do item conforme RN02" });
    } catch (error) {
        console.error('Erro ao simular caução:', error);
        res.status(500).json({ erro: 'Erro interno ao simular caução' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await connection.query(
            `SELECT item.*, usuario.nome AS anunciante, usuario.foto_perfil AS foto_anunciante
             FROM item LEFT JOIN usuario ON item.id_usuario = usuario.id_usuario
             WHERE item.id_item = $1`, [id]
        );
        if (resultado.rows.length === 0) return res.status(404).json({ error: "Item não encontrado." });
        res.json(resultado.rows[0]);
    } catch (error) {
        console.error("Erro ao buscar item por ID:", error);
        res.status(500).json({ error: "Erro interno no servidor." });
    }
});

const cadastrarItemHandler = async (req, res) => {
    const id_usuario = req.usuario.id;
    const { nome, descricao, preco, id_categoria, periodo, imagem } = req.body;
    try {
        const result = await connection.query(
            `INSERT INTO item (nome, descricao, id_usuario, id_categoria, preco, periodo, imagem, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id_item, nome, status`,
            [nome, descricao, id_usuario, id_categoria, preco, periodo, imagem, 'disponivel']
        );
        res.status(201).json({ mensagem: "Item cadastrado!", item: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: 'Erro ao salvar no banco' });
    }
};

const editarItemHandler = async (req, res) => {
    const { id } = req.params;
    const { nome, descricao, id_categoria, preco, periodo, imagem, status } = req.body;
    try {
        const itemExistente = await connection.query('SELECT * FROM item WHERE id_item = $1', [id]);
        if (itemExistente.rows.length === 0) return res.status(404).json({ mensagem: "Item não encontrado" });
        await connection.query(
            `UPDATE item SET nome = COALESCE($1, nome), descricao = COALESCE($2, descricao), id_categoria = COALESCE($3, id_categoria), preco = COALESCE($4, preco), periodo = COALESCE($5, periodo), imagem = COALESCE($6, imagem), status = COALESCE($7, status) WHERE id_item = $8`,
            [nome, descricao, id_categoria, preco, periodo, imagem, status, id]
        );
        res.json({ mensagem: "Item atualizado com sucesso!" });
    } catch (error) {
        console.error('Erro ao atualizar item:', error);
        res.status(500).json({ erro: 'Erro ao atualizar o item' });
    }
};

const deletarItemHandler = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await connection.query('DELETE FROM item WHERE id_item = $1', [id]);
        if (result.rowCount === 0) return res.status(404).json({ mensagem: "Item não encontrado" });
        res.json({ mensagem: "Item removido com sucesso" });
    } catch (error) {
        console.error('Erro ao deletar item:', error);
        res.status(500).json({ erro: 'Erro ao deletar o item' });
    }
};

router.post('/', SecurityAspect.proteger(cadastrarItemHandler));
router.put('/:id', SecurityAspect.proteger(editarItemHandler));
router.delete('/:id', SecurityAspect.proteger(deletarItemHandler));

module.exports = router;