const express = require('express');
const router = express.Router();
const {
  getUsuarios,
  getUsuario,
  atualizarUsuario,
  deletarUsuario,
  getPontos
} = require('../controllers/usuarioController');
const { proteger, autorizar } = require('../middlewares/auth');

// Todas as rotas requerem autenticação
router.use(proteger);

router.get('/', autorizar('admin'), getUsuarios);
router.get('/:id', getUsuario);
router.put('/:id', atualizarUsuario);
router.delete('/:id', autorizar('admin'), deletarUsuario);
router.get('/:id/pontos', getPontos);

module.exports = router;
