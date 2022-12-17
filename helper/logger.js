const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const logger = createLogger({
  level: 'info',
  format:  combine(
    label({ label: 'pregnancy-prayer' }),
    timestamp(),
    myFormat),
    defaultMeta: { service: 'pregnancy-prayer-service' },
    transports: [

    new transports.File({ filename: './logs/error.log', level: 'error',maxsize: 5000000}),
    new transports.File({ filename: './logs/combined.log',maxsize: 5000000}),
  ],
});

module.exports = logger
  
  