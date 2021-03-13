import { Document } from 'mongoose'

export interface UserInterface extends Document {
  email: string
  firstName: string
  lastName: string
}
