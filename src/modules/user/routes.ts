import express, { Request, Response } from 'express'
import { UnAuthorizedException } from 'http-exception-transformer/exceptions'
import { check } from '../../services/roles/definitions'
import { resolveRole } from '../../services/roles/resolver'
import { SuccessToResponseMapper } from '../../services/util/response.transformer'
import { LoginTokenData } from '../auth/interface'
import { UserController } from './controller'
import { CreateUserInterface } from './interface'

const router = express.Router()

/**
 * declaring user rotues that are nested under the /users scope
 */
router.get('/', async (req: Request, res: Response) => {
  if (!check.can(resolveRole(req)).readAny('profile').granted) {
    throw new UnAuthorizedException('Not enough rights to list of all users')
  }
  const data = await UserController.getAllUsers()
  res.json(SuccessToResponseMapper(data))
})

/** to fetch details of any given user */
router.get('/:email', async (req: Request, res: Response) => {
  const { email } = req.params
  const cookieData: LoginTokenData = req.body.cookie

  if (
    check.can(resolveRole(req)).readAny('profile').granted ||
    (check.can(resolveRole(req)).readOwn('profile').granted && email === cookieData.email)
  ) {
    const data = await UserController.getUser(email)
    res.json(SuccessToResponseMapper(data))
  }

  throw new UnAuthorizedException('Not enough rights to list user details')
})

/** to create a new user */
router.post('/', async (req: Request, res: Response) => {
  if (!check.can(resolveRole(req)).createOwn('profile').granted) {
    throw new UnAuthorizedException('Not allowed to create a new profile')
  }

  const userDetails: CreateUserInterface = req.body.payload
  const data = await UserController.createUser(userDetails)
  res.json(SuccessToResponseMapper(data))
})

/** to delete an old user */
router.delete('/:email', async (req: Request, res: Response) => {
  const { email } = req.params
  const cookieData: LoginTokenData = req.body.cookie

  if (
    check.can(resolveRole(req)).deleteAny('profile').granted ||
    (check.can(resolveRole(req)).deleteOwn('profile').granted && cookieData.email === email)
  ) {
    const data = await UserController.deleteUser(email)
    res.json(SuccessToResponseMapper(data))
  }

  throw new UnAuthorizedException('Not enough rights to delete this user')
})

export default router
