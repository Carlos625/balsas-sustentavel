# 📸 Guia Visual - Como Usar a API no Postman

## 🚀 Passo 1: Importar a Collection

1. Abra o **Postman**
2. Clique em **Import** (canto superior esquerdo)
3. Selecione **Upload Files**
4. Escolha o arquivo `Balsas_Sustentavel_API.postman_collection.json`
5. Clique em **Import**

✅ A collection **"Balsas Sustentável - API"** aparecerá na barra lateral!

---

## ⚙️ Passo 2: Configurar Variáveis

### Variável `baseUrl`
1. Clique com botão direito na collection
2. Selecione **Edit**
3. Vá na aba **Variables**
4. Confirme que `baseUrl` está com valor: `http://localhost:3000/api`

### Variável `token`
- Esta variável é preenchida **automaticamente** ao fazer login!
- Você também pode preenchê-la manualmente se necessário

---

## 🔐 Passo 3: Testar Autenticação

### 3.1 - Registrar Novo Usuário

📁 **Pasta**: Autenticação → **Registrar Usuário**

1. Selecione a requisição
2. Verifique o **Body** (deve estar em formato JSON):
```json
{
  "nome": "Seu Nome",
  "email": "seu@email.com",
  "senha": "senha123",
  "telefone": "(99) 98765-4321"
}
```
3. Clique em **Send**
4. Observe a resposta com o **token**

**Resposta esperada:**
```json
{
  "sucesso": true,
  "mensagem": "Usuário registrado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "usuario": {
    "id": "...",
    "nome": "Seu Nome",
    "email": "seu@email.com",
    "pontos": 0
  }
}
```

---

### 3.2 - Fazer Login

📁 **Pasta**: Autenticação → **Login**

1. Selecione a requisição
2. No **Body**, coloque suas credenciais:
```json
{
  "email": "seu@email.com",
  "senha": "senha123"
}
```
3. Clique em **Send**
4. **O token será salvo automaticamente na variável {{token}}!**

**Dica**: Verifique a aba **Tests** - há um script que salva o token automaticamente!

```javascript
var jsonData = pm.response.json();
if (jsonData.token) {
    pm.collectionVariables.set('token', jsonData.token);
}
```

---

### 3.3 - Verificar Usuário Logado

📁 **Pasta**: Autenticação → **Obter Usuário Logado**

1. Selecione a requisição
2. Veja a aba **Authorization** - já está configurada com `Bearer {{token}}`
3. Clique em **Send**
4. Você verá seus dados completos!

---

## 📋 Passo 4: Criar Uma Ocorrência

📁 **Pasta**: Ocorrências → **Criar Ocorrência**

1. Selecione a requisição
2. No **Body**:
```json
{
  "bairro": "Centro",
  "tipo": "acumulo",
  "descricao": "Lixo acumulado na Rua Principal"
}
```
3. Clique em **Send**

**Tipos válidos**: `queimada`, `acumulo`, `descarte`

---

## ♻️ Passo 5: Agendar Uma Entrega

📁 **Pasta**: Entregas → **Agendar Entrega**

1. Selecione a requisição
2. No **Body**:
```json
{
  "tipoResiduo": "latinhas",
  "peso": 2.5,
  "postoColeta": "centro",
  "horario": "manha",
  "dataEntrega": "2025-10-25"
}
```
3. Clique em **Send**
4. **Observe os `pontosGanhos` calculados automaticamente!**

**Pontuação:**
- latinhas: 50 pts/kg → 2.5kg × 50 = **125 pontos**

---

## 🎁 Passo 6: Resgatar Pontos

### 6.1 - Ver Opções Disponíveis

📁 **Pasta**: Resgates → **Ver Opções de Resgate**

1. Clique em **Send** (não precisa autenticação)
2. Veja todas as opções:

```json
{
  "combustivel": [
    { "pontos": 500, "valor": 10 },
    { "pontos": 1000, "valor": 25 }
  ],
  "energia": [
    { "pontos": 600, "valor": 15 }
  ],
  "supermercado": [
    { "pontos": 400, "valor": 10 }
  ]
}
```

---

### 6.2 - Criar Resgate

📁 **Pasta**: Resgates → **Criar Resgate - Supermercado**

1. No **Body**:
```json
{
  "parceiro": "supermercado",
  "pontosUtilizados": 400
}
```
2. Clique em **Send**
3. **Copie o `codigoResgate`** retornado!

