import { Query, Resolver, Subscription } from '@nestjs/graphql';
import { HeartBeat } from './models/hearbeat.schema';
import { pubsub } from './public-center';

@Resolver(() => HeartBeat)
export class GeneralResolver {
  @Query(() => HeartBeat)
  async heartBeat() {
    return {
      name: 'full node',
      time: Math.floor(Date.now() / 1000),
    };
  }
  @Subscription(() => Number)
  timeChanged() {
    return pubsub.asyncIterator('timeChanged');
  }
}
