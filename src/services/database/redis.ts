import redis from 'redis'
import { logger } from '../logger/winston'

const client = redis.createClient(6379, '127.0.0.1')

const initializeRedis = () => {
  client.set('status', 'server up')
  client.get('status', (err: any) => {
    if (err) {
      logger.error('connection.redis.failed')
    } else {
      logger.info('connection.redis.success')
    }
  })
}

export { initializeRedis, client }
