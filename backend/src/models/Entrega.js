const mongoose = require('mongoose');

const entregaSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: [true, 'Usuário é obrigatório']
  },
  tipoResiduo: {
    type: String,
    required: [true, 'Tipo de resíduo é obrigatório'],
    enum: {
      values: ['latinhas', 'plastico', 'papel', 'vidro', 'metal', 'eletronicos'],
      message: 'Tipo de resíduo inválido'
    }
  },
  peso: {
    type: Number,
    required: [true, 'Peso é obrigatório'],
    min: [0.1, 'Peso mínimo é 0.1 kg'],
    max: [1000, 'Peso máximo é 1000 kg']
  },
  postoColeta: {
    type: String,
    required: [true, 'Posto de coleta é obrigatório'],
    enum: {
      values: ['centro', 'jk', 'caic', 'camara'],
      message: 'Posto de coleta inválido'
    }
  },
  horario: {
    type: String,
    required: [true, 'Horário é obrigatório'],
    enum: {
      values: ['manha', 'tarde'],
      message: 'Horário deve ser manhã ou tarde'
    }
  },
  dataEntrega: {
    type: Date,
    required: [true, 'Data de entrega é obrigatória']
  },
  pontosGanhos: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['agendado', 'confirmado', 'cancelado', 'concluido'],
    default: 'concluido'
  },
  observacoes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Calcular pontos automaticamente antes de salvar
entregaSchema.pre('save', function(next) {
  const tabelaPontos = {
    latinhas: 50,
    plastico: 20,
    papel: 15,
    vidro: 10,
    metal: 30,
    eletronicos: 100
  };

  this.pontosGanhos = Math.floor(tabelaPontos[this.tipoResiduo] * this.peso);
  next();
});

// Índices para consultas frequentes
entregaSchema.index({ usuario: 1, createdAt: -1 });
entregaSchema.index({ status: 1, dataEntrega: 1 });

module.exports = mongoose.model('Entrega', entregaSchema);
