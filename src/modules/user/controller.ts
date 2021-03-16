import { NotFoundException, BadRequestException } from 'http-exception-transformer/exceptions'
import { logger } from '../../services/logger/winston'
import { CreateUserInterface, UserInterface } from './interface'
import { UserService } from './service'

class UserController {
  constructor() {
    logger.verbose('User Controller Loaded')
  }

  /** returns list of all users in system */
  public static homepageHandler(): Promise<Array<UserInterface>> {
    return UserService.findAll()
  }

  /** to get details of particular user */
  public static async getUser(email: string): Promise<UserInterface> {
    const userDetails = await UserService.findOneByEmail(email)

    if (userDetails === null) {
      throw new NotFoundException('user not found')
    }

    return userDetails
  }

  /** to create a new user */
  public static async createUser(user: CreateUserInterface): Promise<UserInterface> {
    const userdata = await UserService.findOneByEmail(user.email)
    if (userdata !== null) {
      throw new BadRequestException('User already exist')
    }

    const newUser = await UserService.create(user)
    return newUser
  }

  /** to delete and old user */
  public static async deleteUser(id: string): Promise<any> {
    const deleteResponse = await UserService.deleteUserById(id)
    return deleteResponse
  }
}

export { UserController }
