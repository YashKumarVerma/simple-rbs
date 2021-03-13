import { RouteResponse } from '../interface/route'

export const SuccessToResponseMapper = (payload: any): RouteResponse => ({
  code: 200,
  error: false,
  message: 'OK',
  payload,
})
