import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { InjectModel } from '@nestjs/mongoose';
import { IMessage } from 'datamodels/message';
import { Model, Query as MonoQuery } from 'mongoose';
import {
  Message,
  MessageDocument,
  messageResponse,
} from 'src/models/message.schema';

@Resolver()
export class MessagesResolver {
  constructor(
    @InjectModel(Message.name) private model: Model<MessageDocument>,
  ) {}

  @Query(() => [Message])
  async getMessages(
    @Args('id', { type: () => String, nullable: true }) id: string,
    @Args('ownerAddress', { type: () => String, nullable: true })
    ownerAddress: string,
    @Args('member', { type: () => String, nullable: true }) member: string,
    @Args('page', { type: () => Int, nullable: true, defaultValue: 1 })
    page: number,
    @Args('pageSize', { type: () => Int, nullable: true, defaultValue: 10 })
    pageSize: number,
  ): Promise<IMessage[]> {
    const queryInstance = generateQuery(member, ownerAddress, id);

    const signatures = await this.model
      .find(queryInstance.getQuery())
      .limit(pageSize)
      .skip((page - 1) * pageSize);
    return signatures.map(messageResponse);
  }

  @Query(() => Number)
  async getMessagesCount(
    @Args('id', { type: () => String, nullable: true }) id: string,
    @Args('ownerAddress', { type: () => String, nullable: true })
    ownerAddress: string,
    @Args('member', { type: () => String, nullable: true }) member: string,
  ): Promise<number> {
    const queryInstance = generateQuery(member, ownerAddress, id);
    const count = await this.model.find(queryInstance.getQuery()).count();
    return count;
  }
}

function generateQuery(member: string, ownerAddress: string, id: string) {
  let queryInstance = new MonoQuery();
  if (member) {
    queryInstance = queryInstance.where('members').equals(member);
  }
  if (ownerAddress) {
    queryInstance = queryInstance.where('ownerAddress').equals(ownerAddress);
  }
  if (id) {
    queryInstance = queryInstance.where('_id').equals(id);
  }
  return queryInstance;
}
