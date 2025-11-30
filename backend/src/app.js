const express = require('express');
const cors = require('cors');
const errorHandler = require('./middlewares/errorHandler');

// Importar rotas
const authRoutes = require('./routes/authRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const ocorrenciaRoutes = require('./routes/ocorrenciaRoutes');
const entregaRoutes = require('./routes/entregaRoutes');
const resgateRoutes = require('./routes/resgateRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota de teste
app.get('/', (req, res) => {
  res.json({
    sucesso: true,
    mensagem: 'API Balsas Sustentável - Sistema de Gestão de Resíduos',
    versao: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      usuarios: '/api/usuarios',
      ocorrencias: '/api/ocorrencias',
      entregas: '/api/entregas',
      resgates: '/api/resgates'
    }
  });
});

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/ocorrencias', ocorrenciaRoutes);
app.use('/api/entregas', entregaRoutes);
app.use('/api/resgates', resgateRoutes);

// Rota 404
app.use((req, res) => {
  res.status(404).json({
    sucesso: false,
    mensagem: 'Rota não encontrada'
  });
});

// Middleware de tratamento de erros (deve ser o último)
app.use(errorHandler);

module.exports = app;
