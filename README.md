# VozAtiva

Toda voz importa. Toda necessidade merece ser ouvida.

Projeto da Global Solution FIAP 2026/2 (CitizenTech). Este repositório reúne as duas partes:

| Pasta | O que é | Tecnologias |
|---|---|---|
| `backend/` | API REST | Java 17, Spring Boot, Spring JDBC, Oracle, Docker |
| `frontend/` | Interface web | React 18, Vite, TypeScript, Tailwind, React Router |

O front conversa com a API pela variável `VITE_API_URL` (padrão `http://localhost:8080`).

## Rodar tudo localmente

**1. Back-end** (precisa de Java 17 e acesso ao Oracle):

```bash
cd backend

./mvnw spring-boot:run        
```

A API sobe em `http://localhost:8080`. O script `backend/script.sql` cria as tabelas.

**2. Front-end** (Node 18+), em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

Abra o endereço que o Vite mostrar (normalmente `http://localhost:5173`).

## Publicação

- **API (Render):** crie o serviço apontando para este repositório com **Root Directory = `backend`** (usa o `Dockerfile`). Configure `DB_URL`, `DB_USER` e `DB_PASSWORD`.
- **Front (Vercel):** importe este repositório com **Root Directory = `frontend`** e cadastre `VITE_API_URL` com a URL da API do Render, sem barra no final.

Mais detalhes em `backend/README.md` e `frontend/README.md`.
