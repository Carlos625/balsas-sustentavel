# 📖 Documentação Completa dos Endpoints - API Balsas Sustentável

## 📋 Índice

1. [Como Importar no Postman](#como-importar-no-postman)
2. [Autenticação](#autenticação)
3. [Usuários](#usuários)
4. [Ocorrências](#ocorrências)
5. [Entregas](#entregas)
6. [Resgates](#resgates)
7. [Códigos de Status HTTP](#códigos-de-status-http)
8. [Exemplos de Fluxo Completo](#exemplos-de-fluxo-completo)

---

## 🚀 Como Importar no Postman

1. Abra o Postman
2. Clique em **Import** (canto superior esquerdo)
3. Selecione o arquivo `Balsas_Sustentavel_API.postman_collection.json`
4. A collection será importada com todos os endpoints prontos para uso
5. Configure a variável `{{baseUrl}}` se necessário (padrão: `http://localhost:3000/api`)

---

## 🔐 AUTENTICAÇÃO

### 1. Registrar Usuário

**Descrição**: Cria uma nova conta de usuário no sistema.

```http
POST /api/auth/registro
Content-Type: application/json
```

**Body:**
```json
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "senha": "senha123",
  "telefone": "(99) 98765-4321"
}
```

**Resposta de Sucesso (201):**
```json
{
  "sucesso": true,
  "mensagem": "Usuário registrado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": "67123abc...",
    "nome": "João Silva",
    "email": "joao@email.com",
    "pontos": 0
  }
}
```

**Validações:**
- Nome é obrigatório
- Email deve ser único e válido
- Senha mínimo 6 caracteres
- Telefone é opcional

**Erros Comuns:**
- `400`: Email já cadastrado
- `400`: Dados de validação inválidos

---

### 2. Login

**Descrição**: Autentica o usuário e retorna token JWT.

```http
POST /api/auth/login
Content-Type: application/json
```

**Body:**
```json
{
  "email": "joao@email.com",
  "senha": "senha123"
}
```

**Resposta de Sucesso (200):**
```json
{
  "sucesso": true,
  "mensagem": "Login realizado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": "67123abc...",
    "nome": "João Silva",
    "email": "joao@email.com",
    "pontos": 150,
    "role": "usuario"
  }
}
```

**⚠️ IMPORTANTE**: Copie o token retornado! Ele deve ser usado no header `Authorization: Bearer {token}` em todas as rotas protegidas.

**Erros Comuns:**
- `401`: Credenciais inválidas
- `401`: Usuário inativo
- `400`: Email ou senha não fornecidos

---

### 3. Obter Usuário Logado

**Descrição**: Retorna os dados do usuário atualmente autenticado.

```http
GET /api/auth/me
Authorization: Bearer {seu_token}
```

**Resposta de Sucesso (200):**
```json
{
  "sucesso": true,
  "usuario": {
    "id": "67123abc...",
    "nome": "João Silva",
    "email": "joao@email.com",
    "telefone": "(99) 98765-4321",
    "pontos": 150,
    "role": "usuario",
    "endereco": {
      "cidade": "Balsas",
      "estado": "MA"
    },
    "createdAt": "2025-10-19T10:30:00.000Z"
  }
}
```

**Erros Comuns:**
- `401`: Token não fornecido
- `401`: Token inválido ou expirado

---

## 👥 USUÁRIOS

### 1. Listar Todos os Usuários

**Descrição**: Lista todos os usuários cadastrados. **APENAS ADMIN**.

```http
GET /api/usuarios
Authorization: Bearer {token_admin}
```

**Resposta de Sucesso (200):**
```json
{
  "sucesso": true,
  "quantidade": 25,
  "usuarios": [
    {
      "id": "67123abc...",
      "nome": "João Silva",
      "email": "joao@email.com",
      "pontos": 150,
      "role": "usuario",
      "ativo": true
    },
    ...
  ]
}
```

**Permissões:** Apenas administradores

**Erros Comuns:**
- `403`: Usuário não tem permissão (não é admin)

---

### 2. Obter Usuário por ID

**Descrição**: Retorna dados de um usuário específico.

```http
GET /api/usuarios/{id}
Authorization: Bearer {token}
```

**Resposta de Sucesso (200):**
```json
{
  "sucesso": true,
  "usuario": {
    "id": "67123abc...",
    "nome": "João Silva",
    "email": "joao@email.com",
    "pontos": 150,
    "endereco": { ... }
  }
}
```

**Erros Comuns:**
- `404`: Usuário não encontrado
- `404`: ID inválido

---

### 3. Atualizar Usuário

**Descrição**: Atualiza dados do usuário. Usuário só pode atualizar seu próprio perfil (exceto admins).

```http
PUT /api/usuarios/{id}
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "nome": "João Silva Santos",
  "telefone": "(99) 99999-9999",
  "endereco": {
    "rua": "Rua Principal",
    "numero": "123",
    "bairro": "Centro",
    "cep": "65800-000"
  }
}
```

**Campos NÃO atualizáveis via esta rota:**
- `senha` (use rota específica)
- `pontos` (alterado apenas pelo sistema)
- `role` (apenas admin pode alterar)

**Resposta de Sucesso (200):**
```json
{
  "sucesso": true,
  "mensagem": "Usuário atualizado com sucesso",
  "usuario": { ... }
}
```

**Erros Comuns:**
- `403`: Tentativa de atualizar outro usuário sem ser admin
- `404`: Usuário não encontrado

---

### 4. Obter Pontos do Usuário

**Descrição**: Retorna saldo de pontos.

```http
GET /api/usuarios/{id}/pontos
Authorization: Bearer {token}
```

**Resposta de Sucesso (200):**
```json
{
  "sucesso": true,
  "pontos": 150,
  "nome": "João Silva"
}
```

---

## 📋 OCORRÊNCIAS (Denúncias)

### 1. Criar Ocorrência

**Descrição**: Registra nova denúncia de problema ambiental.

```http
POST /api/ocorrencias
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "bairro": "Centro",
  "tipo": "acumulo",
  "descricao": "Lixo acumulado na esquina da Rua Principal com Av. Central há 3 dias",
  "foto": "https://exemplo.com/foto.jpg",
  "localizacao": {
    "latitude": -7.5325,
    "longitude": -46.0356
  }
}
```

**Tipos válidos:**
- `queimada`: Queimada de lixo
- `acumulo`: Acúmulo de lixo
- `descarte`: Descarte irregular

**Campos obrigatórios:**
- `bairro`
- `tipo`
- `descricao`

**Campos opcionais:**
- `foto`
- `localizacao`

**Resposta de Sucesso (201):**
```json
{
  "sucesso": true,
  "mensagem": "Ocorrência registrada com sucesso",
  "ocorrencia": {
    "id": "67123xyz...",
    "usuario": "67123abc...",
    "bairro": "Centro",
    "tipo": "acumulo",
    "descricao": "Lixo acumulado...",
    "status": "pendente",
    "createdAt": "2025-10-19T10:30:00.000Z"
  }
}
```

---

### 2. Listar Todas as Ocorrências

**Descrição**: Lista todas as ocorrências. **Endpoint público** (não requer autenticação).

```http
GET /api/ocorrencias
```

**Query Parameters (filtros opcionais):**
- `?bairro=Centro` - Filtrar por bairro
- `?tipo=queimada` - Filtrar por tipo
- `?status=pendente` - Filtrar por status

**Exemplos:**
```http
GET /api/ocorrencias?bairro=Centro
GET /api/ocorrencias?tipo=queimada&status=pendente
```

**Resposta de Sucesso (200):**
```json
{
  "sucesso": true,
  "quantidade": 15,
  "ocorrencias": [
    {
      "id": "67123xyz...",
      "usuario": {
        "nome": "João Silva",
        "email": "joao@email.com"
      },
      "bairro": "Centro",
      "tipo": "acumulo",
      "descricao": "...",
      "status": "pendente",
      "createdAt": "2025-10-19T10:30:00.000Z"
    },
    ...
  ]
}
```

---

### 3. Obter Ocorrência por ID

**Descrição**: Retorna detalhes de uma ocorrência específica.

```http
GET /api/ocorrencias/{id}
```

**Resposta de Sucesso (200):**
```json
{
  "sucesso": true,
  "ocorrencia": {
    "id": "67123xyz...",
    "usuario": {
      "nome": "João Silva",
      "email": "joao@email.com",
      "telefone": "(99) 98765-4321"
    },
    "bairro": "Centro",
    "tipo": "acumulo",
    "descricao": "...",
    "foto": "...",
    "status": "pendente",
    "localizacao": { ... },
    "createdAt": "2025-10-19T10:30:00.000Z"
  }
}
```

---

### 4. Minhas Ocorrências

**Descrição**: Lista apenas ocorrências do usuário logado.

```http
GET /api/ocorrencias/user/minhas
Authorization: Bearer {token}
```

**Resposta de Sucesso (200):**
```json
{
  "sucesso": true,
  "quantidade": 3,
  "ocorrencias": [ ... ]
}
```

---

### 5. Atualizar Status (Admin)

**Descrição**: Atualiza status da ocorrência. **APENAS ADMIN**.

```http
PUT /api/ocorrencias/{id}/status
Authorization: Bearer {token_admin}
Content-Type: application/json
```

**Body:**
```json
{
  "status": "resolvido",
  "observacoes": "Problema resolvido pela equipe de limpeza em 20/10/2025"
}
```

**Status válidos:**
- `pendente`: Aguardando análise
- `em_analise`: Em processo de análise
- `resolvido`: Problema solucionado
- `rejeitado`: Ocorrência rejeitada

**Resposta de Sucesso (200):**
```json
{
  "sucesso": true,
  "mensagem": "Status atualizado com sucesso",
  "ocorrencia": { ... }
}
```

---

### 6. Deletar Ocorrência

**Descrição**: Deleta uma ocorrência. Apenas o criador ou admin.

```http
DELETE /api/ocorrencias/{id}
Authorization: Bearer {token}
```

**Resposta de Sucesso (200):**
```json
{
  "sucesso": true,
  "mensagem": "Ocorrência deletada com sucesso"
}
```

**Erros Comuns:**
- `403`: Tentativa de deletar ocorrência de outro usuário
- `404`: Ocorrência não encontrada

---

### 7. Estatísticas

**Descrição**: Retorna estatísticas agregadas de ocorrências.

```http
GET /api/ocorrencias/stats
```

**Resposta de Sucesso (200):**
```json
{
  "sucesso": true,
  "estatisticas": {
    "porTipo": [
      {
        "_id": "acumulo",
        "total": 45,
        "pendentes": 12,
        "resolvidos": 33
      },
      {
        "_id": "queimada",
        "total": 23,
        "pendentes": 8,
        "resolvidos": 15
      }
    ],
    "porBairro": [
      {
        "_id": "Centro",
        "total": 28
      },
      {
        "_id": "Vila Nova",
        "total": 15
      }
    ]
  }
}
```

---

## ♻️ ENTREGAS DE RESÍDUOS

### 1. Agendar Entrega

**Descrição**: Agenda entrega de resíduos. Pontos são calculados automaticamente.

```http
POST /api/entregas
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "tipoResiduo": "latinhas",
  "peso": 2.5,
  "postoColeta": "centro",
  "horario": "manha",
  "dataEntrega": "2025-10-25",
  "observacoes": "Informações adicionais (opcional)"
}
```

**Tipos de Resíduo e Pontuação:**
- `latinhas`: 50 pontos/kg
- `metal`: 30 pontos/kg
- `plastico`: 20 pontos/kg
- `papel`: 15 pontos/kg
- `vidro`: 10 pontos/kg
- `eletronicos`: 100 pontos/kg

**Postos de Coleta:**
- `centro`: Posto Centro - Av. Principal, 123
- `jk`: Posto JK - Rua JK, 456
- `caic`: Posto CAIC - Rua do CAIC, 789
- `camara`: Posto Câmara - Praça da Câmara, s/n

**Horários:**
- `manha`: Manhã (8h - 12h)
- `tarde`: Tarde (14h - 18h)

**Cálculo de Pontos:**
```
pontosGanhos = pontosPorKg * peso
Exemplo: latinhas (50 pts/kg) * 2.5 kg = 125 pontos
```

**Resposta de Sucesso (201):**
```json
{
  "sucesso": true,
  "mensagem": "Entrega agendada com sucesso",
  "entrega": {
    "id": "67123def...",
    "usuario": "67123abc...",
    "tipoResiduo": "latinhas",
    "peso": 2.5,
    "postoColeta": "centro",
    "horario": "manha",
    "dataEntrega": "2025-10-25T00:00:00.000Z",
    "pontosGanhos": 125,
    "status": "agendado",
    "createdAt": "2025-10-19T10:30:00.000Z"
  }
}
```

**⚠️ IMPORTANTE:** Os pontos NÃO são adicionados automaticamente ao usuário! Apenas quando um admin confirmar a entrega.

---

### 2. Minhas Entregas

**Descrição**: Lista todas as entregas do usuário logado.

```http
GET /api/entregas/minhas
Authorization: Bearer {token}
```

**Resposta de Sucesso (200):**
```json
{
  "sucesso": true,
  "quantidade": 5,
  "entregas": [
    {
      "id": "67123def...",
      "tipoResiduo": "latinhas",
      "peso": 2.5,
      "postoColeta": "centro",
      "pontosGanhos": 125,
      "status": "concluido",
      "dataEntrega": "2025-10-20T00:00:00.000Z"
    },
    ...
  ]
}
```

**Status possíveis:**
- `agendado`: Aguardando entrega
- `confirmado`: Admin confirmou recebimento
- `concluido`: Entrega concluída e pontos adicionados
- `cancelado`: Entrega cancelada

---

### 3. Listar Todas as Entregas (Admin)

**Descrição**: Lista todas as entregas. **APENAS ADMIN**.

```http
GET /api/entregas
Authorization: Bearer {token_admin}
```

**Query Parameters:**
- `?status=agendado`
- `?postoColeta=centro`
- `?tipoResiduo=latinhas`

**Resposta de Sucesso (200):**
```json
{
  "sucesso": true,
  "quantidade": 50,
  "entregas": [
    {
      "id": "67123def...",
      "usuario": {
        "nome": "João Silva",
        "email": "joao@email.com",
        "telefone": "(99) 98765-4321"
      },
      "tipoResiduo": "latinhas",
      "peso": 2.5,
      "pontosGanhos": 125,
      "status": "agendado",
      "dataEntrega": "2025-10-25T00:00:00.000Z"
    },
    ...
  ]
}
```

---

### 4. Confirmar Entrega (Admin)

**Descrição**: Confirma entrega e **adiciona pontos ao usuário**. **APENAS ADMIN**.

```http
PUT /api/entregas/{id}/confirmar
Authorization: Bearer {token_admin}
```

**Resposta de Sucesso (200):**
```json
{
  "sucesso": true,
  "mensagem": "Entrega confirmada! 125 pontos adicionados.",
  "entrega": {
    "id": "67123def...",
    "status": "concluido",
    ...
  },
  "novoSaldoPontos": 275
}
```

**⚠️ ATENÇÃO:**
- Apenas entregas com status `agendado` podem ser confirmadas
- Os pontos são adicionados ao saldo do usuário imediatamente
- O status muda para `concluido`

**Erros Comuns:**
- `400`: Entrega não pode ser confirmada (status diferente de agendado)
- `404`: Entrega não encontrada

---

### 5. Cancelar Entrega

**Descrição**: Cancela uma entrega agendada. Usuário só pode cancelar suas próprias entregas.

```http
PUT /api/entregas/{id}/cancelar
Authorization: Bearer {token}
```

**Resposta de Sucesso (200):**
```json
{
  "sucesso": true,
  "mensagem": "Entrega cancelada com sucesso",
  "entrega": {
    "id": "67123def...",
    "status": "cancelado",
    ...
  }
}
```

**Restrições:**
- Não é possível cancelar entregas concluídas
- Apenas o dono ou admin pode cancelar

**Erros Comuns:**
- `400`: Entrega já concluída
- `403`: Tentativa de cancelar entrega de outro usuário

---

### 6. Estatísticas (Admin)

**Descrição**: Retorna estatísticas de entregas. **APENAS ADMIN**.

```http
GET /api/entregas/stats
Authorization: Bearer {token_admin}
```

**Resposta de Sucesso (200):**
```json
{
  "sucesso": true,
  "estatisticas": {
    "porTipoResiduo": [
      {
        "_id": "latinhas",
        "totalEntregas": 45,
        "pesoTotal": 112.5,
        "pontosTotal": 5625
      },
      {
        "_id": "plastico",
        "totalEntregas": 30,
        "pesoTotal": 85.2,
        "pontosTotal": 1704
      }
    ],
    "porPosto": [
      {
        "_id": "centro",
        "total": 38,
        "pesoTotal": 95.5
      },
      {
        "_id": "jk",
        "total": 25,
        "pesoTotal": 62.3
      }
    ]
  }
}
```

---

## 🎁 RESGATES DE PONTOS

### 1. Ver Opções de Resgate

**Descrição**: Lista todas as opções de resgate disponíveis. **Endpoint público**.

```http
GET /api/resgates/opcoes
```

**Resposta de Sucesso (200):**
```json
{
  "sucesso": true,
  "opcoes": {
    "combustivel": [
      { "pontos": 500, "valor": 10 },
      { "pontos": 1000, "valor": 25 },
      { "pontos": 2000, "valor": 55 }
    ],
    "energia": [
      { "pontos": 600, "valor": 15 },
      { "pontos": 1200, "valor": 35 },
      { "pontos": 2500, "valor": 75 }
    ],
    "supermercado": [
      { "pontos": 400, "valor": 10 },
      { "pontos": 800, "valor": 22 },
      { "pontos": 1500, "valor": 45 }
    ]
  }
}
```

---

### 2. Criar Resgate

**Descrição**: Cria novo resgate de pontos. Deduz pontos do saldo do usuário.

```http
POST /api/resgates
Authorization: Bearer {token}
Content-Type: application/json
```

**Body - Exemplo 1 (Combustível):**
```json
{
  "parceiro": "combustivel",
  "pontosUtilizados": 500
}
```

**Body - Exemplo 2 (Energia):**
```json
{
  "parceiro": "energia",
  "pontosUtilizados": 1200
}
```

**Body - Exemplo 3 (Supermercado):**
```json
{
  "parceiro": "supermercado",
  "pontosUtilizados": 400
}
```

**Validações:**
- Usuário deve ter pontos suficientes
- Combinação parceiro/pontos deve ser válida (conforme tabela)

**Resposta de Sucesso (201):**
```json
{
  "sucesso": true,
  "mensagem": "Resgate realizado com sucesso",
  "resgate": {
    "id": "67123ghi...",
    "usuario": "67123abc...",
    "parceiro": "combustivel",
    "pontosUtilizados": 500,
    "valorResgate": 10,
    "codigoResgate": "BS-lk3j5d-XY7ZQ",
    "status": "pendente",
    "dataExpiracao": "2025-11-18T10:30:00.000Z",
    "createdAt": "2025-10-19T10:30:00.000Z"
  },
  "novoSaldoPontos": 650
}
```

**⚠️ IMPORTANTE:**
- Os pontos são deduzidos imediatamente do saldo
- Código único é gerado automaticamente
- Resgate expira em 30 dias
- Guarde o `codigoResgate` para apresentar no estabelecimento

**Erros Comuns:**
- `400`: Pontos insuficientes
- `400`: Opção de resgate inválida para o parceiro

---

### 3. Meus Resgates

**Descrição**: Lista todos os resgates do usuário logado.

```http
GET /api/resgates/meus
Authorization: Bearer {token}
```

**Resposta de Sucesso (200):**
```json
{
  "sucesso": true,
  "quantidade": 3,
  "resgates": [
    {
      "id": "67123ghi...",
      "parceiro": "combustivel",
      "pontosUtilizados": 500,
      "valorResgate": 10,
      "codigoResgate": "BS-lk3j5d-XY7ZQ",
      "status": "pendente",
      "dataExpiracao": "2025-11-18T10:30:00.000Z",
      "createdAt": "2025-10-19T10:30:00.000Z"
    },
    {
      "id": "67123jkl...",
      "parceiro": "supermercado",
      "pontosUtilizados": 400,
      "valorResgate": 10,
      "codigoResgate": "BS-mn8p2q-ABC12",
      "status": "utilizado",
      "dataUtilizacao": "2025-10-15T14:20:00.000Z"
    }
  ]
}
```

---

### 4. Obter Resgate por ID

**Descrição**: Retorna detalhes de um resgate específico.

```http
GET /api/resgates/{id}
Authorization: Bearer {token}
```

**Resposta de Sucesso (200):**
```json
{
  "sucesso": true,
  "resgate": {
    "id": "67123ghi...",
    "usuario": {
      "nome": "João Silva",
      "email": "joao@email.com",
      "telefone": "(99) 98765-4321"
    },
    "parceiro": "combustivel",
    "pontosUtilizados": 500,
    "valorResgate": 10,
    "codigoResgate": "BS-lk3j5d-XY7ZQ",
    "status": "pendente",
    "dataExpiracao": "2025-11-18T10:30:00.000Z"
  }
}
```

---

### 5. Utilizar Resgate (Admin)

**Descrição**: Marca resgate como utilizado. **APENAS ADMIN** (estabelecimentos parceiros).

```http
PUT /api/resgates/{id}/utilizar
Authorization: Bearer {token_admin}
```

**Resposta de Sucesso (200):**
```json
{
  "sucesso": true,
  "mensagem": "Resgate utilizado com sucesso",
  "resgate": {
    "id": "67123ghi...",
    "status": "utilizado",
    "dataUtilizacao": "2025-10-19T15:45:00.000Z",
    ...
  }
}
```

**Validações:**
- Resgate deve estar com status `pendente`
- Resgate não pode estar expirado

**Erros Comuns:**
- `400`: Resgate já foi utilizado/cancelado/expirado
- `400`: Resgate expirado (automaticamente muda status para `expirado`)

---

### 6. Cancelar Resgate

**Descrição**: Cancela resgate e **devolve pontos** ao usuário.

```http
PUT /api/resgates/{id}/cancelar
Authorization: Bearer {token}
```

**Resposta de Sucesso (200):**
```json
{
  "sucesso": true,
  "mensagem": "Resgate cancelado e pontos devolvidos",
  "resgate": {
    "id": "67123ghi...",
    "status": "cancelado",
    ...
  },
  "novoSaldoPontos": 1150
}
```

**Restrições:**
- Apenas resgates com status `pendente` podem ser cancelados
- Apenas o dono do resgate pode cancelar
- Pontos são devolvidos automaticamente

**Erros Comuns:**
- `400`: Resgate já utilizado/cancelado
- `403`: Tentativa de cancelar resgate de outro usuário

---

### 7. Listar Todos os Resgates (Admin)

**Descrição**: Lista todos os resgates. **APENAS ADMIN**.

```http
GET /api/resgates
Authorization: Bearer {token_admin}
```

**Query Parameters:**
- `?status=pendente`
- `?parceiro=combustivel`

**Resposta de Sucesso (200):**
```json
{
  "sucesso": true,
  "quantidade": 75,
  "resgates": [
    {
      "id": "67123ghi...",
      "usuario": {
        "nome": "João Silva",
        "email": "joao@email.com",
        "telefone": "(99) 98765-4321"
      },
      "parceiro": "combustivel",
      "pontosUtilizados": 500,
      "valorResgate": 10,
      "codigoResgate": "BS-lk3j5d-XY7ZQ",
      "status": "pendente"
    },
    ...
  ]
}
```

---

### 8. Estatísticas (Admin)

**Descrição**: Retorna estatísticas de resgates. **APENAS ADMIN**.

```http
GET /api/resgates/stats
Authorization: Bearer {token_admin}
```

**Resposta de Sucesso (200):**
```json
{
  "sucesso": true,
  "estatisticas": {
    "porParceiro": [
      {
        "_id": "combustivel",
        "totalResgates": 45,
        "pontosTotal": 35000,
        "valorTotal": 850
      },
      {
        "_id": "supermercado",
        "totalResgates": 38,
        "pontosTotal": 18200,
        "valorTotal": 456
      }
    ],
    "porStatus": [
      {
        "_id": "utilizado",
        "total": 65
      },
      {
        "_id": "pendente",
        "total": 12
      },
      {
        "_id": "expirado",
        "total": 8
      }
    ]
  }
}
```

---

## 🔢 Códigos de Status HTTP

### Sucesso
- `200 OK`: Requisição bem-sucedida
- `201 Created`: Recurso criado com sucesso

### Erros do Cliente
- `400 Bad Request`: Dados inválidos ou faltando
- `401 Unauthorized`: Não autenticado (token inválido/ausente)
- `403 Forbidden`: Não autorizado (sem permissão)
- `404 Not Found`: Recurso não encontrado

### Erros do Servidor
- `500 Internal Server Error`: Erro no servidor

---

## 🔄 Exemplos de Fluxo Completo

### Fluxo 1: Novo Usuário - Entrega - Resgate

#### 1. Registrar
```http
POST /api/auth/registro
{
  "nome": "Maria Santos",
  "email": "maria@email.com",
  "senha": "senha123"
}
```

#### 2. Agendar Entrega
```http
POST /api/entregas
Authorization: Bearer {token}
{
  "tipoResiduo": "latinhas",
  "peso": 10,
  "postoColeta": "centro",
  "horario": "manha",
  "dataEntrega": "2025-10-25"
}
// Pontos calculados: 10kg * 50 pts/kg = 500 pontos
```

#### 3. [ADMIN] Confirmar Entrega
```http
PUT /api/entregas/{id}/confirmar
Authorization: Bearer {token_admin}
// Adiciona 500 pontos ao usuário
```

#### 4. Verificar Pontos
```http
GET /api/auth/me
Authorization: Bearer {token}
// Resposta: "pontos": 500
```

#### 5. Resgatar Benefício
```http
POST /api/resgates
Authorization: Bearer {token}
{
  "parceiro": "supermercado",
  "pontosUtilizados": 400
}
// Desconta 400 pontos, gera código de resgate
```

#### 6. Ver Meu Resgate
```http
GET /api/resgates/meus
Authorization: Bearer {token}
// Mostra código: "BS-lk3j5d-XY7ZQ"
```

#### 7. [No Supermercado] Utilizar Resgate
```http
PUT /api/resgates/{id}/utilizar
Authorization: Bearer {token_admin_supermercado}
// Marca resgate como utilizado
```

---

### Fluxo 2: Reportar Ocorrência

#### 1. Login
```http
POST /api/auth/login
{
  "email": "maria@email.com",
  "senha": "senha123"
}
```

#### 2. Criar Ocorrência
```http
POST /api/ocorrencias
Authorization: Bearer {token}
{
  "bairro": "Vila Nova",
  "tipo": "queimada",
  "descricao": "Queimada de lixo próximo à escola municipal"
}
```

#### 3. Acompanhar Status
```http
GET /api/ocorrencias/user/minhas
Authorization: Bearer {token}
```

#### 4. [ADMIN] Atualizar Status
```http
PUT /api/ocorrencias/{id}/status
Authorization: Bearer {token_admin}
{
  "status": "resolvido",
  "observacoes": "Equipe realizou limpeza no local"
}
```

---

## 📝 Notas Importantes

### Autenticação
- Token expira em 7 dias (configurável)
- Sempre use `Bearer {token}` no header Authorization
- Faça novo login se o token expirar

### Permissões
- **Usuário comum**: Pode gerenciar apenas seus próprios recursos
- **Admin**: Acesso total, pode confirmar entregas, atualizar ocorrências, etc.

### Pontos
- Pontos só são creditados quando admin confirma a entrega
- Pontos são debitados imediatamente ao criar resgate
- Cancelar resgate devolve os pontos

### Resgates
- Códigos são únicos e gerados automaticamente
- Expiram em 30 dias
- Status: `pendente` → `utilizado` (ou `cancelado`/`expirado`)

---

**📞 Suporte**: Em caso de dúvidas, consulte o [README.md](README.md) completo ou entre em contato com a equipe de desenvolvimento.
