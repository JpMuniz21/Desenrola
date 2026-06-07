const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET;

function autenticarToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ mensagem: 'Token não fornecido' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const usuario = jwt.verify(token, SECRET_KEY);
        req.usuario = usuario;
        next();
    } catch (error) {
        return res.status(403).json({ mensagem: 'Token inválido' });
    }
}

module.exports = autenticarToken;