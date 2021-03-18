import { client } from '../database/redis'
import { logger } from '../logger/winston'

/**
 * Method to query the redis storage for function call traces
 * @param index index to lookup in redis storage. If the index is found,
 * then return data, else return null
 */
export const queryCache = (index: string): Promise<string | null> =>
  new Promise((resolve) => {
    client.get(index, (err, data: string | null) => {
      /** either there can be error in fetching from redis */
      if (err !== null) {
        logger.error(`cache.error`)
        logger.error(err)
        resolve(null)

        /** or the data would not be found, aka cache miss */
      } else if (data === null) {
        logger.info(`cache.miss.${index}`)
        logger.info('db.active')
        resolve(null)

        /** or the data would be found, aka cache hit */
      } else {
        logger.info(`cache.hit.${index}`)
        resolve(data)
      }
    })
  })
