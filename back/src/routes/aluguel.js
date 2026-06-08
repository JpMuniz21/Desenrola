const express = require('express');
const router = express.Router();
const amqp = require('amqplib'); 
const RABBITMQ_URL = 'amqp://localhost'; 

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

module.exports = router;