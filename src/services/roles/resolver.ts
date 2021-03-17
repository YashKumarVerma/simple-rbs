import { Request } from 'express'
import { ROLE } from './types'

export const resolveRole = (req: Request): string => {
  if (req.body.cookie === false) {
    return ROLE.VISITOR
  }

  if (req.body.cookie.role !== undefined) {
    return ROLE.VISITOR
  }

  return req.body.cookie.role
}
