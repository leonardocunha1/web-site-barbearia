# Cancelamento Automático de Agendamentos Expirados

Este sistema cancela automaticamente agendamentos com status `PENDING` cujo horário já passou e que não foram confirmados pelo profissional.

## Como Funciona

O sistema usa **duas abordagens complementares**:

### 1. Cron Job (Ativo)

Script que roda periodicamente via cron/scheduler.

**Comando:**

```bash
npm run cron:cancel-expired
```

### 2. Check Passivo (Preventivo)

Executa automaticamente ao listar agendamentos (com cache de 5 minutos).

Implementado em:

- `findManyByProfessionalId()`
- `findManyByUserId()`

## Configuração do Cron

### Linux/Mac (crontab)

Editar crontab:

```bash
crontab -e
```

Adicionar linha (executa a cada 15 minutos):

```bash
*/15 * * * * cd /path/to/project/back && npm run cron:cancel-expired >> logs/cron.log 2>&1
```

Ou a cada 30 minutos:

```bash
*/30 * * * * cd /path/to/project/back && npm run cron:cancel-expired >> logs/cron.log 2>&1
```

### Windows (Task Scheduler)

1. Abrir **Task Scheduler**
2. Criar tarefa básica
3. **Trigger:** Repetir a cada 15 minutos
4. **Ação:** Iniciar programa
   - **Programa:** `cmd.exe`
   - **Argumentos:** `/c cd C:\path\to\project\back && npm run cron:cancel-expired >> logs\cron.log 2>&1`

### Docker/Kubernetes

Adicionar no `docker-compose.yml`:

```yaml
services:
  cron:
    image: node:20-alpine
    working_dir: /app
    volumes:
      - ./back:/app
    command: sh -c "while true; do npm run cron:cancel-expired; sleep 900; done"
    environment:
      - DATABASE_URL=${DATABASE_URL}
```

## Monitoramento

Verificar logs:

```bash
tail -f back/logs/cron.log
```

Exemplo de saída:

```
[2026-02-13T12:00:00.000Z] Iniciando cancelamento de agendamentos expirados...
[2026-02-13T12:00:01.234Z] ✅ Concluído: 3 agendamento(s) cancelado(s)
```

## Lógica de Cancelamento

**Condições para cancelar:**

- Status: `PENDING`
- `startDateTime` < data/hora atual
- `canceledAt` é null

**Ação:**

- Define `status = CANCELED`
- Define `canceledAt = now()`
- Adiciona nota: "Cancelado automaticamente por falta de confirmação"

## Arquivos Relacionados

- Use Case: `src/use-cases/bookings/cancel-expired-bookings-use-case.ts`
- Script: `src/scripts/cancel-expired-bookings.ts`
- Repository: `src/repositories/prisma/prisma-bookings-repository.ts`
- Factory: `src/use-cases/factories/make-cancel-expired-bookings-use-case.ts`

## Teste Manual

Executar uma vez:

```bash
cd back
npm run cron:cancel-expired
```
