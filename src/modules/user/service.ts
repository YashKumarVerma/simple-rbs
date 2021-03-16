import { UnAuthorizedException } from 'http-exception-transformer/exceptions'
import { logger } from '../../services/logger/winston'
import UserSchema from './model'
import { CreateUserInterface, UserInterface } from './interface'

class UserService {
  constructor() {
    logger.verbose('User Service loaded')
  }

  /** to list all users */
  static async findAll(): Promise<Array<UserInterface>> {
    const users = await UserSchema.find().select('-_id -__v')
    return users
  }

  /** to find details of given user by email */
  static async findOneByEmail(email: string): Promise<UserInterface | null> {
    const user = await UserSchema.findOne({ email })
    return user
  }

  /** to find a user by email and password for login */
  static async findOneByEmailAndPassword(email: string, password: string): Promise<UserInterface> {
    const user = await UserSchema.findOne({ email, password }).select('-id')
    if (user === null) {
      throw new UnAuthorizedException('Invalid Credentials')
    }
    return user
  }

  /** to create a new user */
  static async create(user: CreateUserInterface): Promise<UserInterface> {
    const newUser = await UserSchema.create(user)
    delete newUser.password
    return newUser
  }

  /** to delete a user by id */
  static async deleteUserByEmail(email: string): Promise<any> {
    const deleteResponse = await UserSchema.deleteOne({ email })
    return deleteResponse
  }
}

export { UserService }
