const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const usuarioSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Nome é obrigatório'],
    trim: true,
    maxlength: [100, 'Nome deve ter no máximo 100 caracteres']
  },
  email: {
    type: String,
    required: [true, 'Email é obrigatório'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Email inválido']
  },
  senha: {
    type: String,
    required: [true, 'Senha é obrigatória'],
    minlength: [6, 'Senha deve ter no mínimo 6 caracteres'],
    select: false // Não retorna a senha nas consultas por padrão
  },
  telefone: {
    type: String,
    trim: true
  },
  endereco: {
    rua: String,
    numero: String,
    bairro: String,
    cidade: {
      type: String,
      default: 'Balsas'
    },
    estado: {
      type: String,
      default: 'MA'
    },
    cep: String
  },
  pontos: {
    type: Number,
    default: 0,
    min: [0, 'Pontos não podem ser negativos']
  },
  role: {
    type: String,
    enum: ['usuario', 'admin'],
    default: 'usuario'
  },
  ativo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true // Cria automaticamente createdAt e updatedAt
});

// Hash da senha antes de salvar
usuarioSchema.pre('save', async function(next) {
  if (!this.isModified('senha')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.senha = await bcrypt.hash(this.senha, salt);
  next();
});

// Método para comparar senhas
usuarioSchema.methods.compararSenha = async function(senhaInformada) {
  return await bcrypt.compare(senhaInformada, this.senha);
};

module.exports = mongoose.model('Usuario', usuarioSchema);
