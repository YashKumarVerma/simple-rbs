import express from 'express'
import bodyParser from 'body-parser'
import { HttpExceptionTransformer } from 'http-exception-transformer'
import { initializeMongoDB } from './services/database/mongoose'
import { initializeRedis } from './services/database/redis'
import { roleStatusCheck } from './services/roles/definitions'
import userRoutes from './modules/user/routes'

/** initialize database connections */
initializeMongoDB()
initializeRedis()
roleStatusCheck()

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
app.use(HttpExceptionTransformer)
export default app
