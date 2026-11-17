
# VozAtiva

Sistema de registro e acompanhamento de ocorrências relacionadas à acessibilidade urbana.

## Objetivo

O VozAtiva permite cadastrar categorias de problemas urbanos, registrar ocorrências e acompanhar suas atualizações, contribuindo para a identificação e o monitoramento de questões de acessibilidade.

## Tecnologias utilizadas

- Java 17
- Spring Boot
- Spring Web MVC
- Spring JDBC
- Oracle Database
- Maven
- ModelMapper
- Bean Validation
- Docker

## Funcionalidades

- Cadastro, consulta, atualização e exclusão de categorias.
- Cadastro, consulta, atualização e exclusão de ocorrências.
- Cadastro e consulta de atualizações das ocorrências.
- Consulta de ocorrências por categoria.
- Consulta de atualizações por ocorrência.
- Validação de dados e regras de negócio.
- Tratamento de erros HTTP.

## Configuração do banco de dados

Configure as seguintes variáveis de ambiente:

- `DB_URL`: endereço de conexão com o Oracle.
- `DB_USER`: usuário do banco.
- `DB_PASSWORD`: senha do banco.

## Executar localmente

Certifique-se de possuir Java 17 e Maven instalados.

Execute:

```bash
mvn clean package
mvn spring-boot:run
```

A aplicação será iniciada na porta 8080, por padrão.

## Executar com Docker

Construa a imagem:

```bash
docker build -t vozativa .
```

Execute o contêiner:

```bash
docker run -p 8080:8080 \
-e DB_URL="sua_url" \
-e DB_USER="seu_usuario" \
-e DB_PASSWORD="sua_senha" \
vozativa
```

## Endpoints principais

| Método | Endpoint | Descrição |
|---|---|---|
| POST | `/categorias` | Cadastrar categoria |
| GET | `/categorias` | Listar categorias |
| GET | `/categorias/{id}` | Buscar categoria |
| POST | `/ocorrencias` | Cadastrar ocorrência |
| GET | `/ocorrencias` | Listar ocorrências |
| GET | `/ocorrencias/{id}` | Buscar ocorrência |
| GET | `/categorias/{id}/ocorrencias` | Listar ocorrências da categoria |
| POST | `/ocorrencias/{id}/atualizacoes` | Cadastrar atualização |
| GET | `/ocorrencias/{id}/atualizacoes` | Listar atualizações |
| POST | `/atualizacoes` | Cadastrar atualização pela rota tradicional |


## Equipe

Projeto acadêmico desenvolvido para a Global Solution FIAP 2026/2.

| Integrante | RM |
|---|---|
| Nicolly Martins de Souza | 563221 |
| Cléo Sales Vicente | 561298 |


Projeto acadêmico desenvolvido para a Global Solution FIAP 2026/2.
