const express = require('express');
const router = express.Router();
const {
  criarResgate,
  getResgates,
  getResgate,
  getMeusResgates,
  utilizarResgate,
  cancelarResgate,
  getOpcoes,
  getEstatisticas
} = require('../controllers/resgateController');
const { proteger, autorizar } = require('../middlewares/auth');

// Rota pública
router.get('/opcoes', getOpcoes);

// Rotas protegidas
router.use(proteger);

router.post('/', criarResgate);
router.get('/', autorizar('admin'), getResgates);
router.get('/stats', autorizar('admin'), getEstatisticas);
router.get('/meus', getMeusResgates);
router.get('/:id', getResgate);
router.put('/:id/utilizar', autorizar('admin'), utilizarResgate);
router.put('/:id/cancelar', cancelarResgate);

module.exports = router;
