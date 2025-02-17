# Projeto Pantore Challenge API

## Requisitos

- Node.js (Versão conforme o arquivo `.nvmrc`)
- Docker (para rodar o Postgres)
- Yarn (gerenciador de pacotes)

## Passo a Passo para Rodar o Projeto

### 1. Configurar o Ambiente

Clone o repositório e instale as dependências:

```bash
git clone <URL_DO_REPOSITORIO>
cd pantore-challenge-api
```

Instale as dependências do projeto:

```bash
yarn install
```

### 2. Configuração do Docker

O projeto utiliza Docker para rodar o banco de dados PostgreSQL. Para isso, você precisa ter o Docker instalado em sua máquina.

Para subir o banco de dados, execute:

```bash
docker-compose up -d
```

Isso iniciará o container do Postgres com as credenciais definidas no arquivo `.env.sample`. O banco de dados será acessível pela aplicação com essas credenciais.

### 3. Configuração do Arquivo `.env`

Crie um arquivo `.env` a partir do template `.env.sample`:

```bash
cp .env.sample .env
```

Esse arquivo contém as configurações de banco de dados e outras variáveis de ambiente essenciais para o funcionamento da aplicação.

### 4. Rodar as Migrations

As migrations serão aplicadas automaticamente ao rodar a aplicação com o comando:

```bash
yarn start:dev
```

Isso iniciará o servidor e aplicará as migrations no banco de dados Postgres.

### 5. Rodar a Aplicação em Desenvolvimento

Para rodar a aplicação em modo de desenvolvimento (com hot reload), utilize:

```bash
yarn start:dev
```

### 6. Acessando a Documentação da API (Swagger)

A documentação da API é gerada automaticamente e pode ser acessada no Swagger UI em:

```
http://localhost:3000/docs
```

No Swagger, você poderá visualizar todos os endpoints da API, incluindo métodos HTTP, parâmetros de entrada e exemplos de respostas. A interface também permite que você interaja diretamente com os endpoints, enviando requisições e vendo as respostas sem precisar de outras ferramentas externas.

### 7. Testes

Para rodar os testes da aplicação, utilize:

```bash
yarn test
```

Isso executará todos os testes unitários presentes no projeto.

## Estrutura do Projeto

A estrutura do projeto segue a organização típica do NestJS, com as seguintes pastas principais:

- `src/config`: Configurações do ambiente e banco de dados.
- `src/users`: Lógica relacionada aos usuários.
- `src/auth`: Autenticação e autorização.
- `src/database`: Configuração do banco de dados e migrations.

## Contribuindo

Sinta-se à vontade para contribuir com o projeto. Caso tenha alguma dúvida ou queira sugerir melhorias, abra uma issue ou envie um pull request.

## Licença

Este projeto está licenciado sob a MIT License.
