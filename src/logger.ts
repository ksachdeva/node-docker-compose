import { createLogger, format, Logger, transports } from 'winston';

let _theLogger: Logger;

export function buildLogger(level: string) {
  _theLogger = createLogger(
    { level, format: format.simple(), transports: [new transports.Console()] });

  return _theLogger;
}

export function getLogger() {
  if (_theLogger !== undefined) {
    return _theLogger;
  }

  throw new Error('Need to first build the global logger !');
}
