import { HttpException } from '../errors/http.exception'
import { RouteResponse } from '../interface/route'

/**
 * Method to transform internal HttpErrors thrown into valid express responses
 */
export const ErrorToResponseMapper = (problem: HttpException): RouteResponse => {
  if (problem instanceof HttpException) {
    return problem.transformResponse()
  }

  /** defualt case for exception transformer */
  return {
    code: 500,
    error: true,
    message: 'uncatched exception',
    payload: undefined,
  }
}
