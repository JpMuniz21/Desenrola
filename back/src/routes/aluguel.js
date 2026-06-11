const express = require('express');
const router = express.Router();
const amqp = require('amqplib'); 
const RABBITMQ_URL = 'amqp://localhost'; 
const connection = require('../config/database');
const autenticarToken = require('../middlewares/auth');

router.post('/', async (req, res) => {
  try {
    const { produtoId, nomeProduto, preco, locatario } = req.body;

    // 1. Cria o objeto do alerta / notificação
    const alertaNotificacao = {
      evento: 'NOVO_ALUGUEL_SOLICITADO',
      produtoId,
      nomeProduto,
      preco,
      locatario,
      data: new Date(),
      mensagem: `Olá! O usuário ${locatario} acabou de solicitar o aluguel do item: ${nomeProduto}.`
    };

    const conexao = await amqp.connect(RABBITMQ_URL);
    const canal = await conexao.createChannel();
    const fila = 'fila_notificacoes';

    // Garante que a fila existe
    await canal.assertQueue(fila, { durable: true });
    
    canal.sendToQueue(fila, Buffer.from(JSON.stringify(alertaNotificacao)), {
      persistent: true
    });

    console.log(" [x] Alerta enviado para o RabbitMQ:", alertaNotificacao.mensagem);

    setTimeout(() => { conexao.close(); }, 500);

    res.status(202).json({ 
      success: true, 
      message: "Solicitação recebida com sucesso! O proprietário será notificado assincronamente." 
    });

  } catch (error) {
    console.error("Erro ao integrar com RabbitMQ:", error);
    res.status(500).json({ error: "Erro interno ao processar aluguel." });
  }
});

// [READ] - Buscar datas ocupadas por item
router.get('/datas/:itemId', async (req, res) => {
    try {
        const { itemId } = req.params;
        const result = await connection.query(
            'SELECT data_inicio, data_fim FROM aluguel WHERE id_item = $1',
            [itemId]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar datas:', error);
        res.status(500).json({ erro: 'Erro ao buscar datas ocupadas' });
    }
});

// [CREATE] - Criar aluguel no banco
router.post('/salvar', autenticarToken, async (req, res) => {
    try {
        const { itemId, dataInicio, dataFim } = req.body;
        const userId = req.usuario.id;

        await connection.query(
            'INSERT INTO aluguel (id_item, id_usuario, data_inicio, data_fim) VALUES ($1, $2, $3, $4)',
            [itemId, userId, dataInicio, dataFim]
        );

        res.status(201).json({ mensagem: "Aluguel salvo com sucesso!" });
    } catch (error) {
        console.error('Erro ao salvar aluguel:', error);
        res.status(500).json({ erro: 'Erro ao salvar aluguel' });
    }
});

// [READ] - Buscar aluguéis do usuário
router.get('/usuario', autenticarToken, async (req, res) => {
    try {
        const userId = req.usuario.id;
        const result = await connection.query(
            `SELECT aluguel.*, item.nome, item.imagem, item.preco, item.periodo
             FROM aluguel 
             JOIN item ON aluguel.id_item = item.id_item
             WHERE aluguel.id_usuario = $1
             ORDER BY aluguel.criado_em DESC`,
            [userId]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar aluguéis:', error);
        res.status(500).json({ erro: 'Erro ao buscar aluguéis' });
    }
});

module.exports = router;