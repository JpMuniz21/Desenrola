const express = require('express');
const router = express.Router();
const connection = require('../config/database');
const autenticarToken = require('../middlewares/auth');


//[READ] - Buscar Itens (RF03 / UC01)
router.get('/', async (req, res) => {
    try {
        const result = await connection.query('SELECT * FROM item ORDER BY id_item DESC');
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar itens:', error);
        res.status(500).json({ erro: 'Erro ao buscar itens no banco de dados' });
    }
});

//[CREATE] - Cadastrar Item (RF02 / UC03)
router.post('/', autenticarToken, async (req, res) => {
    const id_usuario = req.usuario.id; 
    const { nome, descricao,id_usuario,id_categoria, preco,periodo,imagem,status } = req.body;

    try {
        const result = await connection.query(
            `INSERT INTO item (nome, descricao,id_usuario,id_categoria, preco,periodo,imagem,status) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
             RETURNING id_item, nome, status`,
            [nome, descricao, id_usuario,id_categoria, preco, periodo, imagem, 'disponivel']
        );

        res.status(201).json({
            mensagem: "Item cadastrado com sucesso!",
            item: result.rows[0]
        });
    } catch (error) {
        console.error('Erro ao cadastrar item:', error);
        res.status(500).json({ erro: 'Erro ao salvar o item no banco de dados' });
    }
});

//[UPDATE] - Editar ou Alterar Status (RF04)
router.put('/:id', autenticarToken, async (req, res) => {
    const { id } = req.params;
    const { nome, descricao, id_categoria, preco, periodo, imagem, status } = req.body;

    try {

        const itemExistente = await connection.query('SELECT * FROM item WHERE id_item = $1', [id]);
        
        if (itemExistente.rows.length === 0) {
            return res.status(404).json({ mensagem: "Item não encontrado" });
        }

        await connection.query(
            `UPDATE item 
             SET nome = COALESCE($1, nome), 
                 descricao = COALESCE($2, descricao), 
                 id_categoria = COALESCE($3, id_categoria),
                 preco = COALESCE($4, preco), 
                 periodo = COALESCE($5, periodo),
                 imagem = COALESCE($6, imagem),
                 status = COALESCE($7, status)
             WHERE id_item = $8`,
            [nome, descricao, id_categoria, preco, periodo, imagem, status, id]
        );

        res.json({ mensagem: "Item updated com sucesso!" });
    } catch (error) {
        console.error('Erro ao atualizar item:', error);
        res.status(500).json({ erro: 'Erro ao atualizar o item no banco de dados' });
    }
});


 //[DELETE] - Remover Item
    router.delete('/:id', autenticarToken, async (req, res) => {
    const { id } = req.params;

    try {
        const result = await connection.query('DELETE FROM item WHERE id_item = $1', [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ mensagem: "Item não encontrado para exclusão" });
        }

        res.json({ mensagem: "Item removido com sucesso" });
    } catch (error) {
        console.error('Erro ao deletar item:', error);
        res.status(500).json({ erro: 'Erro ao deletar o item no banco de dados' });
    }
});


 //[LOGIC] - Simular Caução (RN02 / UC06)
router.get('/simular-caucao/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await connection.query('SELECT id_item, preco FROM item WHERE id_item = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ status: 404, mensagem: "Item inexistente" });
        }

        const item = result.rows[0];
        const precoNum = parseFloat(item.preco);
        const valorCaucao = precoNum * 0.3;

        res.json({ 
            itemId: item.id_item, 
            valorCaucao: valorCaucao.toFixed(2),
            regra: "30% do valor do item conforme RN02" 
        });
    } catch (error) {
        console.error('Erro ao simular caução:', error);
        res.status(500).json({ erro: 'Erro interno ao simular caução' });
    }
});

module.exports = router;

