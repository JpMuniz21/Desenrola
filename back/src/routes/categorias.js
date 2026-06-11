const express = require('express');
const router = express.Router();
const connection = require('../config/database');

router.get('/', async (req, res) => {
  try {
    const result = await connection.query('SELECT * FROM categoria ORDER BY nome');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar categorias' });
  }
});

module.exports = router;