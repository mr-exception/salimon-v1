import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { InjectModel } from '@nestjs/mongoose';
import { IMessage } from 'datamodels/message';
import { Model, Query as MonoQuery } from 'mongoose';
import {
  Message,
  MessageDocument,
  messageResponse,
} from 'src/models/message.schema';
import { threadId } from 'worker_threads';

@Resolver()
export class MessagesResolver {
  constructor(
    @InjectModel(Message.name) private model: Model<MessageDocument>,
  ) {}

  @Query(() => [Message])
  async getMessages(
    @Args('id', { type: () => String, nullable: true }) id: string,
    @Args('messageId', { type: () => String, nullable: true })
    messageId: string,
    @Args('src', { type: () => String, nullable: true }) src: string,
    @Args('dst', { type: () => String, nullable: true }) dst: string,
    @Args('targetId', { type: () => String, nullable: true }) targetId: string,
    @Args('createdAtMax', { type: () => Int, nullable: true })
    createdAtMax: number,
    @Args('createdAtMin', { type: () => Int, nullable: true })
    createdAtMin: number,
    @Args('updatedAtMax', { type: () => Int, nullable: true })
    updatedAtMax: number,
    @Args('updatedAtMin', { type: () => Int, nullable: true })
    updatedAtMin: number,
    @Args('page', { type: () => Int, nullable: true, defaultValue: 1 })
    page: number,
    @Args('pageSize', { type: () => Int, nullable: true, defaultValue: 10 })
    pageSize: number,
  ): Promise<IMessage[]> {
    const queryInstance = generateQuery(
      id,
      messageId,
      src,
      dst,
      targetId,
      createdAtMax,
      createdAtMin,
      updatedAtMax,
      updatedAtMin,
    );

    const signatures = await this.model
      .find(queryInstance.getQuery())
      .limit(pageSize)
      .skip((page - 1) * pageSize);
    return signatures.map(messageResponse);
  }

  @Query(() => Number)
  async getMessagesCount(
    @Args('id', { type: () => String, nullable: true }) id: string,
    @Args('messageId', { type: () => String, nullable: true })
    messageId: string,
    @Args('src', { type: () => String, nullable: true }) src: string,
    @Args('dst', { type: () => String, nullable: true }) dst: string,
    @Args('targetId', { type: () => String, nullable: true }) targetId: string,
    @Args('createdAtMax', { type: () => Int, nullable: true })
    createdAtMax: number,
    @Args('createdAtMin', { type: () => Int, nullable: true })
    createdAtMin: number,
    @Args('updatedAtMax', { type: () => Int, nullable: true })
    updatedAtMax: number,
    @Args('updatedAtMin', { type: () => Int, nullable: true })
    updatedAtMin: number,
  ): Promise<number> {
    const queryInstance = generateQuery(
      id,
      messageId,
      src,
      dst,
      targetId,
      createdAtMax,
      createdAtMin,
      updatedAtMax,
      updatedAtMin,
    );
    const count = await this.model.find(queryInstance.getQuery()).count();
    return count;
  }
}

function generateQuery(
  id: string,
  messageId: string,
  src: string,
  dst: string,
  targetId: string,
  createdAtMax: number,
  createdAtMin: number,
  updatedAtMax: number,
  updatedAtMin: number,
) {
  let queryInstance = new MonoQuery();
  if (id) {
    queryInstance = queryInstance.where('_id').equals(id);
  }
  if (messageId) {
    queryInstance = queryInstance.where('messageId').equals(messageId);
  }
  if (src) {
    queryInstance = queryInstance.where('srcAddress').equals(src);
  }
  if (dst) {
    queryInstance = queryInstance.where('dstAddress').equals(dst);
  }
  if (targetId) {
    queryInstance = queryInstance.or([
      { srcAddress: targetId },
      { dstAddress: targetId },
    ]);
  }
  if (createdAtMax) {
    queryInstance = queryInstance.where('createdAt').lt(createdAtMax);
  }
  if (updatedAtMax) {
    queryInstance = queryInstance.where('updatedAt').lt(updatedAtMax);
  }
  if (createdAtMin) {
    queryInstance = queryInstance.where('createdAt').gt(createdAtMin);
  }
  if (updatedAtMin) {
    queryInstance = queryInstance.where('updatedAt').gt(updatedAtMin);
  }
  return queryInstance;
}
