# 🏰 Sistema de Reservas para Barbearia

## ✨ Visão Geral
Este projeto é um sistema de reservas para barbearias, permitindo que clientes agendem horários com barbeiros, gerenciem suas reservas e consultem serviços disponíveis.

## ✅ Requisitos Funcionais (RFs)
1. Deve ser possível **se cadastrar**.
2. Deve ser possível **se autenticar**.
3. Deve ser possível **obter o perfil** de um usuário logado.
4. Deve ser possível **listar horários disponíveis** para um serviço.
5. Deve ser possível **reservar um horário** com um barbeiro.
6. Deve ser possível **listar reservas feitas** pelo usuário.
7. Deve ser possível **cancelar uma reserva**.
8. Deve ser possível que um **barbeiro veja sua agenda** de reservas.
9. Deve ser possível que um **administrador/barbeiro cadastre serviços** disponíveis.

---

## 📊 Regras de Negócio (RNs)
1. O usuário **não deve poder se cadastrar com um e-mail duplicado**.
2. O usuário **só pode reservar um horário que esteja disponível**.
3. O usuário **só pode cancelar uma reserva até 2 horas antes** do horário marcado.
4. Apenas **administradores ou barbeiros** podem **cadastrar serviços**.
5. Apenas **barbeiros** podem **visualizar suas reservas**.
6. Um barbeiro **não pode ser reservado para dois horários simultâneos**.

---

## ⚙️ Requisitos Não-Funcionais (RNFs)
1. A senha do usuário precisa estar **criptografada**.
2. Os dados da aplicação precisam estar **persistidos em um banco PostgreSQL**.
3. Todas as listas de dados precisam estar **paginadas com 20 itens por página**.
4. O usuário deve ser identificado por um **JWT (JSON Web Token)**.

---

## 🚀 Tecnologias Utilizadas
### **Back-end**
- Node.js
- Fastify
- Prisma ORM
- TypeScript
- PostgreSQL

### **Front-end**
- Next.js
- Tailwind CSS
- React

### **Autenticação**
- NextAuth.js
- JWT (JSON Web Token)

---

Feito com ❤️ para aprendizado! 🌟

