API Testing com Jest + Supertest
======================================

Este projeto é um exemplo de como testar uma API Express com banco em Sequelize com PostgreSQL e operações CRUD.

Pré-requisitos
--------------

-   Node.js
-   PostgreSQL

Instalação
----------

1.  Clone o repositório:

    ```
    git clone https://github.com/driuzzo/api-testing-jest-supertest.git
    ```

3.  Acesse o repositório:

    ```
    cd api-testing-jest-supertest
    ```

5.  Instale as dependências:

    ```
    npm install
    ```

7.  Renomeie o arquivo `.env-example` para `.env` e configure as credenciais do banco de dados nesse arquivo. Exemplo:

    ```
    DATABASE_URL=
    DEV_DATABASE_URL=postgres://<db_user>:<db_password>@127.0.0.1:5432/dev_db
    TEST_DATABASE_URL=postgres://<db_user>:<db_password>@127.0.0.1:5432/test_db
    ```

8.  Sincronize o banco de dados:

    ```
    npx sequelize-cli db:create
    npx sequelize-cli db:migrate
    ```

Uso
---

### Iniciar o servidor

`npm start-dev`

### Executar testes

`npm test`
