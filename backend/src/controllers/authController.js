const jwt = require('jsonwebtoken');
const usuarioRepository = require('../repositories/usuarioRepository');

const gerarToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// @desc    Registrar novo usuário
// @route   POST /api/auth/registro
// @access  Public
exports.registro = async (req, res, next) => {
  try {
    const { nome, email, senha, telefone, endereco } = req.body;

    // Verifica se já existe usuário com esse email
    const existente = await usuarioRepository.buscarPorEmail(email);
    if (existente) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'E-mail já cadastrado',
      });
    }

    // Criar usuário
    const { id } = await usuarioRepository.criarUsuario({
      nome,
      email,
      senha,
      telefone,
      endereco,
    });

    const usuario = await usuarioRepository.buscarPorId(id);

    // Gerar token
    const token = gerarToken(id);

    res.status(201).json({
      sucesso: true,
      mensagem: 'Usuário registrado com sucesso',
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        pontos: usuario.pontos,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login de usuário
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Por favor, informe email e senha',
      });
    }

    const usuario = await usuarioRepository.buscarPorEmail(email);
    if (!usuario) {
      return res.status(401).json({
        sucesso: false,
        mensagem: 'Credenciais inválidas',
      });
    }

    const senhaCorreta = await usuarioRepository.compararSenha(
      senha,
      usuario.senha
    );

    if (!senhaCorreta) {
      return res.status(401).json({
        sucesso: false,
        mensagem: 'Credenciais inválidas',
      });
    }

    if (!usuario.ativo) {
      return res.status(401).json({
        sucesso: false,
        mensagem: 'Usuário inativo',
      });
    }

    const token = gerarToken(usuario.id);

    res.status(200).json({
      sucesso: true,
      mensagem: 'Login realizado com sucesso',
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        pontos: usuario.pontos,
        role: usuario.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obter usuário logado
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const usuario = await usuarioRepository.buscarPorId(req.usuario.id);

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
