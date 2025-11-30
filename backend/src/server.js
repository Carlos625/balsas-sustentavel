require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/database');

// Conectar ao banco de dados
connectDB();

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║          🌱 BALSAS SUSTENTÁVEL - API REST 🌱             ║
║                                                            ║
║  Servidor rodando em: http://localhost:${PORT}              ║
║  Ambiente: ${process.env.NODE_ENV || 'development'}                          ║
║                                                            ║
║  Endpoints disponíveis:                                    ║
║  • POST   /api/auth/registro                               ║
║  • POST   /api/auth/login                                  ║
║  • GET    /api/auth/me                                     ║
║  • GET    /api/usuarios                                    ║
║  • POST   /api/ocorrencias                                 ║
║  • POST   /api/entregas                                    ║
║  • POST   /api/resgates                                    ║
║  • GET    /api/resgates/opcoes                             ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `);
});

// Tratamento de erros não capturados
process.on('unhandledRejection', (err) => {
  console.error(`Erro não tratado: ${err.message}`);
  server.close(() => process.exit(1));
});
