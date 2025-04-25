## Financial Wallet

## Descrição

Este projeto é uma **API de carteira digital** desenvolvida com  **NestJS** , **TypeORM** e  **PostgreSQL** , que permite o gerenciamento de usuários e transações financeiras entre eles.

### ✨ Funcionalidades

* **Cadastro de usuários** com validação de CPF e saldo inicial.
* **Envio de transações** entre usuários, com validação de saldo e regras de negócio.
* **Reversão de transações** para correções ou cancelamentos.
* **Atualização de saldo** do usuário automaticamente após transações.
* **Camada de autenticação e autorização** para proteger endpoints.
* **Migrations e Seeds** para controle de versão e popular o banco de dados.
* **Testes unitários** com Jest para garantir a confiabilidade do sistema.

### 🛠 Tecnologias Utilizadas

* **NestJS** – framework Node.js para construir aplicações escaláveis.
* **TypeORM** – ORM para integração com banco de dados PostgreSQL.
* **PostgreSQL** – banco de dados relacional robusto.
* **Jest** – framework de testes para JavaScript/TypeScript.

## Como rodar o projeto

```bash
# instale as dependências
$ npm install

# compile e rode o projeto com docker 
$ docker compose up --build

# rode o projeto com docker - caso já esteja compilado
$ docker compose up
```

## Migrations

As migrations estão localizados em `src/core/infra/database/typeorm/migrations`.

**Executar**

> npm run migration:run

**Realizar rollback**

> npm run migration:revert

**Criar nova migration**

> npm run migration:create --name=NAME

**Realizar dump do banco**

> npm run migration:generate --name=NAME

## Execução de testes

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```


## 📡 Rotas da API

A API está versionada e utilizando o prefixo `/v1` e organizada em três módulos principais:  **auth** , **users** e  **transactions** .

### 🔐 Auth

| Método | Rota               | Descrição                        |
| ------- | ------------------ | ---------------------------------- |
| POST    | `/v1/auth/login` | Autenticação de usuário (login) |

---

### 👤 Users

| Método | Rota              | Descrição                            |
| ------- | ----------------- | -------------------------------------- |
| GET     | `/v1/users`     | Lista todos os usuários               |
| GET     | `/v1/users/:id` | Busca um usuário pelo ID              |
| POST    | `/v1/users`     | Cria um novo usuário                  |
| PATCH   | `/v1/users/:id` | Atualiza o saldo (balance) do usuário |
| DELETE  | `/v1/users/:id` | Deleta um usuário pelo ID             |

---

### 💸 Transactions

🔒 *Todas as rotas abaixo requerem autenticação via JWT.*

| Método | Rota                                       | Descrição                               |
| ------- | ------------------------------------------ | ----------------------------------------- |
| POST    | `/v1/transactions`                       | Cria uma nova transação entre usuários |
| GET     | `/v1/transactions/:transactionId`        | Busca uma transação específica         |
| GET     | `/v1/transactions`                       | Lista todas as transações               |
| GET     | `/v1/transactions/user/:userId`          | Lista as transações de um usuário      |
| PUT     | `/v1/transactions/revert/:transactionId` | Reverte uma transação                   |
