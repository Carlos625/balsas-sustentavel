// src/controllers/resgateController.js
const resgateRepository = require('../repositories/resgateRepository');

// Criar resgate
exports.criarResgate = async (req, res, next) => {
  try {
    // implementação real depois
    res.status(201).json({ sucesso: true, mensagem: 'Resgate criado (stub)' });
  } catch (error) {
    next(error);
  }
};

// Listar todos os resgates (admin)
exports.getResgates = async (req, res, next) => {
  try {
    res.status(200).json({ sucesso: true, resgates: [] });
  } catch (error) {
    next(error);
  }
};

// Obter um resgate específico
exports.getResgate = async (req, res, next) => {
  try {
    res.status(200).json({ sucesso: true, resgate: null });
  } catch (error) {
    next(error);
  }
};

// Listar resgates do usuário logado
exports.getMeusResgates = async (req, res, next) => {
  try {
    res.status(200).json({ sucesso: true, resgates: [] });
  } catch (error) {
    next(error);
  }
};

// Utilizar resgate
exports.utilizarResgate = async (req, res, next) => {
  try {
    res.status(200).json({ sucesso: true, mensagem: 'Resgate utilizado (stub)' });
  } catch (error) {
    next(error);
  }
};

// Cancelar resgate
exports.cancelarResgate = async (req, res, next) => {
  try {
    res.status(200).json({ sucesso: true, mensagem: 'Resgate cancelado (stub)' });
  } catch (error) {
    next(error);
  }
};

// 🔹 Opções de resgate (público)
exports.getOpcoes = async (req, res, next) => {
  try {
    // Depois você pode buscar isso do banco
    const opcoes = [
      { id: 1, parceiro: 'Supermercado X', pontos: 100, valor: 10.0 },
      { id: 2, parceiro: 'Loja Y', pontos: 200, valor: 25.0 },
    ];

    res.status(200).json({ sucesso: true, opcoes });
  } catch (error) {
    next(error);
  }
};

// 🔹 Estatísticas de resgates (admin)
exports.getEstatisticas = async (req, res, next) => {
  try {
    // Depois você pode chamar resgateRepository.getEstatisticas()
    res.status(200).json({
      sucesso: true,
      estatisticas: {
        totalResgates: 0,
        totalPontosUsados: 0,
      },
    });
  } catch (error) {
    next(error);
  }
};
