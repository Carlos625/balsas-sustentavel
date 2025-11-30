// Middleware para tratamento de erros
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log do erro no console (desenvolvimento)
  if (process.env.NODE_ENV === 'development') {
    console.error(err);
  }

  // Erro de validação do Mongoose
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(e => e.message);
    error.message = message;
    return res.status(400).json({
      sucesso: false,
      mensagem: 'Erro de validação',
      erros: message
    });
  }

  // Erro de campo duplicado no MongoDB
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field} já está cadastrado`;
    return res.status(400).json({
      sucesso: false,
      mensagem: message
    });
  }

  // Erro de CastError do Mongoose (ID inválido)
  if (err.name === 'CastError') {
    const message = 'ID inválido';
    return res.status(404).json({
      sucesso: false,
      mensagem: message
    });
  }

  res.status(error.statusCode || 500).json({
    sucesso: false,
    mensagem: error.message || 'Erro no servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
