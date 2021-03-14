import { logger } from '../../services/logger/winston'
import UserSchema from './model'
import { CreateUserInterface, UserInterface } from './interface'

class UserService {
  constructor() {
    logger.verbose('User Service loaded')
  }

  /** to list all users */
  static async findAll(): Promise<Array<UserInterface>> {
    const users = await UserSchema.find()
    return users
  }

  /** to find details of given user by email */
  static async findOneByEmail(email: string): Promise<UserInterface | null> {
    const user = await UserSchema.findOne({ email })
    return user
  }

  /** to create a new user */
  static async create(user: CreateUserInterface): Promise<UserInterface> {
    const newUser = await UserSchema.create(user)
    return newUser
  }

  /** to delete a user by id */
  static async deleteUserById(userID: string): Promise<any> {
    const deleteResponse = await UserSchema.deleteOne({ _id: userID })
    return deleteResponse
  }
}

export { UserService }
