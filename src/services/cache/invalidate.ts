import { client } from '../database/redis'
import { logger } from '../logger/winston'

export const invalidateCache = (index: string) => {
  client.DEL(index, (err, data) => {
    if (err !== null) {
      logger.error(`cache.invalidation.${index}`)
    } else {
      logger.info(`cache.invalidation.${index}.${data}`)
    }
  })
}
