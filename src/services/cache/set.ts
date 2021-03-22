import { client } from '../database/redis'
import { logger } from '../logger/winston'

/**
 * @todo : Load TTL time from @cache Decorator, this would allow defining TTL times
 * for separate functions individually.
 *
 * @param index Index to store said item in cache
 * @param data data to store as index
 */
export const setCache = (index: string, data: any) =>
  new Promise((resolve) => {
    client.set(index, JSON.stringify(data), 'EX', 60 * 5, (err: any) => {
      if (err !== null) {
        logger.error(`cache.error.${index}`)
        logger.error(err)
      } else {
        logger.info(`cache.set.${index}`)
      }
      resolve(true)
    })
  })
