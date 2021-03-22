import { invalidateCache } from '../../services/cache/invalidate'

/**
 * Method to invalidate cache for said user.
 *
 * The method should contain all entires that depend on User Entity and are being cached
 *
 * @param email email of user
 * @param password password of user
 * @returns void Does not return anything cause nothing is to be returned to user.
 */
export const invalidateUser = (email: string, password: string | undefined) => {
  invalidateCache(`userservice.findonebyemail::${email}`)
  invalidateCache(`userservice.findall::`)
  invalidateCache(`userservice.findonebyemailandpassword::${email}${password}`)
}
