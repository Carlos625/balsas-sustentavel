const express = require('express');
const router = express.Router();
const {
  criarEntrega,
  getEntregas,
  getEntrega,
  getMinhasEntregas,
  confirmarEntrega,
  cancelarEntrega,
  getEstatisticas
} = require('../controllers/entregaController');
const { proteger, autorizar } = require('../middlewares/auth');

// Todas as rotas requerem autenticação
router.use(proteger);

router.post('/', criarEntrega);
router.get('/', autorizar('admin'), getEntregas);
router.get('/stats', autorizar('admin'), getEstatisticas);
router.get('/minhas', getMinhasEntregas);
router.get('/:id', getEntrega);
router.put('/:id/confirmar', autorizar('admin'), confirmarEntrega);
router.put('/:id/cancelar', cancelarEntrega);

module.exports = router;
