# Documentação da API - Gerando Programadores

Base URL: `http://localhost:5000/api` (desenvolvimento)  
Base URL: `https://gerando-programadores-back.onrender.com/api` (produção)

---

## 📑 Índice

1. [Autenticação](#autenticação)
2. [Usuário](#usuário)
3. [Cursos](#cursos)
4. [Progresso do Aluno](#progresso-do-aluno)
5. [Administrativo](#administrativo)

---

## Autenticação

### Registrar Novo Usuário

**POST** `/register`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "username": "João Silva",
  "email": "joao@email.com",
  "password": "senha123"
}
```

**Resposta (201):**
```json
{
  "user": {
    "id": 1,
    "username": "João Silva",
    "email": "joao@email.com"
  }
}
```

**Resposta (400):**
```json
{
  "msg": "Usuário já existe"
}
```

---

### Login

**POST** `/login`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "email": "joao@email.com",
  "password": "senha123"
}
```

**Resposta (200):**
```json
{
  "sucesso": true,
  "user": {
    "id": 1,
    "username": "João Silva",
    "email": "joao@email.com",
    "bio": null,
    "foto": null,
    "created_at": "2026-04-02T10:00:00.000Z"
  }
}
```

**Cookie retornado:**
```
token: <jwt_token>
httpOnly: true
secure: true (produção)
sameSite: none (produção) / lax (desenvolvimento)
maxAge: 86400000 (24h)
```

---

### Logout

**POST** `/auth/logout`

**Headers:**
```
Cookie: token=<jwt_token>
```

**Resposta (200):**
```json
{
  "message": "Logout realizado com sucesso",
  "logado": false
}
```

---

### Validar Token

**GET** `/validate`

**Headers:**
```
Cookie: token=<jwt_token>
```

**Resposta (200):**
```json
{
  "valid": true,
  "user": {
    "id": 1,
    "iat": 1712059200,
    "exp": 1712145600
  }
}
```

**Resposta (401):**
```json
{
  "valid": false,
  "msg": "Sem token"
}
```

---

## Usuário

### Obter Dados do Usuário Autenticado

**GET** `/auth/me`

**Headers:**
```
Cookie: token=<jwt_token>
```

**Resposta (200):**
```json
{
  "logado": true,
  "user": {
    "id": 1,
    "username": "João Silva",
    "email": "joao@email.com",
    "bio": "Desenvolvedor iniciante",
    "foto": "perfil.jpg",
    "created_at": "2026-04-02T10:00:00.000Z",
    "cursos": [
      {
        "id_curso": 1,
        "nome_curso": "JavaScript Básico",
        "descricao": "Aprenda JS do zero",
        "grau": "iniciante",
        "imagem": "js.png",
        "user_id": 1
      }
    ]
  }
}
```

---

### Atualizar Biografia

**PUT** `/auth/bio`

**Headers:**
```
Cookie: token=<jwt_token>
Content-Type: application/json
```

**Body:**
```json
{
  "bio": "Estudante de programação focado em JavaScript"
}
```

**Resposta (200):**
```json
{
  "msg": "Biografia atualizada com sucesso",
  "bio": "Estudante de programação focado em JavaScript"
}
```

---

### Atualizar Nome de Usuário

**PUT** `/auth/username`

**Headers:**
```
Cookie: token=<jwt_token>
Content-Type: application/json
```

**Body:**
```json
{
  "userName": "João Dev"
}
```

**Resposta (200):**
```json
{
  "msg": "Nome de usuário alterado com sucesso",
  "username": "João Dev"
}
```

---

### Atualizar Senha

**PUT** `/auth/password`

**Headers:**
```
Cookie: token=<jwt_token>
Content-Type: application/json
```

**Body:**
```json
{
  "currentPassword": "senha123",
  "newPassword": "novaSenha456"
}
```

**Resposta (200):**
```json
{
  "msg": "Senha alterada com sucesso"
}
```

**Resposta (400):**
```json
{
  "msg": "Senha atual incorreta"
}
```

---

### Atualizar Foto de Perfil

**PUT** `/auth/foto`

**Headers:**
```
Cookie: token=<jwt_token>
Content-Type: application/json
```

**Body:**
```json
{
  "foto": "nova-foto.jpg"
}
```

**Resposta (200):**
```json
{
  "msg": "Foto atualizada com sucesso",
  "foto": "nova-foto.jpg"
}
```

---

## Cursos

### Criar Novo Curso

**POST** `/auth/create-cursos`

**Headers:**
```
Cookie: token=<jwt_token>
Content-Type: application/json
```

**Body:**
```json
{
  "nome_curso": "JavaScript Básico",
  "descricao": "Aprenda JavaScript do zero ao avançado",
  "grau": "iniciante",
  "imagem": "https://exemplo.com/js.png"
}
```

**Campos obrigatórios:** `nome_curso`, `descricao`, `grau`

**Resposta (201):**
```json
{
  "message": "Curso adicionado com sucesso",
  "curso": {
    "id": 1,
    "nome_curso": "JavaScript Básico",
    "descricao": "Aprenda JavaScript do zero ao avançado",
    "grau": "iniciante",
    "imagem": "https://exemplo.com/js.png",
    "user_id": 1
  }
}
```

---

### Listar Todos os Cursos

**GET** `/auth/list-cursos`

**Resposta (200):**
```json
{
  "cursos": [
    {
      "id_curso": 1,
      "nome_curso": "JavaScript Básico",
      "descricao": "Aprenda JS do zero",
      "grau": "iniciante",
      "imagem": "js.png",
      "user_id": 1,
      "created_at": "2026-04-02T10:00:00.000Z"
    }
  ]
}
```

---

### Listar Meus Cursos (Criados pelo Usuário)

**GET** `/cursos/meus`

**Headers:**
```
Cookie: token=<jwt_token>
```

**Resposta (200):**
```json
{
  "cursos": [
    {
      "id_curso": 1,
      "nome_curso": "JavaScript Básico",
      "descricao": "Aprenda JS do zero",
      "grau": "iniciante",
      "imagem": "js.png",
      "user_id": 1
    }
  ]
}
```

---

### Deletar Curso

**DELETE** `/auth/delete-cursos`

**Headers:**
```
Cookie: token=<jwt_token>
Content-Type: application/json
```

**Body:**
```json
{
  "id_curso": 1
}
```

**Resposta (200):**
```json
{
  "message": "Curso deletado com sucesso"
}
```

**Resposta (404):**
```json
{
  "error": "Curso não encontrado ou você não tem permissão"
}
```

---

## Progresso do Aluno

### Inscrever-se em um Curso

**POST** `/auth/cursos/enroll`

**Headers:**
```
Cookie: token=<jwt_token>
Content-Type: application/json
```

**Body:**
```json
{
  "curso_id": 1
}
```

**Resposta (200):**
```json
{
  "id": 1,
  "user_id": 1,
  "curso_id": 1,
  "status": "enrolled",
  "message": "Inscrito no curso com sucesso"
}
```

**Respostas possíveis:**
- `enrolled` - Nova inscrição
- `already_enrolled` - Já estava inscrito
- `reattached` - Reinscrição após cancelamento

---

### Buscar Progresso de um Curso

**GET** `/auth/cursos/:curso_id/progress`

**Headers:**
```
Cookie: token=<jwt_token>
```

**Resposta (200):**
```json
{
  "enrolled": true,
  "progress": {
    "id": 1,
    "user_id": 1,
    "curso_id": 1,
    "enrolled_at": "2026-04-02T10:00:00.000Z",
    "completed_at": null,
    "progress_percent": 45,
    "status": "in_progress"
  }
}
```

**Resposta (404):**
```json
{
  "message": "Usuário não está inscrito neste curso",
  "enrolled": false
}
```

---

### Atualizar Progresso do Curso

**PUT** `/auth/cursos/progress`

**Headers:**
```
Cookie: token=<jwt_token>
Content-Type: application/json
```

**Body:**
```json
{
  "curso_id": 1,
  "progress_percent": 75
}
```

**Resposta (200):**
```json
{
  "user_id": 1,
  "curso_id": 1,
  "progress_percent": 75,
  "status": "in_progress"
}
```

**Status possíveis:**
- `enrolled` - Inscrito (0%)
- `in_progress` - Em progresso (1-99%)
- `completed` - Completado (100%)
- `canceled` - Cancelado

**Resposta (100% - completado):**
```json
{
  "user_id": 1,
  "curso_id": 1,
  "progress_percent": 100,
  "status": "completed"
}
```

---

### Listar Meus Cursos (Inscrições)

**GET** `/auth/cursos/my-courses`

**Headers:**
```
Cookie: token=<jwt_token>
```

**Resposta (200):**
```json
{
  "courses": [
    {
      "id": 1,
      "user_id": 1,
      "curso_id": 1,
      "enrolled_at": "2026-04-02T10:00:00.000Z",
      "completed_at": null,
      "progress_percent": 45,
      "status": "in_progress",
      "nome_curso": "JavaScript Básico",
      "descricao": "Aprenda JS do zero",
      "grau": "iniciante",
      "imagem": "js.png"
    }
  ]
}
```

---

### Cancelar Inscrição em Curso

**DELETE** `/auth/cursos/cancel`

**Headers:**
```
Cookie: token=<jwt_token>
Content-Type: application/json
```

**Body:**
```json
{
  "curso_id": 1
}
```

**Resposta (200):**
```json
{
  "message": "Inscrição cancelada com sucesso"
}
```

---

### Listar Cursos Completados

**GET** `/auth/cursos/completed`

**Headers:**
```
Cookie: token=<jwt_token>
```

**Resposta (200):**
```json
{
  "courses": [
    {
      "id": 2,
      "user_id": 1,
      "curso_id": 2,
      "enrolled_at": "2026-04-01T10:00:00.000Z",
      "completed_at": "2026-04-02T15:30:00.000Z",
      "progress_percent": 100,
      "status": "completed",
      "nome_curso": "HTML & CSS",
      "descricao": "Fundamentos da web",
      "grau": "iniciante",
      "imagem": "html.png"
    }
  ],
  "total": 1
}
```

---

## Administrativo

> ⚠️ **Atenção:** Estas rotas requerem chave administrativa via query param.

### Listar Todos os Usuários e Cursos

**GET** `/admin/db?key=<KEY_PROSSES>`

**Query Params:**
- `key`: Chave administrativa (variável de ambiente `KEY_PROSSES`)

**Resposta (200):**
```json
{
  "users": [
    {
      "id": 1,
      "username": "João Silva",
      "email": "joao@email.com",
      "password": "$2a$10$...",
      "bio": null,
      "foto": null,
      "created_at": "2026-04-02T10:00:00.000Z"
    }
  ],
  "cursos": [
    {
      "id_curso": 1,
      "nome_curso": "JavaScript Básico",
      "descricao": "Aprenda JS do zero",
      "grau": "iniciante",
      "imagem": "js.png",
      "user_id": 1
    }
  ]
}
```

---

### Buscar Usuário por Email com Cursos

**GET** `/admin/user/:email?key=<KEY_PROSSES>`

**Query Params:**
- `key`: Chave administrativa

**Path Params:**
- `email`: Email do usuário

**Resposta (200):**
```json
{
  "id": 1,
  "username": "João Silva",
  "email": "joao@email.com",
  "password": "$2a$10$...",
  "bio": "Desenvolvedor",
  "foto": "perfil.jpg",
  "created_at": "2026-04-02T10:00:00.000Z",
  "cursos": [
    {
      "id_curso": 1,
      "nome_curso": "JavaScript Básico",
      "descricao": "Aprenda JS do zero",
      "grau": "iniciante"
    }
  ]
}
```

**Resposta (404):**
```json
{
  "msg": "Usuário não encontrado"
}
```

**Resposta (403):**
```json
{
  "error": "Acesso não permitido"
}
```

---

## Códigos de Status HTTP

| Código | Descrição |
|--------|-----------|
| 200 | Sucesso |
| 201 | Criado |
| 400 | Requisição inválida |
| 401 | Não autorizado |
| 403 | Acesso negado |
| 404 | Não encontrado |
| 500 | Erro interno do servidor |

---

## Rate Limiting

| Endpoint | Limite |
|----------|--------|
| `/register`, `/login` | 5 requisições em 5 minutos |
| Demais endpoints | 100 requisições em 15 minutos |

**Headers de resposta:**
```
RateLimit-Limit: 5
RateLimit-Remaining: 3
RateLimit-Reset: 1712059500
```

---

## Exemplo de Uso (JavaScript/Fetch)

```javascript
// Login
const login = async (email, password) => {
  const response = await fetch('http://localhost:5000/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password })
  });
  return await response.json();
};

// Inscrever-se em um curso
const enrollInCourse = async (cursoId) => {
  const response = await fetch('http://localhost:5000/api/auth/cursos/enroll', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ curso_id: cursoId })
  });
  return await response.json();
};

// Atualizar progresso
const updateProgress = async (cursoId, percent) => {
  const response = await fetch('http://localhost:5000/api/auth/cursos/progress', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ curso_id: cursoId, progress_percent: percent })
  });
  return await response.json();
};
```
