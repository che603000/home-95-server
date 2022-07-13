import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ITask } from './task.interface';

export type TaskDocument = Task & Document;

@Schema()
export class Task implements ITask {
  @Prop()
  id: string;

  @Prop()
  disable: boolean;

  @Prop([String])
  startTime: string[];

  @Prop()
  waitTime: number;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
