import { Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IThread } from 'datamodels/thread';
import { Entity } from './entity.schema';
import { Field, ObjectType } from '@nestjs/graphql';

export type ThreadDocument = Thread & Document;

@Schema()
@ObjectType()
export class Thread extends Entity implements IThread {
  @Prop([String])
  @Field()
  members: string[];
  @Prop(String)
  @Field()
  name: string;
  @Prop(String)
  @Field()
  ownerAddress: string;
}
