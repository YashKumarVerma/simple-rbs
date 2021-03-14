import express, { Request, Response } from 'express'
import { ErrorToResponseMapper } from '../../services/util/exception.transformer'
import { SuccessToResponseMapper } from '../../services/util/response.transformer'
import { UserController } from './controller'
import { CreateUserInterface } from './interface'

const router = express.Router()

/**
 * declaring user rotues that are nested under the /users scope
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const data = await UserController.homepageHandler()
    res.json(SuccessToResponseMapper(data))
  } catch (e) {
    res.json(ErrorToResponseMapper(e))
  }
})

/** to fetch details of any given user */
router.get('/:email', async (req: Request, res: Response) => {
  try {
    const { email } = req.params
    const data = await UserController.getUser(email)
    res.json(SuccessToResponseMapper(data))
  } catch (e) {
    res.json(ErrorToResponseMapper(e))
  }
})

/** to create a new user */
router.post('/', async ({ body }, res: Response) => {
  try {
    const userDetails: CreateUserInterface = body
    const data = await UserController.createUser(userDetails)
    res.json(SuccessToResponseMapper(data))
  } catch (e) {
    res.json(ErrorToResponseMapper(e))
  }
})

/** to delete an old user */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const data = await UserController.deleteUser(id)
    res.json(SuccessToResponseMapper(data))
  } catch (e) {
    res.json(ErrorToResponseMapper(e))
  }
})

export default router
