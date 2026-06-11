module.exports = (req, res, next) => {
    if (req.usuario.role !== 'admin') {
        return res.status(403).json({ mensagem: "Acesso negado. Apenas administradores." });
    }
    next();
};