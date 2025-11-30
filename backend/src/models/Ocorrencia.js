const mongoose = require('mongoose');

const ocorrenciaSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: [true, 'Usuário é obrigatório']
  },
  bairro: {
    type: String,
    required: [true, 'Bairro é obrigatório'],
    trim: true
  },
  tipo: {
    type: String,
    required: [true, 'Tipo de problema é obrigatório'],
    enum: {
      values: ['queimada', 'acumulo', 'descarte'],
      message: 'Tipo deve ser: queimada, acumulo ou descarte'
    }
  },
  descricao: {
    type: String,
    required: [true, 'Descrição é obrigatória'],
    trim: true,
    maxlength: [1000, 'Descrição deve ter no máximo 1000 caracteres']
  },
  foto: {
    type: String, // URL ou caminho da foto
    default: null
  },
  localizacao: {
    latitude: Number,
    longitude: Number
  },
  status: {
    type: String,
    enum: ['pendente', 'em_analise', 'resolvido', 'rejeitado'],
    default: 'pendente'
  },
  dataResolucao: {
    type: Date,
    default: null
  },
  observacoes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Índice para buscar ocorrências por bairro e tipo
ocorrenciaSchema.index({ bairro: 1, tipo: 1 });
ocorrenciaSchema.index({ usuario: 1, createdAt: -1 });

module.exports = mongoose.model('Ocorrencia', ocorrenciaSchema);
