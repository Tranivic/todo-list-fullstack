# 📝 Case Ten Todo

Este é um projeto Fullstack simples de TODO list, contendo:

- **Backend** em [NestJS](https://nestjs.com/) rodando em `http://localhost:3000/api`
- **Frontend** em React + Vite rodando em `http://localhost:3004`

## 📦 Pré-requisitos

- **Node.js** >= 22 (se rodar sem Docker)
- **npm** ou **pnpm** (npm vem com Node)
- **Docker** e **Docker Compose** (se optar pelo ambiente containerizado)

---

## 🚀 Rodando o projeto

Você pode escolher entre rodar **sem Docker** (ambiente local) ou **com Docker Compose** (containers).

---

### 🖥️ Rodando **sem Docker**

> Certifique-se de ter Node.js >= 22 instalado.
#### 2️⃣ Rodar o **backend**

`cd backend
npm install
npm run start:dev` 

O backend estará rodando em **[http://localhost:3000/api](http://localhost:3000/api)**.

#### 3️⃣ Rodar o **frontend**

Em outro terminal:

`cd frontend
npm install
npm run dev` 

O frontend estará disponível em **[http://localhost:3004](http://localhost:3004)** (Vite irá mostrar a URL no terminal).

### 🐳 Rodando **com Docker Compose**

> Necessário Docker e Docker Compose instalados.

Na raiz do projeto:

`docker compose up` 

-   **Backend:** `http://localhost:3000/api`
    
-   **Frontend:** `http://localhost:3004`
    

Para parar:

`docker compose down`

## 🧪 Testando o Backend

Os testes são feitos com **Jest**.

`cd backend`
`npm run test` 

Para cobertura de testes:

`npm run test:cov` 


Certifique-se de que essas portas estejam livres antes de iniciar.

## 💡 Melhorias Futuras (Não Implementadas)

Para demonstrar o raciocínio e visão de produto, estas são features e melhorias que **eu faria**, mas não implementei no desafio:

-   🚫 **Proibição de tasks com nomes duplicados** — validação no backend e no frontend para evitar duplicidade.
    
-   🔄 **Recalcular paginação** após adição ou exclusão de tarefas para evitar páginas "vazias".
    
-   ↩️ **Permitir undo (desfazer)** da última ação de exclusão para melhorar UX.
    
-   ♿ **Melhorar acessibilidade** do frontend (atalhos de teclado, roles ARIA).
    
-   🧪 **Escrever testes de frontend** para garantir confiabilidade das interfaces.
    
-   🔍 **Corrigir comportamentos da busca** (ex.: busca case-insensitive, debounce).
    
-   📦 **Subir os testes do frontend** para rodar em CI/CD.
----------
