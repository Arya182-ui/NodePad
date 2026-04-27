// Minimal structured logger — no extra deps, works in dev and prod
const isDev = process.env.NODE_ENV !== 'production';

const fmt = (level, msg, meta) => {
  const ts = new Date().toISOString();
  if (isDev) {
    const color = { info: '\x1b[36m', warn: '\x1b[33m', error: '\x1b[31m' }[level] || '';
    const reset = '\x1b[0m';
    const metaStr = meta ? ' ' + JSON.stringify(meta) : '';
    return `${color}[${level.toUpperCase()}]${reset} ${ts} ${msg}${metaStr}`;
  }
  // Production: JSON lines for log aggregators (Datadog, CloudWatch, etc.)
  return JSON.stringify({ level, ts, msg, ...meta });
};

const logger = {
  info:  (msg, meta) => console.log(fmt('info',  msg, meta)),
  warn:  (msg, meta) => console.warn(fmt('warn',  msg, meta)),
  error: (msg, meta) => console.error(fmt('error', msg, meta)),
};

module.exports = logger;
