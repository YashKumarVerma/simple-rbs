import { logger } from '../../services/logger/winston'

class UserController {
  constructor() {
    logger.verbose('User Controller Loaded')
  }

  /** returns list of all users in system */
  public static homepageHandler() {}
}

export { UserController }
