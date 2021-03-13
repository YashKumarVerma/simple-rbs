import express from 'express'
import bodyParser from 'body-parser'
import { initializeMongoDB } from './services/database/mongoose'
import { initializeRedis } from './services/database/redis'

import userRoutes from './modules/user/routes'

/** initialize database connections */
initializeMongoDB()
initializeRedis()

/**
 * Initialize express application to hook all middlewares
 */
const app = express()

app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
)
app.use(bodyParser.json())
app.get('', (req, res) => {
  res.json({ alive: true })
})

app.use('/users', userRoutes)

export default app
