import express, { Request, Response } from 'express'
import { ErrorToResponseMapper } from '../../services/util/exception.transformer'
import { UserController } from './controller'

const router = express.Router()

/**
 * declaring user rotues that are nested under the /users scope
 */
router.get('/', (req: Request, res: Response) => {
  try {
    const response = UserController.homepageHandler()
    res.json(response)
  } catch (e) {
    res.json(ErrorToResponseMapper(e))
  }
})

export default router
