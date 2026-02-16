import tracer from 'dd-trace';

tracer.init({
  logInjection: true, // ESSENCIAL: injeta trace_id e span_id nos logs do Winston automaticamente
  env: 'estudos',
  service: 'minha-api-node',
  version: '1.0.0',
  hostname: process.env.DD_AGENT_HOST || 'localhost',
  port: process.env.DD_TRACE_AGENT_PORT || 8126,
});

export default tracer;
