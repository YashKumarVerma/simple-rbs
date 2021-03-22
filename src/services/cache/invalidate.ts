import { client } from '../database/redis'
import { logger } from '../logger/winston'

/**
 * To be used in ultra-urgent situations like user delete, profile updates etc
 *
 * @param index index to remove immediately from cache irrespective of TTL
 */
export const invalidateCache = (index: string) => {
  client.DEL(index, (err, data) => {
    if (err !== null) {
      logger.error(`cache.invalidation.${index}`)
    } else {
      logger.info(`cache.invalidation.${index}.${data}`)
    }
  })
}
