import mongoose, { Schema } from 'mongoose'
import { ROLE } from '../../services/roles/types'
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

  age: {
    type: Number,
    required: true,
  },

  password: {
    type: String,
    required: true,
    select: false,
  },

  role: {
    type: String,
    default: ROLE.USER,
    enum: [ROLE.ADMIN, ROLE.MOD, ROLE.USER],
  },
})

// export the model and return your UserInterface
export default mongoose.model<UserInterface>('User', UserSchema)
