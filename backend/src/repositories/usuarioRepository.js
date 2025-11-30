const bcrypt = require("bcryptjs");
const connectDB = require("../config/database");

/**
 * Buscar usuário pelo ID
 */
exports.buscarPorId = async (id) => {
  const pool = await connectDB();
  const [rows] = await pool.execute(
    "SELECT id, nome, email, senha, pontos, role, ativo FROM usuarios WHERE id = ? LIMIT 1",
    [id]
  );
  return rows[0] || null;
};

/**
 * Buscar usuário pelo e-mail
 */
exports.buscarPorEmail = async (email) => {
  const pool = await connectDB();
  const [rows] = await pool.execute(
    "SELECT id, nome, email, senha, pontos, role, ativo FROM usuarios WHERE email = ? LIMIT 1",
    [email]
  );
  return rows[0] || null;
};

/**
 * Criar novo usuário
 */
exports.criar = async (usuario) => {
  const pool = await connectDB();
  const { nome, email, senha, pontos = 0, role = "usuario" } = usuario;

  const [result] = await pool.execute(
    `INSERT INTO usuarios (nome, email, senha, pontos, role)
     VALUES (?, ?, ?, ?, ?)`,
    [nome, email, senha, pontos, role]
  );

  return {
    id: result.insertId,
    nome,
    email,
    pontos,
    role,
  };
};

/**
 * Atualizar pontos do usuário
 */
exports.atualizarPontos = async (usuarioId, novosPontos) => {
  const pool = await connectDB();
  await pool.execute(
    "UPDATE usuarios SET pontos = ? WHERE id = ?",
    [novosPontos, usuarioId]
  );

  return { id: usuarioId, pontos: novosPontos };
};

/**
 * Comparar senha com hash (bcrypt)
 */
exports.compararSenha = async (senhaDigitada, senhaHash) => {
  return bcrypt.compare(senhaDigitada, senhaHash);
};
