import { Prop, Schema } from '@nestjs/mongoose';
import { Field, ObjectType } from '@nestjs/graphql';
import { IEntity } from 'datamodels/common';
import mongoose from 'mongoose';

@ObjectType()
@Schema()
export abstract class Entity implements IEntity {
  @Prop(mongoose.Schema.Types.ObjectId)
  @Field()
  _id: string;
  @Prop(Number)
  @Field()
  createdAt: number;
  @Prop(Number)
  @Field()
  updatedAt: number;
}

export function createEntity(data) {
  return {
    _id: new mongoose.Types.ObjectId(),
    ...data,
    createdAt: Math.floor(Date.now() / 1000),
    updatedAt: Math.floor(Date.now() / 1000),
  };
}
