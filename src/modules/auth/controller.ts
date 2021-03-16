import config from 'config'
import { sign } from 'jsonwebtoken'
import { UserService } from '../user/service'
import { LogInCredentials, LogInResponse, LoginTokenData } from './interface'

class AuthController {
  /** to log user into system */
  public static async login(credentials: LogInCredentials): Promise<LogInResponse> {
    const { password, email } = credentials

    /** check if user with said credentials exist */
    const userDetails = await UserService.findOneByEmailAndPassword(email, password)

    /** create token and return to user */
    const payload: LoginTokenData = {
      email: userDetails.email,
      id: userDetails._id,
      role: userDetails.role,
    }

    const token = await sign(payload, config.get('login_token.secret'), {
      expiresIn: config.get('login_token.expires'),
      issuer: config.get('login_token.issuer'),
    })

    return { token }
  }

  /** to log out a user */
  public static async logout(): Promise<any> {
    return {}
  }
}

export { AuthController }
