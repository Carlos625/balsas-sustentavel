const jwt = require('jsonwebtoken');

// Middleware para proteger rotas
exports.proteger = (req, res, next) => {
  try {
    let token;

    // Pega o token do header: Authorization: Bearer xxx
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        sucesso: false,
        mensagem: 'Não autorizado. Token não fornecido.',
      });
    }

    try {
      // Decodifica o token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Aqui a gente só guarda o id que veio no token
      req.usuario = {
        id: decoded.id,
      };

      return next();
    } catch (error) {
      console.error('Erro ao verificar token:', error.name, error.message);
      return res.status(401).json({
        sucesso: false,
        mensagem: 'Token inválido ou expirado',
      });
    }
  } catch (error) {
    return res.status(500).json({
      sucesso: false,
      mensagem: 'Erro no servidor ao validar token',
      erro: error.message,
    });
  }
};

// Autorizar roles específicos (admin etc) – por enquanto fica simples
exports.autorizar = (...roles) => {
  return (req, res, next) => {
    // Se depois você quiser usar papel/role, é só adicionar no token
    // e preencher aqui em req.usuario.role
    return next();
  };
};
