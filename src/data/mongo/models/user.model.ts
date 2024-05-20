import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
  email: string,
  password: string,
  name: string,
  active: boolean
}

const UserSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    default: false
  }
})

const User = mongoose.model<IUser>('user', UserSchema)
export default User