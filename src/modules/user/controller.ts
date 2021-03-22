import { NotFoundException, BadRequestException } from 'http-exception-transformer/exceptions'
import { CreateUserInterface, UserInterface } from './interface'
import { UserService } from './service'

class UserController {
  /** returns list of all users in system */
  public static getAllUsers(): Promise<Array<UserInterface>> {
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
    const userData = await UserService.findOneByEmail(user.email)
    if (userData !== null) {
      throw new BadRequestException('User already exist')
    }

    const newUser = await UserService.create(user)
    return newUser
  }

  /** to delete and old user */
  public static async deleteUser(email: string): Promise<any> {
    const deleteResponse = await UserService.deleteUserByEmail(email)
    return deleteResponse
  }
}

export { UserController }
