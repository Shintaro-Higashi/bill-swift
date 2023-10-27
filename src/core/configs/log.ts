import pino from 'pino'

const pinoConfig = {
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  browser: {
    asObject: true,
  },
}

const logger = pino(pinoConfig)

type Option = {
  caller: string
  status: number
}

// TODO 改装中..
export function logInfo(...args: any[]) {
  // argsを結合してメッセージを作成
  const message = args.map((arg) => (typeof arg === 'object' ? JSON.stringify(arg) : arg)).join(' ')
  logger.info(message)
}

/**
 * エラーログを出力します。
 * @param message
 * @param option
 */
export const loggerError = (message: string, option?: Option) => {
  return logger.error(option, message)
}

/**
 * ワーニングログを出力します。
 * @param message
 * @param option
 */
export const loggerWarn = (message: string, option?: Option) => {
  return logger.warn(option, message)
}

/**
 * Infoログを出力します。
 * @param message
 * @param option
 */
export const loggerInfo = (message: string, option?: Option) => {
  return logger.info(option, message)
}

/**
 * デバッグログを出力します。
 * @param message
 * @param option
 */
export const loggerDebug = (message: string, option?: Option) => {
  return logger.debug(option, message)
}
