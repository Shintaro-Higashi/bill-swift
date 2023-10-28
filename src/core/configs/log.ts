import pino from 'pino'

const pinoConfig = {
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  browser: {
    asObject: true,
  },
  // serializers: {
  //   err(value: any) {
  //     if (value instanceof Error) {
  //       return fullStack(value)
  //     } else {
  //       return value
  //     }
  //   },
  // },
}

export const logger = pino(pinoConfig)

type Option<T = any> = {
  // caller?: string
  // status?: number
  error?: any
  [key: string]: T
}

/**
 * エラーログを出力します。
 * @param message
 * @param option
 */
export const loggerError = (message: string, option?: Option) => {
  if (!logger.isLevelEnabled('error')) return
  // return logger.error(option, message)
  console.log(message, option ?? '')
}

/**
 * ワーニングログを出力します。
 * @param message
 * @param option
 */
export const loggerWarn = (message: string, option?: Option) => {
  if (!logger.isLevelEnabled('warn')) return
  // return logger.warn(option, message)
  console.log(message, option ?? '')
}

/**
 * Infoログを出力します。
 * @param message
 * @param option
 */
export const loggerInfo = (message: string, option?: Option) => {
  if (!logger.isLevelEnabled('info')) return
  // return logger.info(option, message)
  console.log(message, option ?? '')
}

/**
 * デバッグログを出力します。
 * @param message
 * @param option
 */
export const loggerDebug = (message: string, option?: Option) => {
  if (!logger.isLevelEnabled('debug')) return
  return logger.debug(message, option ?? '')
}
