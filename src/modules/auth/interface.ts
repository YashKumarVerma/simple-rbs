export interface LogInCredentials {
  email: string
  password: string
}
export interface LoginTokenData {
  id: string
  email: string
  role: string
}

export interface LogInResponse {
  token: string
}
