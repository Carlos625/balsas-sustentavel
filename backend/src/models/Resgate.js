const mongoose = require('mongoose');

const resgateSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: [true, 'Usuário é obrigatório']
  },
  parceiro: {
    type: String,
    required: [true, 'Parceiro é obrigatório'],
    enum: {
      values: ['combustivel', 'energia', 'supermercado'],
      message: 'Parceiro inválido'
    }
  },
  pontosUtilizados: {
    type: Number,
    required: [true, 'Pontos utilizados são obrigatórios'],
    min: [1, 'Deve utilizar pelo menos 1 ponto']
  },
  valorResgate: {
    type: Number,
    required: [true, 'Valor do resgate é obrigatório'],
    min: [0, 'Valor deve ser positivo']
  },
  codigoResgate: {
    type: String,
    unique: true,
    required: true
  },
  status: {
    type: String,
    enum: ['pendente', 'utilizado', 'expirado', 'cancelado'],
    default: 'pendente'
  },
  dataExpiracao: {
    type: Date,
    required: true
  },
  dataUtilizacao: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Gerar código de resgate único antes de salvar
resgateSchema.pre('save', function(next) {
  if (!this.codigoResgate) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    this.codigoResgate = `BS-${timestamp}-${random}`;
  }

  // Definir data de expiração (30 dias a partir da criação)
  if (!this.dataExpiracao) {
    this.dataExpiracao = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  }

  next();
});

// Índices
resgateSchema.index({ usuario: 1, createdAt: -1 });
resgateSchema.index({ codigoResgate: 1 });
resgateSchema.index({ status: 1 });

module.exports = mongoose.model('Resgate', resgateSchema);
