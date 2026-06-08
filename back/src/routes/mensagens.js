const express = require('express');
const router = express.Router();
const connection = require('../config/database');
const SecurityAspect = require('../aspects/securityAspect'); // POA Ativo aqui


// Handler: Buscar Histórico de Mensagens entre dois usuários
const buscarHistoricoHandler = async (req, res) => {
    const { id1, id2 } = req.params;

    try {
        const result = await connection.query(
            `SELECT id_mensagem, conteudo, data_envio, id_remetente, id_destinatario 
             FROM mensagem 
             WHERE (id_remetente = $1 AND id_destinatario = $2)
             OR (id_remetente = $2 AND id_destinatario = $1)
             ORDER BY data_envio ASC`,
            [id1, id2]
        );
        
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar histórico de mensagens:', error);
        res.status(500).json({ erro: 'Erro ao buscar mensagens no banco de dados' });
    }
};

// O SecurityAspect intercepta a requisição antes de entregar para o Handler
router.get('/:id1/:id2', SecurityAspect.proteger(buscarHistoricoHandler));

module.exports = router;