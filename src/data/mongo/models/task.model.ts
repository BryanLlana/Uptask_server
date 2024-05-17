import mongoose, { Schema, Types, Document } from "mongoose";

const taskStatus = {
  PENDING: 'pending',
  ON_HOLD: 'onHold',
  IN_PROGRESS: 'inProgress',
  UNDER__REVIEW: 'underReview',
  COMPLETED: 'completed'
} as const

export interface ITask extends Document {
  name: string,
  description: string,
  status: string,
  project: Types.ObjectId | string
}

export type TaskStatus = typeof taskStatus[keyof typeof taskStatus]

const TaskSchema: Schema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  description: {
    type: String,
    trim: true,
    required: true
  },
  status: {
    type: String,
    enum: Object.values(taskStatus),
    default: taskStatus.PENDING
  },
  project: {
    type: Types.ObjectId,
    ref: 'project'
  }
}, {
  timestamps: true
})

const Task = mongoose.model<ITask>('task', TaskSchema)
export default Task