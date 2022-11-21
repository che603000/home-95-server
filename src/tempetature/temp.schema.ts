import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ITemp } from './temp.interface';

export type TempDocument = Temp & Document;

@Schema()
export class Temp implements ITemp {
  @Prop()
  id: string;

  @Prop()
  createDate: Date;

  @Prop()
  title: string;

  @Prop()
  device: string;

  @Prop()
  value: number;
}

export const TempSchema = SchemaFactory.createForClass(Temp);

TempSchema.set('toJSON', {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});
