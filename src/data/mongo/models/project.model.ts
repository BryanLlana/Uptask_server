import mongoose, { Schema, PopulatedDoc, Types, Document } from "mongoose"
import { ITask } from "./task.model"
import { IUser } from "./user.model"

export interface IProject extends Document {
  name: string,
  customer: string,
  description: string,
  tasks: PopulatedDoc<ITask & Document>[],
  manager: PopulatedDoc<IUser & Document>
}

const ProjectSchema: Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  customer: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  tasks: [
    {
      type: Types.ObjectId,
      ref: 'task'
    }
  ],
  manager: {
    type: Types.ObjectId,
    required: true,
    ref: 'user'
  }
}, {
  timestamps: true
})

const Project = mongoose.model<IProject>('project', ProjectSchema)
export default Project