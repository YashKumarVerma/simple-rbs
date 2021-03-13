import { RouteResponse } from '../interface/route'

class HttpException extends Error {
  message: string

  code: number

  constructor(code: number, message: string) {
    super(message)
    this.message = message
    this.code = code
    Object.setPrototypeOf(this, HttpException.prototype)
  }

  transformResponse(): RouteResponse {
    return {
      code: this.code,
      error: true,
      message: this.message,
      payload: undefined,
    }
  }
}

export { HttpException }
