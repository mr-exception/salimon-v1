import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IThread } from 'datamodels/thread';
import { Entity } from './entity.schema';
import { Field, ObjectType } from '@nestjs/graphql';

export type ThreadDocument = Thread & Document;

interface IMember {
  address: string;
  privateKey: string;
}

@Schema()
@ObjectType()
class Member implements IMember {
  @Prop(String)
  @Field()
  address: string;
  @Prop(String)
  @Field()
  privateKey: string;
}

@Schema()
@ObjectType()
export class Thread extends Entity implements IThread {
  @Prop([Member])
  @Field(() => [Member])
  members: IMember[];
  @Prop(String)
  @Field()
  name: string;
  @Prop(String)
  @Field()
  threadId: string;
  @Prop(String)
  @Field()
  ownerAddress: string;
}

export const ThreadSchema = SchemaFactory.createForClass(Thread);

export function threadResponse(thread: Thread): IThread {
  return {
    _id: thread._id,
    threadId: thread.threadId,
    name: thread.name,
    members: thread.members,
    ownerAddress: thread.ownerAddress,
    createdAt: thread.createdAt,
    updatedAt: thread.updatedAt,
  };
}
