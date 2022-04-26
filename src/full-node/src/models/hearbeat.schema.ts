import { Field, ObjectType } from '@nestjs/graphql';
import { IHeartBeat } from 'datamodels/heartbeat';

@ObjectType()
export class HeartBeat implements IHeartBeat {
  @Field({ description: 'service name' })
  name: string;
  @Field({ description: 'service type' })
  serviceType: string;
  @Field({ description: 'service current time' })
  time: number;
  @Field({ description: 'commission fee on each contract (unit: 1kp' })
  commissionFee: number;
  @Field({ description: 'each 1kp price on this node' })
  packetPrice: number;
  @Field({ description: 'balance of requested user' })
  balance: number;
}
