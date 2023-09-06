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
