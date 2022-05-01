import { Field, ObjectType } from '@nestjs/graphql';
import { IUpdate } from 'datamodels/common';
import { IThread } from 'datamodels/thread';
import { PubSub } from 'graphql-subscriptions';
import { Thread } from './models/thread.schema';

export const pubsub = new PubSub();

@ObjectType()
export class Update implements IUpdate {
  @Field()
  type: 'threadCreated' | 'newMessage' | 'threadUpdated' | 'threadRemoved';
  @Field(() => Thread, { nullable: true })
  thread?: IThread;
}
