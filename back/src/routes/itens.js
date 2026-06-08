const express = require('express');
const router = express.Router();
const connection = require('../config/database');
const SecurityAspect = require('../aspects/securityAspect'); // POA Ativo aqui



// [READ] - Buscar Itens (RF03 / UC01)
router.get('/', async (req, res) => {
    try {
        const result = await connection.query('SELECT * FROM item ORDER BY id_item DESC');
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar itens:', error);
        res.status(500).json({ erro: 'Erro ao buscar itens no banco de dados' });
    }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params; 
    // Executa a busca no PostgreSQL usando a coluna correta (id_item)
    const resultado = await connection.query('SELECT * FROM item WHERE id_item = $1', [id]);

    // Se o banco não achar nada com esse ID
    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: "Item não encontrado no banco de dados." });
    }

    res.json(resultado.rows[0]);

  } catch (error) {
    console.error("Erro crítico ao buscar item por ID:", error);
    res.status(500).json({ error: "Erro interno no servidor ao buscar detalhes." });
  }
});

router.get('/recomendados/:excluirId', async (req, res) => {
  try {
    const { excluirId } = req.params;

    const queryText = 'SELECT * FROM item WHERE id_item != $1 ORDER BY RANDOM() LIMIT 3';
    const resultado = await connection.query(queryText, [excluirId]);

    res.json(resultado.rows);
  } catch (error) {
    console.error("Erro ao buscar recomendados no banco:", error);
    res.status(500).json({ error: "Erro interno ao buscar recomendações." });
  }
});

// [LOGIC] - Simular Caução (RN02 / UC06)
router.get('/simular-caucao/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await connection.query('SELECT id_item, preco FROM item WHERE id_item = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ status: 404, message: "Item inexistente" });
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


// ==========================================================
// 🔒 HANDLERS DAS REGRAS DE NEGÓCIO (Join Points da POA)
// ==========================================================

// Handler: Cadastrar Item
const cadastrarItemHandler = async (req, res) => {
    const id_usuario = req.usuario.id; 
    const { nome, descricao, preco, id_categoria, periodo, imagem } = req.body;

    try {
        const result = await connection.query(
            `INSERT INTO item (nome, descricao, id_usuario, id_categoria, preco, periodo, imagem, status) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
             RETURNING id_item, nome, status`,
            [nome, descricao, id_usuario, id_categoria, preco, periodo, imagem, 'disponivel']
        );
        res.status(201).json({ mensagem: "Item cadastrado!", item: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: 'Erro ao salvar no banco' });
    }
};

// Handler: Editar Item
const editarItemHandler = async (req, res) => {
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

        res.json({ mensagem: "Item atualizado com sucesso!" });
    } catch (error) {
        console.error('Erro ao atualizar item:', error);
        res.status(500).json({ erro: 'Erro ao atualizar o item no banco de dados' });
    }
};

// Handler: Deletar Item
const deletarItemHandler = async (req, res) => {
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
};


router.post('/', SecurityAspect.proteger(cadastrarItemHandler));
router.put('/:id', SecurityAspect.proteger(editarItemHandler));
router.delete('/:id', SecurityAspect.proteger(deletarItemHandler));

module.exports = router;