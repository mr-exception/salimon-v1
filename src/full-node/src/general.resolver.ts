import { Args, Query, Resolver } from '@nestjs/graphql';
import { IHeartBeat } from 'datamodels/heartbeat';
import { HeartBeat } from './models/hearbeat.schema';

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
}
