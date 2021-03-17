import { NextFunction, Request, Response } from 'express'
import config from 'config'
import { decode, verify } from 'jsonwebtoken'
import { BadRequestException } from 'http-exception-transformer/exceptions'
import { logger } from '../logger/winston'

export const cookieDecoder = () => {
  const middleware = async (req: Request, res: Response, next: NextFunction) => {
    const cookieName: string = config.get('login_token.cookie')
    const token: string = req.cookies[cookieName]
    if (token === undefined) {
      logger.info('cookie.set.false')
      return next()
    }
    logger.info('cookie.set.true')

    try {
      const isValidToken = await verify(token, config.get('login_token.secret'), {
        issuer: config.get('login_token.issuer'),
      })

      if (!isValidToken) {
        throw new BadRequestException('Invalid token')
      }

      const decodedData = await decode(token)
      logger.info(JSON.stringify(decodedData))
      req.body = {
        payload: req.body,
        cookie: decodedData,
      }
    } catch (e) {
      req.body = {
        payload: req.body,
      }
    }

    return next()
  }

  return middleware
}
