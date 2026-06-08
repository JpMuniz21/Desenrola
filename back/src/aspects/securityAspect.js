const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET;

// Este é o nosso Aspecto (Aspect)
const SecurityAspect = {
    // O Advice: A lógica que injetamos antes da função real rodar
    verificarAcesso: function (req, res, next) {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ mensagem: 'Acesso negado: Token não fornecido (Bloqueado pelo Aspecto)' });
        }

        const token = authHeader.split(' ')[1];

        try {
            const usuario = jwt.verify(token, SECRET_KEY);
            req.usuario = usuario;
            
            // Se o aspecto validou, ele permite que o fluxo continue para o Join Point (a rota)
            next();
        } catch (error) {
            return res.status(403).json({ mensagem: 'Acesso negado: Token inválido (Bloqueado pelo Aspecto)' });
        }
    },

    // O Tecelão (Weaver): Função que aplica o aspecto automaticamente nas rotas que quisermos proteger
    proteger: function (handler_da_rota) {
        // Retorna uma sequência onde o Advice roda obrigatoriamente ANTES do handler real da rota
        return [this.verificarAcesso, handler_da_rota];
    }
};

module.exports = SecurityAspect;