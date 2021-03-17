import { client } from '../database/redis'
import { logger } from '../logger/winston'

export const setCache = (index: string, data: any) =>
  new Promise((resolve) => {
    client.set(index, JSON.stringify(data), (err: any, resp: string) => {
      if (err !== null) {
        logger.error(`Error setting cache for ${index}`)
        logger.error(err)
      } else {
        logger.info(`Cache set for ${index}`)
        logger.info(resp)
      }
      resolve(true)
    })
  })
