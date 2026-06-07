require('dotenv').config();

const http = require('http');
const { Server } = require('socket.io');
const express = require('express');
const cors = require('cors');

const connection = require('./src/config/database'); 


const rotasUsuarios = require('./src/routes/usuario');
const rotasItens = require('./src/routes/itens');       
const rotasMensagens = require('./src/routes/mensagens'); 

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

const PORT = process.env.PORT || 3001;

// --- Middlewares Globais ---
app.use(cors());
app.use(express.json());

// --- Vinculando as Rotas Modulares ao Express ---
app.use('/usuarios', rotasUsuarios); 
app.use('/itens', rotasItens);         
app.use('/mensagens', rotasMensagens); 

// ==========================================================
// 🔌 SOCKET.IO (Eventos em tempo real)
// ==========================================================
io.on('connection', (socket) => {
    console.log('🟢 Usuário conectado via Socket');

    socket.on('mensagem', async (msg) => {
        try {
            await connection.query(
                `INSERT INTO mensagem (id_remetente, id_destinatario, conteudo)
                 VALUES ($1, $2, $3)`,
                [msg.id_remetente, msg.id_destinatario, msg.conteudo]
            );

            // Transmite a mensagem em tempo real para os usuários conectados
            io.emit('mensagem', msg);
        } catch (error) {
            console.error('Erro ao salvar mensagem via socket:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('🔴 Usuário desconectado do Socket');
    });
});

server.listen(PORT, () => {
    console.log(`🚀 API DESENROLA ATIVA: http://localhost:${PORT}`);
});