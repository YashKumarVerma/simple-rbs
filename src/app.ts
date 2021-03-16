import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import { HttpExceptionTransformer } from 'http-exception-transformer'
import { initializeMongoDB } from './services/database/mongoose'
import { initializeRedis } from './services/database/redis'
import { roleStatusCheck } from './services/roles/definitions'

/** link all modules onto application */
import UserRoutes from './modules/user/routes'
import AuthRoutes from './modules/auth/routes'

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
app.use(cookieParser())
app.get('', (req, res) => {
  res.json({ alive: true })
})

app.use('/user', UserRoutes)
app.use('/auth', AuthRoutes)

app.use(HttpExceptionTransformer)
export default app
