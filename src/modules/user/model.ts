import mongoose, { Schema } from 'mongoose'
import { UserInterface } from './interface'

const UserSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },

  firstName: {
    type: String,
    required: true,
  },

  lastName: {
    type: String,
    required: true,
  },
})

// export the model and return your UserInterface
export default mongoose.model<UserInterface>('User', UserSchema)
