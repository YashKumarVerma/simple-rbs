import express, { Request, Response } from 'express'
import config from 'config'
import { SuccessToResponseMapper } from '../../services/util/response.transformer'
import { AuthController } from './controller'
import { LogInCredentials } from './interface'

const router = express.Router()

/** declaring user rotues that are nested under the /users scope */
router.post('/login', async (req: Request, res: Response) => {
  const credentials: LogInCredentials = req.body.payload
  const data = await AuthController.login(credentials)
  res.cookie(config.get('login_token.cookie'), data.token)
  res.json(SuccessToResponseMapper(data))
})

/** to fetch details of any given user */
router.get('/logout', async (req: Request, res: Response) => {
  const data = await AuthController.logout()
  res.clearCookie(config.get('login_token.cookie'))
  res.json(SuccessToResponseMapper(data))
})

export default router
