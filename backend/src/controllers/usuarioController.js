const usuarioRepository = require('../repositories/usuarioRepository');

// @desc    Obter todos os usuários
// @route   GET /api/usuarios
// @access  Private/Admin
exports.getUsuarios = async (req, res, next) => {
  try {
    const usuarios = await usuarioRepository.listarUsuarios();

    res.status(200).json({
      sucesso: true,
      quantidade: usuarios.length,
      usuarios,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obter um usuário por ID
// @route   GET /api/usuarios/:id
// @access  Private
exports.getUsuario = async (req, res, next) => {
  try {
    const usuario = await usuarioRepository.buscarPorId(req.params.id);

    if (!usuario) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Usuário não encontrado',
      });
    }

    res.status(200).json({
      sucesso: true,
      usuario,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Atualizar usuário
// @route   PUT /api/usuarios/:id
// @access  Private
exports.atualizarUsuario = async (req, res, next) => {
  try {
    const { senha, pontos, role, ...dadosAtualizacao } = req.body;

    const usuario = await usuarioRepository.buscarPorId(req.params.id);
    if (!usuario) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Usuário não encontrado',
      });
    }

    if (req.usuario.id !== req.params.id && req.usuario.role !== 'admin') {
      return res.status(403).json({
        sucesso: false,
        mensagem: 'Não autorizado a atualizar este usuário',
      });
    }

    const usuarioAtualizado = await usuarioRepository.atualizarUsuario(
      req.params.id,
      dadosAtualizacao
    );

    res.status(200).json({
      sucesso: true,
      mensagem: 'Usuário atualizado com sucesso',
      usuario: usuarioAtualizado,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Deletar usuário (soft delete)
// @route   DELETE /api/usuarios/:id
// @access  Private/Admin
exports.deletarUsuario = async (req, res, next) => {
  try {
    const usuario = await usuarioRepository.buscarPorId(req.params.id);

    if (!usuario) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Usuário não encontrado',
      });
    }

    await usuarioRepository.desativarUsuario(req.params.id);

    res.status(200).json({
      sucesso: true,
      mensagem: 'Usuário desativado com sucesso',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obter pontos do usuário
// @route   GET /api/usuarios/:id/pontos
// @access  Private
exports.getPontos = async (req, res, next) => {
  try {
    const usuario = await usuarioRepository.buscarPorId(req.params.id);

    if (!usuario) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Usuário não encontrado',
      });
    }

    res.status(200).json({
      sucesso: true,
      pontos: usuario.pontos,
      nome: usuario.nome,
    });
  } catch (error) {
    next(error);
  }
};
