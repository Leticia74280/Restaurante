# Gourmet Reservas

O **Gourmet Reservas** é uma plataforma web desenvolvida para facilitar o processo de reserva de mesas em restaurantes. A proposta é proporcionar aos usuários uma experiência fluida para explorar restaurantes e realizar reservas online, ao mesmo tempo em que oferece aos estabelecimentos um painel de gestão simples e eficiente.

## Funcionalidades Principais

### Para Clientes:

* Cadastro e login de usuários.
* Navegação por restaurantes com filtros por categoria.
* Visualização de detalhes de estabelecimentos (endereço, horário, especialidades).
* Reserva online de mesas com confirmação por e-mail.
* Seção de gerenciamento de reservas (visualização e cancelamento).

### Para Funcionários:

* Acesso ao painel administrativo.
* Criação, visualização e cancelamento de reservas.
* Configuração de horários de funcionamento e controle da disponibilidade de mesas.

---

## Tecnologias Utilizadas

* **React** – construção da interface dinâmica.
* **TypeScript** – segurança e organização no código.
* **Tailwind CSS + shadcn/ui** – estilo responsivo e moderno.
* **React Query** – gerenciamento de dados assíncronos.
* **React Router** – navegação em Single Page Application.
* **Vite** – bundler moderno e rápido.
* **Jest** – testes unitários e de lógica.

---

## Testes Unitários com Jest ✅

A aplicação possui cobertura de testes unitários para a lógica de negócio crítica:

### 1. Gerenciamento de Reservas

- ✔ **Criar reserva**: verificação de disponibilidade de mesas e criação correta da reserva.
- ✔ **Editar reserva**: validação de horários e entrada de dados.
- ✔ **Cancelar reserva**: lógica de cancelamento que atualiza o status corretamente.
- ✔ **Visualizar reservas ativas/passadas**: filtragem funcional com base na data e status da reserva.

### 2. Gerenciamento de Disponibilidade

- ✔ **Definir horários de funcionamento**: validação de coerência entre horário de abertura e fechamento.
- ✔ **Configurar disponibilidade de mesas**: lógica de não sobreposição de horários por mesa.
- ✔ **Evitar conflitos de reservas**: algoritmo detecta corretamente conflitos de horário e mesa.

### 3. Gerenciamento de Usuários

- ✔ **Registro de clientes**: validação de e-mail válido, senha forte e dados obrigatórios.
- ✔ **Autenticação**: verificação de senha correta e geração de token de autenticação (mockado).
- ✔ **Perfis de clientes**: funções que exibem ou processam dados de perfil sem dependência direta de banco de dados.

---

## Guia de Instalação

### Passo 1: Clone o repositório usando o URL do projeto do Git

```bash
git clone https://github.com/Leticia74280/Restaurante.git
````

### Passo 2: Acesse o diretório do projeto

```bash
cd Restaurante
```

### Passo 3: Instale as dependências

```bash
npm install
```

### Passo 4: Inicie o servidor de desenvolvimento

```bash
npm run dev
```

---

## Acessando a Aplicação

Após iniciar o projeto localmente, acesse a aplicação pelo navegador em:

```
http://localhost:5173
```

Ou utilize a versão online em produção:

```
https://gourmet-experience.vercel.app
```
