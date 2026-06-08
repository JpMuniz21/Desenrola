// worker.js (Consumidor Assíncrono)
const amqp = require('amqplib');

const RABBITMQ_URL = 'amqp://localhost';
const fila = 'fila_notificacoes';

async function iniciarWorker() {
  try {
    const conexao = await amqp.connect(RABBITMQ_URL);
    const canal = await conexao.createChannel();

    await canal.assertQueue(fila, { durable: true });
    console.log(` [*] Worker aguardando mensagens em [${fila}]. Para sair, pressione CTRL+C`);

    // Escuta a fila continuamente
    canal.consume(fila, (msg) => {
      if (msg !== null) {
        const alerta = JSON.parse(msg.toString());
        
        console.log("\n--- 🔔 NOVA NOTIFICAÇÃO ASSÍNCRONA RECEBIDA ---");
        console.log(`Evento: ${alerta.evento}`);
        console.log(`Alerta ao Usuário: ${alerta.mensagem}`);
        console.log("-----------------------------------------------\n");

    
        canal.ack(msg);
      }
    });

  } catch (error) {
    console.error("Erro no Worker do RabbitMQ:", error);
  }
}

iniciarWorker();