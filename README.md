# Gerando Programadores - Backend

API RESTful para a plataforma Gerando Programadores, construída com Node.js, Express e SQLite.

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **SQLite3** - Banco de dados
- **JWT** - Autenticação
- **bcrypt** - Hash de senhas
- **express-rate-limit** - Rate limiting

## 📋 Pré-requisitos

- Node.js >= 14.x
- npm ou yarn

## 🔧 Instalação

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite .env com suas configurações

# Iniciar servidor
npm start
```

## 📁 Estrutura do Projeto

```
├── config/
│   └── db.js              # Configuração do banco de dados
├── controllers/
│   ├── authControllers.js # Autenticação e usuário
│   ├── cursoControler.js  # Gestão de cursos
│   ├── userCoursesController.js # Progresso do aluno
│   └── rateController.js  # Rate limiting
├── middlewares/
│   └── auth.js            # Middleware de autenticação JWT
├── models/
│   ├── userModel.js       # Operações de usuário
│   ├── cursosModel.js     # Operações de cursos
│   └── userCoursesModel.js# Progresso do aluno
├── routes/
│   └── userRoutes.js      # Definição das rotas
└── server.js              # Entry point
```

## 🔐 Variáveis de Ambiente

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `PORT` | Porta do servidor | `5000` |
| `JWT_SECRET` | Segredo para JWT (mínimo 32 caracteres) | `sua-chave-secreta` |
| `KEY_PROSSES` | Chave para rotas administrativas | `hash-seguro` |
| `NODE_ENV` | Ambiente (production/development) | `production` |

## 📚 Documentação

- [Endpoints de Autenticação](#autenticação)
- [Endpoints de Usuário](#usuário)
- [Endpoints de Cursos](#cursos)
- [Endpoints de Progresso](#progresso-do-aluno)

Veja mais detalhes em [docs/ENDPOINTS.md](./docs/ENDPOINTS.md)

## 🔒 Segurança

- Senhas criptografadas com bcrypt (salt 10)
- JWT com expiração de 24h
- Cookies httpOnly e secure (em produção)
- Rate limiting: 100 req/15min (geral), 5 req/5min (auth)
- Foreign keys habilitadas no SQLite

## 📝 Licença

Projeto Gerando Programadores
