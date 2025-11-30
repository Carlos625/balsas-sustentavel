// backend/repositories/resgateRepository.js
const connectDB = require('../config/database');

function gerarCodigoResgate() {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `BS-${timestamp}-${random}`;
}

async function criarResgate(dados) {
  const pool = await connectDB();

  const {
    usuario_id,
    parceiro,
    pontos_utilizados,
    valor_resgate,
    status = 'pendente',
    data_expiracao, // opcional
  } = dados;

  const codigo_resgate = gerarCodigoResgate();

  // 30 dias a partir de hoje se não for informado
  const expiracao =
    data_expiracao ||
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  const [result] = await pool.execute(
    `INSERT INTO resgates
      (usuario_id, parceiro, pontos_utilizados, valor_resgate,
       codigo_resgate, status, data_expiracao)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      usuario_id,
      parceiro,
      pontos_utilizados,
      valor_resgate,
      codigo_resgate,
      status,
      expiracao,
    ]
  );

  return {
    id: result.insertId,
    codigo_resgate,
  };
}

async function buscarPorCodigo(codigo_resgate) {
  const pool = await connectDB();

  const [rows] = await pool.execute(
    'SELECT * FROM resgates WHERE codigo_resgate = ? LIMIT 1',
    [codigo_resgate]
  );

  return rows[0] || null;
}

async function listarPorUsuario(usuario_id) {
  const pool = await connectDB();

  const [rows] = await pool.execute(
    `SELECT *
       FROM resgates
      WHERE usuario_id = ?
      ORDER BY created_at DESC`,
    [usuario_id]
  );

  return rows;
}

async function atualizarStatus(id, novoStatus, dataUtilizacao = null) {
  const pool = await connectDB();

  const [result] = await pool.execute(
    `UPDATE resgates
        SET status = ?,
            data_utilizacao = ?
      WHERE id = ?`,
    [
      novoStatus,
      dataUtilizacao,
      id,
    ]
  );

  return result.affectedRows > 0;
}

module.exports = {
  criarResgate,
  buscarPorCodigo,
  listarPorUsuario,
  atualizarStatus,
};
