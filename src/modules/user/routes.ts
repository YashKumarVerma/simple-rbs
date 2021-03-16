import express, { Request, Response } from 'express'
import { BadRequestException } from 'http-exception-transformer/exceptions'
import { SuccessToResponseMapper } from '../../services/util/response.transformer'
import { UserController } from './controller'
import { CreateUserInterface } from './interface'

const router = express.Router()

/**
 * declaring user rotues that are nested under the /users scope
 */
router.get('/', async (req: Request, res: Response) => {
  const data = await UserController.getAllUsers()
  res.json(SuccessToResponseMapper(data))
})

/** to fetch details of any given user */
router.get('/:email', async (req: Request, res: Response) => {
  const { email } = req.params
  const data = await UserController.getUser(email)
  res.json(SuccessToResponseMapper(data))
})

/** to create a new user */
router.post('/', async ({ body }, res: Response) => {
  const userDetails: CreateUserInterface = body
  const data = await UserController.createUser(userDetails)
  res.json(SuccessToResponseMapper(data))
})

/** to delete an old user */
router.delete('/:email', async (req: Request, res: Response) => {
  const { email } = req.params
  const data = await UserController.deleteUser(email)
  res.json(SuccessToResponseMapper(data))
})

export default router
