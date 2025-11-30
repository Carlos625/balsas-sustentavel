# API RESTful - Balsas Sustentável

API REST para o sistema de gestão de resíduos da cidade de Balsas (MA). Desenvolvida com Node.js, Express.js e MongoDB.

## 📋 Sumário

- [Recursos](#recursos)
- [Tecnologias](#tecnologias)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Executando](#executando)
- [Endpoints da API](#endpoints-da-api)
- [Modelos de Dados](#modelos-de-dados)
- [Autenticação](#autenticação)
- [Exemplos de Uso](#exemplos-de-uso)

## 🚀 Recursos

- **Autenticação JWT** - Sistema seguro de login e registro
- **Gestão de Usuários** - CRUD completo de usuários
- **Sistema de Pontos** - Acúmulo e gestão de pontos por entregas
- **Registro de Ocorrências** - Denúncias de problemas ambientais
- **Agendamento de Entregas** - Pré-cadastro de entregas de resíduos
- **Resgate de Benefícios** - Troca de pontos por benefícios
- **Estatísticas** - Relatórios e métricas do sistema

## 🛠 Tecnologias

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MongoDB** - Banco de dados NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticação via tokens
- **bcryptjs** - Criptografia de senhas
- **dotenv** - Gerenciamento de variáveis de ambiente
- **CORS** - Controle de acesso cross-origin

## 📦 Instalação

### Pré-requisitos

- Node.js (v14 ou superior)
- MongoDB (v4.4 ou superior)
- npm ou yarn

### Passos

1. Clone o repositório:
```bash
cd backend
```

2. Instale as dependências:
```bash
npm install
```

## ⚙️ Configuração

1. Copie o arquivo `.env.example` para `.env`:
```bash
cp .env.example .env
```

2. Configure as variáveis de ambiente no arquivo `.env`:
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/balsas-sustentavel
JWT_SECRET=sua_chave_secreta_aqui
JWT_EXPIRES_IN=7d
```

3. Certifique-se de que o MongoDB está rodando:
```bash
# Windows
net start MongoDB

# Linux/Mac
sudo systemctl start mongod
```

## ▶️ Executando

### Modo Desenvolvimento (com auto-reload):
```bash
npm run dev
```

### Modo Produção:
```bash
npm start
```

A API estará disponível em: `http://localhost:3000`

## 📚 Endpoints da API

### Autenticação

#### Registrar Usuário
```http
POST /api/auth/registro
Content-Type: application/json

{
  "nome": "João Silva",
  "email": "joao@email.com",
  "senha": "senha123",
  "telefone": "(99) 98765-4321"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "joao@email.com",
  "senha": "senha123"
}
```

#### Obter Usuário Logado
```http
GET /api/auth/me
Authorization: Bearer {token}
```

### Usuários

#### Listar Todos os Usuários (Admin)
```http
GET /api/usuarios
Authorization: Bearer {token}
```

#### Obter Usuário por ID
```http
GET /api/usuarios/:id
Authorization: Bearer {token}
```

#### Atualizar Usuário
```http
PUT /api/usuarios/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "nome": "João Silva Santos",
  "telefone": "(99) 99999-9999"
}
```

#### Obter Pontos do Usuário
```http
GET /api/usuarios/:id/pontos
Authorization: Bearer {token}
```

### Ocorrências (Denúncias)

#### Criar Ocorrência
```http
POST /api/ocorrencias
Authorization: Bearer {token}
Content-Type: application/json

{
  "bairro": "Centro",
  "tipo": "acumulo",
  "descricao": "Lixo acumulado na Rua Principal",
  "foto": "url_da_foto.jpg"
}
```

#### Listar Ocorrências
```http
GET /api/ocorrencias
GET /api/ocorrencias?bairro=Centro
GET /api/ocorrencias?tipo=queimada
GET /api/ocorrencias?status=pendente
```

#### Obter Ocorrência por ID
```http
GET /api/ocorrencias/:id
```

#### Minhas Ocorrências
```http
GET /api/ocorrencias/user/minhas
Authorization: Bearer {token}
```

#### Atualizar Status (Admin)
```http
PUT /api/ocorrencias/:id/status
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "resolvido",
  "observacoes": "Problema solucionado pela equipe"
}
```

#### Estatísticas de Ocorrências
```http
GET /api/ocorrencias/stats
```

### Entregas de Resíduos

#### Agendar Entrega
```http
POST /api/entregas
Authorization: Bearer {token}
Content-Type: application/json

{
  "tipoResiduo": "latinhas",
  "peso": 2.5,
  "postoColeta": "centro",
  "horario": "manha",
  "dataEntrega": "2025-10-25"
}
```

#### Minhas Entregas
```http
GET /api/entregas/minhas
Authorization: Bearer {token}
```

#### Listar Todas as Entregas (Admin)
```http
GET /api/entregas
Authorization: Bearer {token}
```

#### Confirmar Entrega (Admin)
```http
PUT /api/entregas/:id/confirmar
Authorization: Bearer {token}
```

#### Cancelar Entrega
```http
PUT /api/entregas/:id/cancelar
Authorization: Bearer {token}
```

#### Estatísticas de Entregas (Admin)
```http
GET /api/entregas/stats
Authorization: Bearer {token}
```

### Resgates de Pontos

#### Opções de Resgate
```http
GET /api/resgates/opcoes
```

#### Criar Resgate
```http
POST /api/resgates
Authorization: Bearer {token}
Content-Type: application/json

{
  "parceiro": "combustivel",
  "pontosUtilizados": 500
}
```

#### Meus Resgates
```http
GET /api/resgates/meus
Authorization: Bearer {token}
```

#### Utilizar Resgate (Admin)
```http
PUT /api/resgates/:id/utilizar
Authorization: Bearer {token}
```

#### Cancelar Resgate
```http
PUT /api/resgates/:id/cancelar
Authorization: Bearer {token}
```

## 📊 Modelos de Dados

### Usuário
```javascript
{
  nome: String,
  email: String (único),
  senha: String (hash),
  telefone: String,
  endereco: {
    rua, numero, bairro, cidade, estado, cep
  },
  pontos: Number (default: 0),
  role: String (usuario/admin),
  ativo: Boolean,
  createdAt, updatedAt
}
```

### Ocorrência
```javascript
{
  usuario: ObjectId,
  bairro: String,
  tipo: String (queimada/acumulo/descarte),
  descricao: String,
  foto: String,
  status: String (pendente/em_analise/resolvido/rejeitado),
  createdAt, updatedAt
}
```

### Entrega
```javascript
{
  usuario: ObjectId,
  tipoResiduo: String (latinhas/plastico/papel/vidro/metal/eletronicos),
  peso: Number,
  postoColeta: String (centro/jk/caic/camara),
  horario: String (manha/tarde),
  dataEntrega: Date,
  pontosGanhos: Number,
  status: String (agendado/confirmado/cancelado/concluido),
  createdAt, updatedAt
}
```

### Resgate
```javascript
{
  usuario: ObjectId,
  parceiro: String (combustivel/energia/supermercado),
  pontosUtilizados: Number,
  valorResgate: Number,
  codigoResgate: String (único),
  status: String (pendente/utilizado/expirado/cancelado),
  dataExpiracao: Date,
  createdAt, updatedAt
}
```

## 🔐 Autenticação

A API utiliza JWT (JSON Web Tokens) para autenticação. Após o login, você receberá um token que deve ser incluído no header de todas as requisições protegidas:

```
Authorization: Bearer {seu_token_aqui}
```

## 💡 Exemplos de Uso

### Fluxo Completo de Usuário

1. **Registrar**
```bash
curl -X POST http://localhost:3000/api/auth/registro \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Maria Santos",
    "email": "maria@email.com",
    "senha": "senha123"
  }'
```

2. **Login**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "maria@email.com",
    "senha": "senha123"
  }'
```

3. **Agendar Entrega**
```bash
curl -X POST http://localhost:3000/api/entregas \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "tipoResiduo": "latinhas",
    "peso": 1.5,
    "postoColeta": "centro",
    "horario": "manha",
    "dataEntrega": "2025-10-25"
  }'
```

4. **Resgatar Pontos**
```bash
curl -X POST http://localhost:3000/api/resgates \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "parceiro": "supermercado",
    "pontosUtilizados": 400
  }'
```

## 📈 Sistema de Pontos

### Tabela de Pontos por Resíduo
- Latinhas de Alumínio: **50 pts/kg**
- Metal: **30 pts/kg**
- Plástico: **20 pts/kg**
- Papel/Papelão: **15 pts/kg**
- Vidro: **10 pts/kg**
- Eletrônicos: **100 pts/kg**

### Tabela de Resgates
**Combustível:**
- 500 pts = R$ 10,00
- 1000 pts = R$ 25,00
- 2000 pts = R$ 55,00

**Energia:**
- 600 pts = R$ 15,00
- 1200 pts = R$ 35,00
- 2500 pts = R$ 75,00

**Supermercado:**
- 400 pts = R$ 10,00
- 800 pts = R$ 22,00
- 1500 pts = R$ 45,00

## 🔧 Desenvolvimento

### Estrutura de Pastas
```
backend/
├── src/
│   ├── config/         # Configurações (BD, etc)
│   ├── controllers/    # Lógica de negócio
│   ├── middlewares/    # Middlewares (auth, errors)
│   ├── models/         # Schemas do MongoDB
│   ├── routes/         # Rotas da API
│   ├── utils/          # Funções utilitárias
│   ├── app.js          # Configuração do Express
│   └── server.js       # Inicialização do servidor
├── .env                # Variáveis de ambiente
├── .env.example        # Exemplo de variáveis
├── .gitignore          # Arquivos ignorados pelo Git
├── package.json        # Dependências
└── README.md           # Documentação
```

## 📝 Licença

MIT

## 👥 Autores

Projeto Extensionista - Unibalsas 2025.2

---

**Balsas Sustentável** - Gestão Inteligente de Resíduos
