import { Args, Query, Resolver, Subscription } from '@nestjs/graphql';
import { InjectModel } from '@nestjs/mongoose';
import { IHeartBeat } from 'datamodels/heartbeat';
import { HeartBeat } from './models/hearbeat.schema';
import { Thread, ThreadDocument } from './models/thread.schema';
import { pubsub, Update } from './publish-center';
import { Model } from 'mongoose';

@Resolver(() => HeartBeat)
export class GeneralResolver {
  constructor(
    @InjectModel(Thread.name) public threadModel: Model<ThreadDocument>,
  ) {}
  @Query(() => HeartBeat)
  async heartBeat(
    @Args('address', { type: () => String, nullable: false }) address: string,
  ): Promise<IHeartBeat> {
    console.log(address);
    return {
      name: 'full node (edited name)',
      serviceType: 'full-node',
      time: Math.floor(Date.now() / 1000),
      packetPrice: 0,
      commissionFee: 1000,
      balance: 0,
    };
  }
  @Subscription(() => Update, {
    async filter(this: GeneralResolver, payload, variables) {
      switch (payload.subToUpdates.type) {
        case 'threadCreated':
          return (
            !!payload.subToUpdates.thread.members.find(
              (item) => item.address === variables.address,
            ) && payload.subToUpdates.thread.ownerAddress !== variables.address
          );
        case 'threadUpdated':
        case 'threadRemoved':
          return !!payload.subToUpdates.thread.members.find(
            (item) => item.address === variables.address,
          );
        case 'newMessage':
          const thread = await this.threadModel.findOne({
            threadId: payload.subToUpdates.message.dstAddress,
          });
          if (!thread) {
            return false;
          } else {
            const relatedAddresses = thread.members.map(
              (member) => member.address,
            );
            return relatedAddresses.includes(variables.address);
          }
        default:
          return false;
      }
    },
  })
  async subToUpdates(
    @Args('address', { type: () => String, nullable: false })
    address: string,
  ) {
    console.log(address, 'subscribed to updates');
    return pubsub.asyncIterator('subToUpdates');
  }
}
