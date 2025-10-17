/**
 * Server-side logging utility
 * These logs will only appear in Vercel logs, never in the browser console
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogContext {
  [key: string]: any;
}

/**
 * Check if we're running on the server
 */
function isServer(): boolean {
  return typeof window === 'undefined';
}

/**
 * Format log message with context
 */
function formatMessage(level: LogLevel, message: string, context?: LogContext): string {
  const timestamp = new Date().toISOString();
  const contextStr = context ? ` | Context: ${JSON.stringify(context)}` : '';
  return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
}

/**
 * Server-side logger - only logs when running on server (Vercel functions)
 */
export const logger = {
  /**
   * Log informational messages
   */
  info: (message: string, context?: LogContext) => {
    if (!isServer()) return;
    console.log(formatMessage('info', message, context));
  },

  /**
   * Log warning messages
   */
  warn: (message: string, context?: LogContext) => {
    if (!isServer()) return;
    console.warn(formatMessage('warn', message, context));
  },

  /**
   * Log error messages
   */
  error: (message: string, error?: Error | unknown, context?: LogContext) => {
    if (!isServer()) return;
    
    const errorDetails = error instanceof Error ? {
      message: error.message,
      stack: error.stack,
      name: error.name,
    } : error;

    console.error(formatMessage('error', message, {
      ...context,
      error: errorDetails,
    }));
  },

  /**
   * Log debug messages (only in development)
   */
  debug: (message: string, context?: LogContext) => {
    if (!isServer() || process.env.NODE_ENV !== 'development') return;
    console.debug(formatMessage('debug', message, context));
  },

  /**
   * Log API requests (useful for monitoring)
   */
  api: (method: string, path: string, context?: LogContext) => {
    if (!isServer()) return;
    console.log(formatMessage('info', `API ${method} ${path}`, context));
  },

  /**
   * Log Shopify operations
   */
  shopify: (operation: string, context?: LogContext) => {
    if (!isServer()) return;
    console.log(formatMessage('info', `Shopify: ${operation}`, context));
  },

  /**
   * Log YouTube operations
   */
  youtube: (operation: string, context?: LogContext) => {
    if (!isServer()) return;
    console.log(formatMessage('info', `YouTube: ${operation}`, context));
  },
};

/**
 * Create a scoped logger for a specific module
 */
export function createLogger(scope: string) {
  return {
    info: (message: string, context?: LogContext) => 
      logger.info(`[${scope}] ${message}`, context),
    warn: (message: string, context?: LogContext) => 
      logger.warn(`[${scope}] ${message}`, context),
    error: (message: string, error?: Error | unknown, context?: LogContext) => 
      logger.error(`[${scope}] ${message}`, error, context),
    debug: (message: string, context?: LogContext) => 
      logger.debug(`[${scope}] ${message}`, context),
  };
}

