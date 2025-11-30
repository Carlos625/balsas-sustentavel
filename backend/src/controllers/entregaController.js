const entregaRepository = require('../repositories/entregaRepository');
const connectDB = require('../config/database');

// função auxiliar para calcular pontos com base no tipo + peso
function calcularPontos(tipoResiduo, peso) {
  const pesoNumber = Number(peso);
  if (!tipoResiduo || isNaN(pesoNumber) || pesoNumber <= 0) return 0;

  const pontosPorKg = {
    latinhas: 50,
    plastico: 20,
    papel: 15,
    vidro: 10,
    metal: 30,
    eletronicos: 100,
  };

  const valor = pontosPorKg[tipoResiduo] ?? 0;
  return Math.floor(valor * pesoNumber);
}

// @desc    Criar nova entrega de resíduos
// @route   POST /api/entregas
// @access  Private
exports.criarEntrega = async (req, res, next) => {
  try {
    const userId = req.usuario.id;

    // garante que a entrega é vinculada ao usuário logado
    req.body.usuario = userId;

    // por enquanto, salva como concluído diretamente (como você comentou)
    if (!req.body.status) {
      req.body.status = 'concluido';
    }

    const { tipoResiduo, peso } = req.body;

    // 🔹 calcula os pontos dessa entrega
    const pontosGanhos = calcularPontos(tipoResiduo, peso);

    // salva no body para ir pro banco
    req.body.pontosGanhos = pontosGanhos;

    console.log('CRIAR ENTREGA - BODY FINAL:', req.body);

    // cria a entrega no banco
    const entrega = await entregaRepository.criarEntrega(req.body);

    // ----- ATUALIZAÇÃO DOS PONTOS DO USUÁRIO -----
    const pool = await connectDB();

    // busca pontos atuais do usuário
    const [rows] = await pool.execute(
      'SELECT pontos FROM usuarios WHERE id = ? LIMIT 1',
      [userId]
    );

    const pontosAtuais = rows?.[0]?.pontos || 0;
    const novosPontos = pontosAtuais + pontosGanhos;

    console.log('ATUALIZANDO PONTOS USUARIO:', {
      userId,
      pontosAtuais,
      pontosGanhos,
      novosPontos,
    });

    // atualiza saldo de pontos do usuário
    await pool.execute(
      'UPDATE usuarios SET pontos = ? WHERE id = ?',
      [novosPontos, userId]
    );

    // responde para o frontend com tudo que ele precisa
    res.status(201).json({
      sucesso: true,
      mensagem: 'Entrega agendada com sucesso',
      entrega,
      pontosGanhos,
      novoSaldoPontos: novosPontos,
    });
  } catch (error) {
    console.error('Erro ao criar entrega:', error);
    next(error);
  }
};

// @desc    Obter todas as entregas
// @route   GET /api/entregas
// @access  Private/Admin
exports.getEntregas = async (req, res, next) => {
  try {
    const { status, postoColeta, tipoResiduo } = req.query;

    const entregas = await entregaRepository.listarEntregas({
      status,
      postoColeta,
      tipoResiduo,
    });

    res.status(200).json({
      sucesso: true,
      quantidade: entregas.length,
      entregas,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obter uma entrega por ID
// @route   GET /api/entregas/:id
// @access  Private
exports.getEntrega = async (req, res, next) => {
  try {
    const entrega = await entregaRepository.buscarPorId(req.params.id);

    if (!entrega) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Entrega não encontrada',
      });
    }

    if (
      entrega.usuario_id !== Number(req.usuario.id) &&
      req.usuario.role !== 'admin'
    ) {
      return res.status(403).json({
        sucesso: false,
        mensagem: 'Não autorizado a acessar esta entrega',
      });
    }

    res.status(200).json({
      sucesso: true,
      entrega,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obter entregas do usuário logado
// @route   GET /api/entregas/minhas
// @access  Private
exports.getMinhasEntregas = async (req, res, next) => {
  try {
    const entregas = await entregaRepository.listarPorUsuario(req.usuario.id);

    res.status(200).json({
      sucesso: true,
      quantidade: entregas.length,
      entregas,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Confirmar entrega (fluxo opcional, se usar status 'agendado')
// @route   PUT /api/entregas/:id/confirmar
// @access  Private/Admin
exports.confirmarEntrega = async (req, res, next) => {
  try {
    const entrega = await entregaRepository.buscarPorId(req.params.id);

    if (!entrega) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Entrega não encontrada',
      });
    }

    if (entrega.status !== 'agendado') {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Esta entrega não pode ser confirmada',
      });
    }

    // atualiza status para concluído
    await entregaRepository.atualizarStatus(entrega.id, 'concluido');

    const userId = entrega.usuario_id;
    const pontosEntrega = entrega.pontosGanhos || 0;

    const pool = await connectDB();

    const [rows] = await pool.execute(
      'SELECT pontos FROM usuarios WHERE id = ? LIMIT 1',
      [userId]
    );

    const pontosAtuais = rows?.[0]?.pontos || 0;
    const novosPontos = pontosAtuais + pontosEntrega;

    await pool.execute(
      'UPDATE usuarios SET pontos = ? WHERE id = ?',
      [novosPontos, userId]
    );

    res.status(200).json({
      sucesso: true,
      mensagem: `Entrega confirmada! ${pontosEntrega} pontos adicionados.`,
      entrega: { ...entrega, status: 'concluido' },
      novoSaldoPontos: novosPontos,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancelar entrega
// @route   PUT /api/entregas/:id/cancelar
// @access  Private
exports.cancelarEntrega = async (req, res, next) => {
  try {
    const entrega = await entregaRepository.buscarPorId(req.params.id);

    if (!entrega) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Entrega não encontrada',
      });
    }

    if (
      entrega.usuario_id !== Number(req.usuario.id) &&
      req.usuario.role !== 'admin'
    ) {
      return res.status(403).json({
        sucesso: false,
        mensagem: 'Não autorizado a cancelar esta entrega',
      });
    }

    if (entrega.status === 'concluido') {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Não é possível cancelar uma entrega concluída',
      });
    }

    await entregaRepository.atualizarStatus(entrega.id, 'cancelado');

    res.status(200).json({
      sucesso: true,
      mensagem: 'Entrega cancelada com sucesso',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obter estatísticas de entregas
// @route   GET /api/entregas/stats
// @access  Private/Admin
exports.getEstatisticas = async (req, res, next) => {
  try {
    const estatisticas = await entregaRepository.getEstatisticas();

    res.status(200).json({
      sucesso: true,
      estatisticas,
    });
  } catch (error) {
    next(error);
  }
};
