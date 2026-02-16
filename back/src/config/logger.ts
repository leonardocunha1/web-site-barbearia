import { createLogger, format, transports } from 'winston';

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.json(), // O Datadog prefere JSON
  ),
  transports: [
    new transports.Console(), // Para ver no terminal
    // Se estiver usando o Agent no Docker, o Agent pode ler do console ou de um arquivo
  ],
});

export default logger;
