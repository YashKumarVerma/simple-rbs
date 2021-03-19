import { AccessControl } from 'accesscontrol'
import { logger } from '../logger/winston'
import { ROLE } from './types'

const controller = new AccessControl()

controller.grant(ROLE.VISITOR).createOwn('profile')

/** roles of user in system */
controller
  .grant(ROLE.USER)
  .extend(ROLE.VISITOR)
  .readOwn('profile')
  .deleteOwn('profile')

/** roles of moderator in system */
controller
  .grant(ROLE.MOD)
  .extend(ROLE.USER)
  .readAny('profile')

/** roles of admin in system */
controller
  .grant(ROLE.ADMIN)
  .extend(ROLE.MOD)
  .deleteAny('profile')
  .createAny('backup')

const roleStatusCheck = () => {
  logger.info(`All roles: ${controller.getRoles()}`)
  logger.info(`All resources: ${controller.getResources()}`)
}

export { controller as check, roleStatusCheck }
