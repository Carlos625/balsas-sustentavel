# 📝 Resumo Rápido - Todos os Endpoints

## 🔐 Autenticação

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/api/auth/registro` | Registrar novo usuário | ❌ |
| POST | `/api/auth/login` | Login (retorna token JWT) | ❌ |
| GET | `/api/auth/me` | Dados do usuário logado | ✅ |

---

## 👥 Usuários

| Método | Endpoint | Descrição | Auth | Admin |
|--------|----------|-----------|------|-------|
| GET | `/api/usuarios` | Listar todos os usuários | ✅ | ⭐ |
| GET | `/api/usuarios/:id` | Obter usuário por ID | ✅ | ❌ |
| PUT | `/api/usuarios/:id` | Atualizar usuário | ✅ | ❌ |
| DELETE | `/api/usuarios/:id` | Desativar usuário | ✅ | ⭐ |
| GET | `/api/usuarios/:id/pontos` | Obter pontos do usuário | ✅ | ❌ |

---

## 📋 Ocorrências

| Método | Endpoint | Descrição | Auth | Admin |
|--------|----------|-----------|------|-------|
| POST | `/api/ocorrencias` | Criar ocorrência | ✅ | ❌ |
| GET | `/api/ocorrencias` | Listar todas (com filtros) | ❌ | ❌ |
| GET | `/api/ocorrencias/:id` | Obter ocorrência por ID | ❌ | ❌ |
| GET | `/api/ocorrencias/user/minhas` | Minhas ocorrências | ✅ | ❌ |
| PUT | `/api/ocorrencias/:id/status` | Atualizar status | ✅ | ⭐ |
| DELETE | `/api/ocorrencias/:id` | Deletar ocorrência | ✅ | ❌ |
| GET | `/api/ocorrencias/stats` | Estatísticas | ❌ | ❌ |

**Filtros disponíveis**: `?bairro=Centro&tipo=queimada&status=pendente`

---

## ♻️ Entregas

| Método | Endpoint | Descrição | Auth | Admin |
|--------|----------|-----------|------|-------|
| POST | `/api/entregas` | Agendar entrega | ✅ | ❌ |
| GET | `/api/entregas` | Listar todas (com filtros) | ✅ | ⭐ |
| GET | `/api/entregas/:id` | Obter entrega por ID | ✅ | ❌ |
| GET | `/api/entregas/minhas` | Minhas entregas | ✅ | ❌ |
| PUT | `/api/entregas/:id/confirmar` | Confirmar e adicionar pontos | ✅ | ⭐ |
| PUT | `/api/entregas/:id/cancelar` | Cancelar entrega | ✅ | ❌ |
| GET | `/api/entregas/stats` | Estatísticas | ✅ | ⭐ |

**Filtros disponíveis**: `?status=agendado&postoColeta=centro&tipoResiduo=latinhas`

---

## 🎁 Resgates

| Método | Endpoint | Descrição | Auth | Admin |
|--------|----------|-----------|------|-------|
| GET | `/api/resgates/opcoes` | Ver opções de resgate | ❌ | ❌ |
| POST | `/api/resgates` | Criar resgate | ✅ | ❌ |
| GET | `/api/resgates` | Listar todos (com filtros) | ✅ | ⭐ |
| GET | `/api/resgates/:id` | Obter resgate por ID | ✅ | ❌ |
| GET | `/api/resgates/meus` | Meus resgates | ✅ | ❌ |
| PUT | `/api/resgates/:id/utilizar` | Marcar como utilizado | ✅ | ⭐ |
| PUT | `/api/resgates/:id/cancelar` | Cancelar e devolver pontos | ✅ | ❌ |
| GET | `/api/resgates/stats` | Estatísticas | ✅ | ⭐ |

**Filtros disponíveis**: `?status=pendente&parceiro=combustivel`

---

## 📊 Tabelas de Referência

### Tipos de Resíduo e Pontuação

| Tipo | Valor | Pontos/kg |
|------|-------|-----------|
| `latinhas` | Latinhas de Alumínio | **50** |
| `metal` | Metal | **30** |
| `plastico` | Plástico | **20** |
| `papel` | Papel/Papelão | **15** |
| `vidro` | Vidro | **10** |
| `eletronicos` | Eletrônicos | **100** |

### Postos de Coleta

| Código | Nome | Endereço |
|--------|------|----------|
| `centro` | Posto Centro | Av. Principal, 123 |
| `jk` | Posto JK | Rua JK, 456 |
| `caic` | Posto CAIC | Rua do CAIC, 789 |
| `camara` | Posto Câmara | Praça da Câmara, s/n |

### Horários de Entrega

| Código | Período |
|--------|---------|
| `manha` | Manhã (8h - 12h) |
| `tarde` | Tarde (14h - 18h) |

### Tipos de Ocorrência

| Código | Descrição |
|--------|-----------|
| `queimada` | Queimada de lixo |
| `acumulo` | Acúmulo de lixo |
| `descarte` | Descarte irregular |

### Status de Ocorrência

| Status | Descrição |
|--------|-----------|
| `pendente` | Aguardando análise |
| `em_analise` | Em análise |
| `resolvido` | Problema solucionado |
| `rejeitado` | Ocorrência rejeitada |

### Status de Entrega

| Status | Descrição |
|--------|-----------|
| `agendado` | Aguardando entrega |
| `confirmado` | Admin confirmou recebimento |
| `concluido` | Concluída + pontos adicionados |
| `cancelado` | Cancelada |

### Parceiros de Resgate

| Parceiro | Opções (Pontos → Valor R$) |
|----------|----------------------------|
| `combustivel` | 500→10, 1000→25, 2000→55 |
| `energia` | 600→15, 1200→35, 2500→75 |
| `supermercado` | 400→10, 800→22, 1500→45 |

### Status de Resgate

| Status | Descrição |
|--------|-----------|
| `pendente` | Aguardando utilização |
| `utilizado` | Já foi utilizado |
| `expirado` | Expirou (30 dias) |
| `cancelado` | Cancelado (pontos devolvidos) |

---

## 🔑 Formato de Autenticação

### Header obrigatório para rotas protegidas:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### No Postman:
- **Type**: Bearer Token
- **Token**: `{{token}}`

---

## 📦 Exemplos de Request Body

### Registro
```json
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "senha": "senha123",
  "telefone": "(99) 98765-4321"
}
```

### Login
```json
{
  "email": "joao@email.com",
  "senha": "senha123"
}
```

### Criar Ocorrência
```json
{
  "bairro": "Centro",
  "tipo": "acumulo",
  "descricao": "Lixo acumulado na Rua Principal",
  "foto": "https://exemplo.com/foto.jpg"
}
```

### Agendar Entrega
```json
{
  "tipoResiduo": "latinhas",
  "peso": 2.5,
  "postoColeta": "centro",
  "horario": "manha",
  "dataEntrega": "2025-10-25"
}
```

### Criar Resgate
```json
{
  "parceiro": "supermercado",
  "pontosUtilizados": 400
}
```

### Atualizar Status Ocorrência (Admin)
```json
{
  "status": "resolvido",
  "observacoes": "Problema resolvido em 20/10/2025"
}
```

---

## 🎯 Códigos de Resposta HTTP

| Código | Significado | Quando Ocorre |
|--------|-------------|---------------|
| 200 | OK | Sucesso em GET, PUT, DELETE |
| 201 | Created | Recurso criado com sucesso (POST) |
| 400 | Bad Request | Dados inválidos ou faltando |
| 401 | Unauthorized | Token ausente/inválido |
| 403 | Forbidden | Sem permissão (não é admin) |
| 404 | Not Found | Recurso não encontrado |
| 500 | Server Error | Erro interno do servidor |

---

## 📝 Legenda

- ✅ = Requer autenticação (token JWT)
- ❌ = Não requer autenticação
- ⭐ = Apenas administradores

---

## 🔄 Fluxos Comuns

### Fluxo 1: Usuário Normal
```
1. POST /api/auth/registro
2. POST /api/auth/login
3. POST /api/entregas (agendar)
4. GET /api/entregas/minhas
5. GET /api/auth/me (ver pontos após admin confirmar)
6. POST /api/resgates
7. GET /api/resgates/meus
```

### Fluxo 2: Admin - Confirmar Entregas
```
1. POST /api/auth/login (admin)
2. GET /api/entregas?status=agendado
3. PUT /api/entregas/:id/confirmar
```

### Fluxo 3: Admin - Gerenciar Ocorrências
```
1. GET /api/ocorrencias?status=pendente
2. GET /api/ocorrencias/:id
3. PUT /api/ocorrencias/:id/status
```

### Fluxo 4: Estabelecimento - Validar Resgate
```
1. POST /api/auth/login (admin do estabelecimento)
2. GET /api/resgates/:id (verificar código)
3. PUT /api/resgates/:id/utilizar
```

---

## 🌐 URLs Base

- **Desenvolvimento**: `http://localhost:3000/api`
- **Produção**: `https://sua-api.com/api`

---

## 📚 Documentação Completa

Para detalhes completos de cada endpoint, consulte:
- **[DOCUMENTACAO_ENDPOINTS.md](DOCUMENTACAO_ENDPOINTS.md)** - Documentação detalhada
- **[GUIA_VISUAL_POSTMAN.md](GUIA_VISUAL_POSTMAN.md)** - Guia visual passo a passo
- **[README.md](README.md)** - Documentação geral da API

---

**Última atualização**: Outubro 2025
