import { Document } from 'mongoose'

export interface UserInterface extends Document {
  email: string
  firstName: string
  lastName: string
  age: number
  password: string
}

export interface CreateUserInterface {
  firstName: string
  lastName: string
  age: number
  email: string
  password: string
}
