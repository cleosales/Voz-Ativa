# VozAtiva – Front-End

> Toda voz importa. Toda necessidade merece ser ouvida.

Front-end do **VozAtiva**, projeto da Global Solution FIAP 2026/2 (tema CitizenTech) para a disciplina de **Front-End Design Engineering**.

## Objetivo

Permitir que qualquer cidadão registre problemas do espaço público (calçada sem rampa, poste apagado, vazamento, barreiras de acessibilidade) de forma guiada e simples, acompanhe o andamento pelo número de protocolo e ajude a cidade a priorizar o que é mais urgente. Atende principalmente pessoas com deficiência, idosos e quem tem mobilidade reduzida. ODS 3, 9, 10 e 11.

## Tecnologias

- React 18 + Vite + TypeScript
- Tailwind CSS (estilização principal)
- React Router
- Fetch API (sem Axios)
- API Java (Spring Boot + JDBC + Oracle), publicada no Render
- Vercel (deploy do front)

## Funcionalidades

- Assistente guiado de registro em 5 passos, com sugestão de urgência
- Lista de ocorrências com filtros (categoria, status, urgência, bairro)
- Busca e acompanhamento por protocolo (ex.: `VA-0001`), com linha do tempo
- Atualização de andamento, edição e exclusão de ocorrências
- Painel com ranking de bairros e destaque para barreiras de acessibilidade
- Cadastro de categorias
- Acessibilidade: letras ampliáveis, alto contraste, foco visível, navegação por teclado, link "Ir para o conteúdo", botões grandes

## Estrutura

```
src/
├── components/   componentes reutilizáveis (Header, Footer, CardOcorrencia, StatusBadge, CampoFormulario, Carregando, Alerta…)
├── pages/        páginas e rotas
├── services/     api.ts (Fetch para a API Java) e ia.ts (sugestão de urgência)
├── types/        interfaces (Ocorrencia, Categoria, Atualizacao…)
├── hooks/        useBusca (loading, erro e dados) e useTitulo
├── contexts/     preferências de acessibilidade
├── utils/        formatação de protocolo, datas e rótulos
└── data/         dados dos integrantes
```

## Rotas

`/` · `/integrantes` · `/integrantes/:id` · `/sobre` · `/faq` · `/contato` · `/registrar` · `/ocorrencias` · `/ocorrencias/:id` · `/painel` · `/categorias`

## Integração com a API Java

| Ação | Chamada |
|---|---|
| Listar categorias | `GET /categorias` |
| Cadastrar / excluir categoria | `POST /categorias` · `DELETE /categorias/{id}` |
| Listar / buscar ocorrência | `GET /ocorrencias` · `GET /ocorrencias/{id}` |
| Registrar ocorrência | `POST /ocorrencias` |
| Editar / excluir ocorrência | `PUT /ocorrencias/{id}` · `DELETE /ocorrencias/{id}` |
| Linha do tempo | `GET /ocorrencias/{id}/atualizacoes` |
| Atualizar andamento | `POST /ocorrencias/{id}/atualizacoes` |

Os POST e PUT da API devolvem texto, e o id criado vem no header `Location`. O protocolo exibido é o id formatado (`VA-0001`). Todos os erros da API (`{ status, mensagem }`) são mostrados ao usuário.

## Como executar

Pré-requisitos: Node.js 18 ou superior.

```bash
npm install
cp .env.example .env     # ajuste VITE_API_URL
npm run dev
```

Variáveis de ambiente:

- `VITE_API_URL`: URL da API Java (padrão `http://localhost:8080`)
- `VITE_IA_URL`: opcional, URL da API Flask de IA. Sem ela, o assistente usa uma regra local simples para sugerir a urgência.

Na Vercel, cadastre `VITE_API_URL` em Settings > Environment Variables. O arquivo `vercel.json` garante que acessar uma rota diretamente não gere erro 404.

## Links

- GitHub: _(preencher)_
- Vercel: _(preencher)_
- API Java (Render): _(preencher)_
- Vídeo (YouTube): _(preencher)_

## Integrantes

| Nome | RM | Turma |
|---|---|---|
| Cléo Sales Vicente | 561298 | 1TDSPI |
| Nicolly Martins de Souza | 563221 | 1TDSPI |

Contato: _(preencher e-mail do grupo)_

## Uso de IA generativa

Foi utilizada a ferramenta Claude (Anthropic) como apoio no desenvolvimento do front-end (estrutura inicial e geração de código). O código foi revisado, testado e entendido pelo grupo. _(Ajuste este parágrafo para refletir fielmente o que vocês fizeram.)_

Projeto acadêmico da Global Solution FIAP 2026/2.
