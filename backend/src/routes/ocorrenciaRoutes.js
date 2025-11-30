// src/routes/ocorrenciaRoutes.js
const express = require('express');
const router = express.Router();
const {
  criarOcorrencia,
  getOcorrencias,
  getOcorrencia,
  getMinhasOcorrencias,
  atualizarStatus,
  deletarOcorrencia,
  getEstatisticas
} = require('../controllers/ocorrenciaController');
const { proteger, autorizar } = require('../middlewares/auth');

const multer = require('multer');

// pasta onde as imagens serão salvas (ajuste conforme seu projeto)
const upload = multer({ dest: 'uploads/' });

// Rotas públicas
router.get('/', getOcorrencias);
router.get('/stats', getEstatisticas);
router.get('/:id', getOcorrencia);

// Rotas protegidas
// aqui adicionamos upload.single('foto') – mesmo nome do campo no FormData
router.post('/', proteger, upload.single('foto'), criarOcorrencia);
router.get('/user/minhas', proteger, getMinhasOcorrencias);
router.put('/:id/status', proteger, autorizar('admin'), atualizarStatus);
router.delete('/:id', proteger, deletarOcorrencia);

module.exports = router;
