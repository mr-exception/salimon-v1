import { Query, Resolver, Subscription } from '@nestjs/graphql';
import { IHeartBeat } from 'datamodels/heartbeat';
import { HeartBeat } from './models/hearbeat.schema';
import { pubsub } from './public-center';

@Resolver(() => HeartBeat)
export class GeneralResolver {
  @Query(() => HeartBeat)
  async heartBeat(): Promise<IHeartBeat> {
    return {
      name: 'full node',
      serviceType: 'full-node',
      time: Math.floor(Date.now() / 1000),
    };
  }
  @Subscription(() => Number)
  timeChanged() {
    return pubsub.asyncIterator('timeChanged');
  }
}
