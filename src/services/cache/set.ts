import { client } from '../database/redis'
import { logger } from '../logger/winston'

export const setCache = (index: string, data: any) =>
  new Promise((resolve) => {
    client.set(index, JSON.stringify(data), (err: any, resp: string) => {
      if (err !== null) {
        logger.error(`cache.error.${index}`)
        logger.error(err)
      } else {
        logger.info(`cache.set.${index}`)
      }
      resolve(true)
    })
  })
