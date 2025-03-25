const winston = require('winston');
const path = require('path');

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define log level based on environment
const level = () => {
  const env = process.env.NODE_ENV || 'development';
  return env === 'development' ? 'debug' : 'info';
};

// Define custom format
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf((info) => {
    const message = typeof info.message === 'object' 
      ? JSON.stringify(info.message) 
      : info.message;
    return `${info.timestamp} ${info.level.toUpperCase()}: ${message}`;
  })
);
// Define file transport options
const fileOptions = {
  maxsize: 5242880, // 5MB
  maxFiles: 5,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
};

// Configure transports
const transports = [
  // Console transport
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      format
    ),
  }),
];

// Add file transports in production
if (process.env.NODE_ENV === 'production') {
  transports.push(
    // Error log
    new winston.transports.File({
      ...fileOptions,
      filename: path.join('logs', 'error.log'),
      level: 'error',
    }),
    // Combined log
    new winston.transports.File({
      ...fileOptions,
      filename: path.join('logs', 'combined.log'),
    })
  );
}

// Create logger
const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
  exitOnError: false,
});

// Export logger
module.exports = logger;