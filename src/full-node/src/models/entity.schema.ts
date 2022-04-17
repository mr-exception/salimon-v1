import { Prop, Schema } from '@nestjs/mongoose';
import { IEntity } from 'datamodels/common';
import mongoose from 'mongoose';

@Schema()
export class Entity implements IEntity {
  @Prop(mongoose.Schema.Types.ObjectId)
  _id: string;
  @Prop(Number)
  createdAt: number;
  @Prop(Number)
  updatedAt: number;
}
