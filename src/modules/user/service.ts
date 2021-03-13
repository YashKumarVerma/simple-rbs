import { logger } from '../../services/logger/winston'
import UserSchema from './model'
import { UserInterface } from './interface'

class UserService {
  constructor() {
    logger.verbose('User Service loaded')
  }

  /** to list all users */
  static async findAll(): Promise<Array<UserInterface>> {
    const users = await UserSchema.find()
    return users
  }
}

export { UserService }
