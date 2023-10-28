import pino from 'pino'
import { getCurrentDate, getCurrentFormatDate } from '@/core/utils/dateUtil'

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
  writeLog('ERROR', message, option)
}

/**
 * ワーニングログを出力します。
 * @param message
 * @param option
 */
export const loggerWarn = (message: string, option?: Option) => {
  if (!logger.isLevelEnabled('warn')) return
  // return logger.warn(option, message)
  writeLog('WARN', message, option)
}

/**
 * Infoログを出力します。
 * @param message
 * @param option
 */
export const loggerInfo = (message: string, option?: Option) => {
  if (!logger.isLevelEnabled('info')) return
  // return logger.info(option, message)
  writeLog('INFO', message, option)
}

/**
 * デバッグログを出力します。
 * @param message
 * @param option
 */
export const loggerDebug = (message: string, option?: Option) => {
  if (!logger.isLevelEnabled('debug')) return
  // return logger.debug(message, option ?? '')
  writeLog('DEBUG', message, option)
}

const writeLog = (logLevel: 'ERROR' | 'WARN' | 'INFO' | 'DEBUG', message: string, option?: Option) => {
  const now = getCurrentFormatDate({ fmt: 'yyyy/MM/dd HH:mm:ss.SSS' })
  console.log(`[${now}] ${logLevel} ${message}`, option ?? '')
}
