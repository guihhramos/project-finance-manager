# 💰 Finance Manager Enterprise (MVP)

Plataforma de gestão financeira corporativa desenvolvida para permitir que colaboradores registrem, acompanhem e analisem movimentações financeiras de forma segura, eficiente e auditável.

---

## 🚀 Visão Geral

O Finance Manager Enterprise foi desenvolvido como um MVP Full Stack utilizando NestJS, React e PostgreSQL.

O objetivo é oferecer uma solução simples, segura e escalável para gerenciamento financeiro, seguindo boas práticas de arquitetura, tipagem estática e organização modular.

---

# 🏗 Arquitetura da Solução

```text
Frontend (React + TypeScript)
        │
        ▼
Axios + JWT
        │
        ▼
Backend (NestJS + TypeScript)
        │
 ┌──────┼──────┐
 ▼      ▼      ▼
Auth  Categories Transactions
        │
        ▼
 Prisma ORM
        │
        ▼
 PostgreSQL
```

---

# 🔐 Fluxo de Autenticação

```text
Usuário
   │
   ▼
Registro/Login
   │
   ▼
AuthController
   │
   ▼
AuthService
   │
   ▼
bcrypt
(Hash da senha)
   │
   ▼
JWT Service
   │
   ▼
Token JWT
   │
   ▼
Frontend armazena token
   │
   ▼
Axios envia Authorization: Bearer <token>
   │
   ▼
JWT AuthGuard
   │
   ├── Token inválido → 401 Unauthorized
   │
   └── Token válido → Acesso liberado
```

---

# 📊 Regras de Negócio

## Isolamento de Dados por Usuário

Uma das regras mais importantes do sistema é garantir que cada usuário visualize apenas seus próprios dados.

### Categorias

```text
Usuário A
   │
   ▼
Categoria A
Categoria B

Usuário B
   │
   ▼
Categoria C
Categoria D
```

Validação:

```text
Categoria pertence ao usuário?
        │
 ┌──────┴──────┐
 │             │
Sim           Não
 │             │
 ▼             ▼
Permite    403 Forbidden
```

---

### Transações

```text
Transação pertence ao usuário?
        │
 ┌──────┴──────┐
 │             │
Sim           Não
 │             │
 ▼             ▼
Permite    403 Forbidden
```

Nenhum usuário consegue visualizar, editar ou excluir registros de outro usuário.

---

# 📋 Funcionalidades

## 🔐 Autenticação

* Cadastro de usuário
* Login com JWT
* Rotas protegidas via AuthGuard
* Hash de senha com bcrypt
* Controle de acesso baseado em usuário autenticado

---

## 📁 Categorias

CRUD completo:

* Criar categoria
* Listar categorias
* Editar categoria
* Excluir categoria

Exemplos:

* Alimentação
* Transporte
* Fornecedor
* Receita de Cliente

---

## 💰 Transações Financeiras

Cada transação possui:

* Descrição
* Valor
* Categoria
* Data
* Tipo (Entrada ou Saída)

Operações:

* Criar
* Editar
* Excluir
* Listar com paginação

Filtros:

* Tipo
* Categoria
* Data Inicial
* Data Final

---

## 📊 Dashboard

Todos os cálculos são realizados no Backend.

Indicadores:

### Saldo Atual

```text
Saldo = Entradas - Saídas
```

### Total de Entradas

Somatório de todas as entradas.

### Total de Saídas

Somatório de todas as saídas.

### Top 3 Categorias

Categorias com maior volume financeiro de saída.

---

# 🛠 Decisões Técnicas

## Backend

### NestJS

Escolhido por:

* Arquitetura modular
* Injeção de dependência nativa
* Excelente integração com TypeScript
* Escalabilidade

### Prisma ORM

Escolhido por:

* Tipagem automática
* Produtividade
* Facilidade para migrations
* Excelente integração com PostgreSQL

---

## Frontend

### React + TypeScript

Implementado utilizando:

* Functional Components
* Hooks
* React Router
* Axios

Sem utilização de Class Components.

---

## Gerenciamento de Estado

Utilizado:

* useState
* useEffect

A decisão foi tomada para manter o MVP enxuto e evitar over-engineering.

---

# 📦 Estrutura do Projeto

```text
finance-manager/
│
├── backend/
│   ├── src/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── categories/
│   │   ├── transactions/
│   │   └── dashboard/
│   │
│   ├── prisma/
│   └── tests/
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── routes/
│
└── README.md
```

---

# 🧪 Testes Automatizados

Testes implementados:

* Login
* JWT
* Categorias
* Transações
* Dashboard

Objetivo:

Garantir segurança das regras de negócio e estabilidade das funcionalidades críticas.

---

# 🚀 Como Executar o Projeto

## Backend

```bash
cd backend

npm install

npx prisma migrate dev

npm run start:dev
```

Servidor:

```text
http://localhost:3000
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

Aplicação:

```text
http://localhost:5173
```

---

# 🗄 Banco de Dados

PostgreSQL

Principais entidades:

* Users
* Categories
* Transactions

Relacionamentos:

```text
User
 │
 ├── Categories
 │
 └── Transactions
```

---

# 🔒 Segurança

Implementações realizadas:

* JWT Authentication
* AuthGuard
* DTO Validation
* Global Exception Filter
* Hash de senha com bcrypt
* Isolamento de dados por usuário
* Validação de ownership de categorias
* Validação de ownership de transações

---

# ⚠️ Considerações de Arquitetura

O projeto segue exatamente as diretrizes propostas pelo desafio.

Não foram adicionadas tecnologias desnecessárias como:

* Microserviços
* DDD
* CQRS
* Event Sourcing
* Redux
* Filas de Mensageria

O foco foi manter a solução simples, robusta e alinhada às necessidades do MVP.

---

## 👨‍💻 Autor

Guilherme Silva Ramos

Desafio Técnico Full Stack — NestJS + React + PostgreSQL