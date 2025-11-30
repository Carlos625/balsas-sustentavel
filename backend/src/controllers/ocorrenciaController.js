// src/controllers/ocorrenciaController.js
const ocorrenciaRepository = require('../repositories/ocorrenciaRepository');

// @desc    Criar nova ocorrência
// @route   POST /api/ocorrencias
// @access  Private
exports.criarOcorrencia = async (req, res, next) => {
  try {
    // se o middleware proteger colocou o usuário no req
    if (!req.usuario || !req.usuario.id) {
      return res.status(401).json({
        sucesso: false,
        mensagem: 'Usuário não autenticado',
      });
    }

    const usuario_id = req.usuario.id;

    // se estiver usando multer, a imagem vem em req.file
    const foto = req.file ? req.file.filename : (req.body.foto || null);

    const {
      bairro,
      tipo,
      descricao,
      latitude,
      longitude,
      observacoes,
      status,
    } = req.body;

    // LOG pra debug
    console.log('REQ.BODY CRIAR OCORRENCIA:', req.body);
    console.log('REQ.FILE CRIAR OCORRENCIA:', req.file);

    // validações básicas – evita erro de coluna NOT NULL
    if (!bairro || !bairro.trim()) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "O campo 'bairro' é obrigatório.",
      });
    }

    if (!tipo || !tipo.trim()) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "O campo 'tipo' é obrigatório.",
      });
    }

    if (!descricao || !descricao.trim()) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "O campo 'descricao' é obrigatório.",
      });
    }

    const dados = {
      usuario_id,
      bairro: bairro.trim(),
      tipo: tipo.trim(),
      descricao: descricao.trim(),
      foto,
      latitude: latitude === '' ? null : latitude,
      longitude: longitude === '' ? null : longitude,
      status: status || 'pendente',
      observacoes: observacoes || null,
    };

    const ocorrencia = await ocorrenciaRepository.criarOcorrencia(dados);

    res.status(201).json({
      sucesso: true,
      mensagem: 'Ocorrência registrada com sucesso',
      ocorrencia,
    });
  } catch (error) {
    console.error('Erro ao criar ocorrência:', error);
    next(error);
  }
};

// @desc    Listar todas as ocorrências
// @route   GET /api/ocorrencias
// @access  Public
exports.getOcorrencias = async (req, res, next) => {
  try {
    const ocorrencias = await ocorrenciaRepository.listarOcorrencias();

    res.status(200).json({
      sucesso: true,
      total: ocorrencias.length,
      ocorrencias,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obter uma ocorrência específica
// @route   GET /api/ocorrencias/:id
// @access  Public
exports.getOcorrencia = async (req, res, next) => {
  try {
    const ocorrencia = await ocorrenciaRepository.buscarPorId(req.params.id);

    if (!ocorrencia) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Ocorrência não encontrada',
      });
    }

    res.status(200).json({
      sucesso: true,
      ocorrencia,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Listar ocorrências do usuário logado
// @route   GET /api/ocorrencias/user/minhas
// @access  Private
exports.getMinhasOcorrencias = async (req, res, next) => {
  try {
    const ocorrencias = await ocorrenciaRepository.listarPorUsuario(
      req.usuario.id
    );

    res.status(200).json({
      sucesso: true,
      total: ocorrencias.length,
      ocorrencias,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Atualizar status da ocorrência
// @route   PUT /api/ocorrencias/:id/status
// @access  Private (admin)
exports.atualizarStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const statusPermitidos = ['pendente', 'em_andamento', 'resolvido'];

    if (!statusPermitidos.includes(status)) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Status inválido',
      });
    }

    const ocorrencia = await ocorrenciaRepository.atualizarStatus(
      req.params.id,
      status
    );

    if (!ocorrencia) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Ocorrência não encontrada',
      });
    }

    res.status(200).json({
      sucesso: true,
      mensagem: 'Status atualizado com sucesso',
      ocorrencia,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Deletar ocorrência
// @route   DELETE /api/ocorrencias/:id
// @access  Private
exports.deletarOcorrencia = async (req, res, next) => {
  try {
    const ocorrencia = await ocorrenciaRepository.buscarPorId(req.params.id);

    if (!ocorrencia) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Ocorrência não encontrada',
      });
    }

    await ocorrenciaRepository.deletar(req.params.id);

    res.status(200).json({
      sucesso: true,
      mensagem: 'Ocorrência removida com sucesso',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obter estatísticas de ocorrências
// @route   GET /api/ocorrencias/stats
// @access  Public
exports.getEstatisticas = async (req, res, next) => {
  try {
    const estatisticas = await ocorrenciaRepository.getEstatisticas();

    res.status(200).json({
      sucesso: true,
      estatisticas,
    });
  } catch (error) {
    next(error);
  }
};
