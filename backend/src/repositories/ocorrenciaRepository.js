// src/repositories/ocorrenciaRepository.js
const connectDB = require('../config/database');

// helper simples pra evitar undefined nos binds
function toNull(value) {
  return value === undefined ? null : value;
}

async function criarOcorrencia(dados) {
  const pool = await connectDB();

  const {
    usuario_id,
    bairro,
    tipo,
    descricao,
    foto,
    latitude,
    longitude,
    status,
    observacoes
  } = dados;

  // latitude/longitude podem vir como "" (string vazia) → converto pra null
  const lat = latitude === '' || latitude === undefined ? null : latitude;
  const lon = longitude === '' || longitude === undefined ? null : longitude;

  // LOG pra você ver o que está chegando antes do INSERT
  console.log('DADOS RECEBIDOS NO REPOSITORY:', {
    usuario_id,
    bairro,
    tipo,
    descricao,
    foto,
    latitude: lat,
    longitude: lon,
    status: status || 'pendente',
    observacoes
  });

  const [result] = await pool.execute(
    `INSERT INTO ocorrencias
     (usuario_id, bairro, tipo, descricao, foto, latitude, longitude, status, observacoes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      toNull(usuario_id),
      bairro,                     // aqui NÃO converto pra null, pq é obrigatório
      tipo,                       // idem
      toNull(descricao),
      toNull(foto),
      toNull(lat),
      toNull(lon),
      status || 'pendente',
      toNull(observacoes)
    ]
  );

  const [rows] = await pool.execute(
    'SELECT * FROM ocorrencias WHERE id = ?',
    [result.insertId]
  );

  return rows[0];
}

async function listarOcorrencias() {
  const pool = await connectDB();
  const [rows] = await pool.execute(
    'SELECT * FROM ocorrencias ORDER BY created_at DESC'
  );
  return rows;
}

async function buscarPorId(id) {
  const pool = await connectDB();
  const [rows] = await pool.execute(
    'SELECT * FROM ocorrencias WHERE id = ?',
    [id]
  );
  return rows[0] || null;
}

async function listarPorUsuario(usuarioId) {
  const pool = await connectDB();
  const [rows] = await pool.execute(
    'SELECT * FROM ocorrencias WHERE usuario_id = ? ORDER BY created_at DESC',
    [usuarioId]
  );
  return rows;
}

async function atualizarStatus(id, novoStatus) {
  const pool = await connectDB();
  await pool.execute(
    'UPDATE ocorrencias SET status = ? WHERE id = ?',
    [novoStatus, id]
  );

  const [rows] = await pool.execute(
    'SELECT * FROM ocorrencias WHERE id = ?',
    [id]
  );

  return rows[0] || null;
}

async function deletar(id) {
  const pool = await connectDB();
  await pool.execute(
    'DELETE FROM ocorrencias WHERE id = ?',
    [id]
  );
}

// 🔹 estatísticas (se você estiver usando)
async function getEstatisticas() {
  const pool = await connectDB();

  const [porTipo] = await pool.execute(
    `SELECT tipo AS tipo, COUNT(*) AS total
     FROM ocorrencias
     GROUP BY tipo
     ORDER BY total DESC`
  );

  const [porBairro] = await pool.execute(
    `SELECT bairro AS bairro, COUNT(*) AS total
     FROM ocorrencias
     GROUP BY bairro
     ORDER BY total DESC`
  );

  return { porTipo, porBairro };
}

module.exports = {
  criarOcorrencia,
  listarOcorrencias,
  buscarPorId,
  listarPorUsuario,
  atualizarStatus,
  deletar,
  getEstatisticas,
};
