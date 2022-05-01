import { Args, Query, Resolver, Subscription } from '@nestjs/graphql';
import { IHeartBeat } from 'datamodels/heartbeat';
import { HeartBeat } from './models/hearbeat.schema';
import { pubsub, Update } from './publish-center';

@Resolver(() => HeartBeat)
export class GeneralResolver {
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
    filter: (payload, variables) => {
      switch (payload.update.type) {
        case 'threadCreated':
        case 'threadUpdated':
        case 'threadRemoved':
          return !!payload.update.thread.members.find(
            (item) => item.address === variables.address,
          );
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
    return pubsub.asyncIterator('update');
  }
}
