// Logger simple pour la Phase 1 (pas d'infrastructure distribuée de logging)
const levels = { INFO: 'INFO', WARN: 'WARN', ERROR: 'ERROR' };

function log(level, message, meta) {
  const line = `[${new Date().toISOString()}] [${level}] ${message}`;
  if (meta !== undefined) {
    console.log(line, meta);
  } else {
    console.log(line);
  }
}

module.exports = {
  info: (message, meta) => log(levels.INFO, message, meta),
  warn: (message, meta) => log(levels.WARN, message, meta),
  error: (message, meta) => log(levels.ERROR, message, meta),
};
