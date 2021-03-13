import config from 'config'
import mongoose from 'mongoose'
import { logger } from '../logger/winston'

const databaseConfigurations = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
}

const initializeMongoDB = () => {
  mongoose.connect(config.get('database.string'), databaseConfigurations, (err: any) => {
    if (err) {
      logger.error('connection.mongodb.failed')
    } else {
      logger.info('connection.mongodb.successful')
    }
  })
}

export { initializeMongoDB }