**Resposta:**
```json
{
  "sucesso": true,
  "mensagem": "Resgate realizado com sucesso",
  "resgate": {
    "codigoResgate": "BS-lk3j5d-XY7ZQ",
    "valorResgate": 10,
    "dataExpiracao": "2025-11-18..."
  },
  "novoSaldoPontos": 225
}
```

---

## 📊 Passo 7: Ver Estatísticas

### Estatísticas de Ocorrências

📁 **Pasta**: Ocorrências → **Estatísticas**

1. Clique em **Send** (não precisa autenticação)
2. Veja dados agregados por tipo e bairro

---

## 🔧 Dicas Importantes

### ✅ Verificar Autenticação

Todas as requisições protegidas já vem configuradas com:
- **Authorization**: Bearer Token
- **Type**: Bearer Token
- **Token**: `{{token}}`

### ✅ Usar Variáveis

Ao invés de copiar IDs manualmente:

1. Na resposta, clique com botão direito em um ID
2. Selecione **Set: Collection Variable**
3. Crie uma variável (ex: `entrega_id`)
4. Use `{{entrega_id}}` nas próximas requisições

**Exemplo:**
```
GET {{baseUrl}}/entregas/{{entrega_id}}
```

### ✅ Ambiente de Produção

Para testar em produção:

1. Clique em **Environments** (canto superior direito)
2. Crie um novo ambiente "Produção"
3. Adicione variável `baseUrl` com: `https://sua-api-producao.com/api`
4. Selecione o ambiente desejado

---

## 🎯 Fluxo de Teste Completo

### Cenário: Novo Usuário Completo

```
1. Registrar Usuário
   ↓
2. Login (token salvo automaticamente)
   ↓
3. Criar Ocorrência
   ↓
4. Agendar Entrega
   ↓
5. [Admin] Confirmar Entrega
   ↓
6. Verificar Pontos (GET /auth/me)
   ↓
7. Ver Opções de Resgate
   ↓
8. Criar Resgate
   ↓
9. Ver Meus Resgates
```

---

## 🐛 Resolução de Problemas

### Erro 401 - Unauthorized

**Problema**: Token inválido ou expirado

**Solução**:
1. Faça login novamente
2. Verifique se o token foi salvo (variável `{{token}}`)
3. Verifique se a requisição está usando autenticação

---

### Erro 403 - Forbidden

**Problema**: Sem permissão (rota admin)

**Solução**:
1. Verifique se você é admin
2. Algumas rotas são apenas para administradores
3. Use uma conta admin para testar rotas protegidas

---

### Erro 400 - Bad Request

**Problema**: Dados inválidos

**Solução**:
1. Verifique o formato JSON no Body
2. Confirme campos obrigatórios
3. Verifique valores válidos (enums)
4. Leia a mensagem de erro detalhada

---

### Erro 404 - Not Found

**Problema**: ID não encontrado

**Solução**:
1. Verifique se o ID existe
2. Use IDs válidos de recursos criados anteriormente
3. Copie IDs diretamente das respostas

---

## 📚 Recursos Adicionais

### Salvar Exemplos de Resposta

1. Após receber uma resposta bem-sucedida
2. Clique em **Save Response**
3. Nomeie o exemplo (ex: "Sucesso - 201")
4. Agora você tem documentação visual!

### Organizar Testes

Crie uma nova pasta chamada "Testes" e duplique requisições para testar:
- Dados válidos
- Dados inválidos
- Casos de erro
- Limites (pontos insuficientes, etc)

### Scripts Úteis

Na aba **Tests**, adicione validações automáticas:

```javascript
// Verificar status 200
pm.test("Status é 200", function () {
    pm.response.to.have.status(200);
});

// Verificar se retornou sucesso
pm.test("Sucesso é true", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.sucesso).to.eql(true);
});

// Salvar ID para próxima requisição
var jsonData = pm.response.json();
if (jsonData.entrega && jsonData.entrega.id) {
    pm.collectionVariables.set('entrega_id', jsonData.entrega.id);
}
```

---

## 🎓 Próximos Passos

1. ✅ Importe a collection
2. ✅ Teste todos os endpoints de Autenticação
3. ✅ Crie pelo menos 3 ocorrências
4. ✅ Agende 2 entregas diferentes
5. ✅ Faça um resgate
6. ✅ Explore as estatísticas
7. 🚀 Integre o front-end com a API!

---

**💡 Dica Final**: Mantenha o Postman aberto enquanto desenvolve o front-end para testar rapidamente os endpoints!
