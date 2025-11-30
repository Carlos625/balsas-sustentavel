# 🚀 Guia Rápido - Balsas Sustentável API

## Passo a Passo para Rodar a API

### 1. Instalar MongoDB

#### Windows
1. Baixe o MongoDB Community Server: https://www.mongodb.com/try/download/community
2. Instale com as configurações padrão
3. MongoDB geralmente inicia automaticamente como serviço

Ou use MongoDB Atlas (Cloud - Grátis):
- Crie uma conta em: https://www.mongodb.com/cloud/atlas/register
- Crie um cluster gratuito
- Obtenha a string de conexão

### 2. Configurar Variáveis de Ambiente

O arquivo `.env` já foi criado. Edite se necessário:

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/balsas-sustentavel
JWT_SECRET=sua_chave_secreta_muito_segura_aqui_12345
JWT_EXPIRES_IN=7d
```

**Se usar MongoDB Atlas**, altere a MONGODB_URI:
```
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/balsas-sustentavel
```

### 3. Rodar a API

```bash
# Modo desenvolvimento (com auto-reload)
npm run dev

# OU modo produção
npm start
```

Você verá:
```
╔════════════════════════════════════════════════════════════╗
║          🌱 BALSAS SUSTENTÁVEL - API REST 🌱             ║
║  Servidor rodando em: http://localhost:3000              ║
╚════════════════════════════════════════════════════════════╝
```

### 4. Testar a API

Abra o navegador ou Postman e acesse:
```
http://localhost:3000
```

Você deve ver:
```json
{
  "sucesso": true,
  "mensagem": "API Balsas Sustentável - Sistema de Gestão de Resíduos",
  "versao": "1.0.0"
}
```

## 📝 Testando os Endpoints

### Usando Postman, Insomnia ou Thunder Client

#### 1. Registrar Usuário
```
POST http://localhost:3000/api/auth/registro
Content-Type: application/json

{
  "nome": "Teste Silva",
  "email": "teste@email.com",
  "senha": "senha123"
}
```

#### 2. Fazer Login
```
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "teste@email.com",
  "senha": "senha123"
}
```

**Copie o token retornado!**

#### 3. Criar Ocorrência
```
POST http://localhost:3000/api/ocorrencias
Authorization: Bearer SEU_TOKEN_AQUI
Content-Type: application/json

{
  "bairro": "Centro",
  "tipo": "acumulo",
  "descricao": "Teste de ocorrência"
}
```

#### 4. Agendar Entrega
```
POST http://localhost:3000/api/entregas
Authorization: Bearer SEU_TOKEN_AQUI
Content-Type: application/json

{
  "tipoResiduo": "latinhas",
  "peso": 2,
  "postoColeta": "centro",
  "horario": "manha",
  "dataEntrega": "2025-10-25"
}
```

## 🔧 Comandos Úteis

```bash
# Instalar dependências
npm install

# Rodar em modo desenvolvimento
npm run dev

# Rodar em modo produção
npm start

# Ver MongoDB rodando (Windows)
net start | findstr MongoDB
```

## ⚠️ Troubleshooting

### MongoDB não está conectando
- Verifique se o MongoDB está rodando
- Windows: Abra Services e procure por MongoDB
- Ou use MongoDB Atlas (cloud)

### Erro de porta em uso
- Altere a PORT no arquivo .env para outra (ex: 3001)

### Token inválido
- Faça login novamente para obter um novo token
- Certifique-se de incluir "Bearer " antes do token

## 📚 Próximos Passos

1. Teste todos os endpoints usando Postman/Insomnia
2. Conecte o front-end à API
3. Implemente validações adicionais
4. Configure upload de imagens para ocorrências
5. Deploy em produção (Heroku, Railway, Render, etc)

## 🎯 Endpoints Principais

- **Auth**: `/api/auth/registro`, `/api/auth/login`
- **Usuários**: `/api/usuarios`
- **Ocorrências**: `/api/ocorrencias`
- **Entregas**: `/api/entregas`
- **Resgates**: `/api/resgates`

Consulte o [README.md](README.md) completo para todos os endpoints e exemplos detalhados!

---

**Dica**: Use extensões do VS Code como "REST Client" ou "Thunder Client" para testar a API diretamente no editor!
