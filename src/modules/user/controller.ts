import { logger } from '../../services/logger/winston'
import { UserService } from './service'

class UserController {
  constructor() {
    logger.verbose('User Controller Loaded')
  }

  /** returns list of all users in system */
  public static homepageHandler() {
    return UserService.findAll()
  }
}

export { UserController }
