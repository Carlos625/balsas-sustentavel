const connectDB = require('../config/database');

async function criarEntrega(dados) {
  const pool = await connectDB();

  const {
    usuario,
    tipoResiduo,
    peso,
    postoColeta,
    horario,
    dataEntrega,
    pontosGanhos = 0,
    status = 'concluido',
    observacoes = null,
  } = dados;

  const [result] = await pool.execute(
    `INSERT INTO entregas
      (usuario_id, tipoResiduo, peso, postoColeta, horario,
       dataEntrega, pontosGanhos, status, observacoes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      usuario,
      tipoResiduo,
      peso,
      postoColeta,
      horario,
      dataEntrega,
      pontosGanhos,
      status,
      observacoes,
    ]
  );

  const [rows] = await pool.execute(
    'SELECT * FROM entregas WHERE id = ?',
    [result.insertId]
  );

  return rows[0];
}

async function listarEntregas(filtro = {}) {
  const pool = await connectDB();

  const params = [];
  let query = 'SELECT * FROM entregas WHERE 1=1';

  if (filtro.status) {
    query += ' AND status = ?';
    params.push(filtro.status);
  }
  if (filtro.postoColeta) {
    query += ' AND postoColeta = ?';
    params.push(filtro.postoColeta);
  }
  if (filtro.tipoResiduo) {
    query += ' AND tipoResiduo = ?';
    params.push(filtro.tipoResiduo);
  }

  query += ' ORDER BY created_at DESC';

  const [rows] = await pool.execute(query, params);
  return rows;
}

async function buscarPorId(id) {
  const pool = await connectDB();
  const [rows] = await pool.execute(
    'SELECT * FROM entregas WHERE id = ? LIMIT 1',
    [id]
  );
  return rows[0] || null;
}

async function listarPorUsuario(usuarioId) {
  const pool = await connectDB();
  const [rows] = await pool.execute(
    'SELECT * FROM entregas WHERE usuario_id = ? ORDER BY created_at DESC',
    [usuarioId]
  );
  return rows;
}

async function atualizarStatus(id, status) {
  const pool = await connectDB();
  await pool.execute('UPDATE entregas SET status = ? WHERE id = ?', [
    status,
    id,
  ]);
}

async function getEstatisticas() {
  const pool = await connectDB();

  const [porTipoResiduo] = await pool.execute(
    `SELECT tipoResiduo AS _id,
            COUNT(*) AS totalEntregas,
            SUM(peso) AS pesoTotal,
            SUM(pontosGanhos) AS pontosTotal
       FROM entregas
      GROUP BY tipoResiduo`
  );

  const [porPosto] = await pool.execute(
    `SELECT postoColeta AS _id,
            COUNT(*) AS total,
            SUM(peso) AS pesoTotal
       FROM entregas
      GROUP BY postoColeta`
  );

  return {
    porTipoResiduo,
    porPosto,
  };
}

module.exports = {
  criarEntrega,
  listarEntregas,
  buscarPorId,
  listarPorUsuario,
  atualizarStatus,
  getEstatisticas,
};
