import { AccessControl } from 'accesscontrol'
import { logger } from '../logger/winston'

const controller = new AccessControl()

/** roles of user in system */
controller
  .grant('user')
  .readOwn('profile')
  .updateOwn('profile')
  .deleteOwn('profile')
  .createOwn('vehicle')
  .readAny('vehicle')
  .updateOwn('vehicle')
  .deleteOwn('vehicle')

/** roles of moderator in system */
controller
  .grant('moderator')
  .extend('user')
  .readAny('profile')
  .updateAny('profile')
  .readAny('vehicle')
  .updateAny('vehicle')

/** roles of admin in system */
controller
  .grant('admin')
  .extend('moderator')
  .deleteAny('profile')
  .deleteAny('vehicle')
  .createAny('user')
  .createAny('moderator')

const roleStatusCheck = () => {
  logger.info(`All roles: ${controller.getRoles()}`)
  logger.info(`All resources: ${controller.getResources()}`)
}

export { controller as role, roleStatusCheck }
