import mongoose, { Schema, Document, Types } from "mongoose";

export interface IToken extends Document {
  token: string,
  user: Types.ObjectId,
  createdAt: Date
}

const TokenSchema: Schema = new Schema({
  token: {
    type: String,
    required: true
  },
  user: {
    type: Types.ObjectId,
    ref: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expiresAt: '10m'
  }
})

const Token = mongoose.model<IToken>('token', TokenSchema)
export default Token