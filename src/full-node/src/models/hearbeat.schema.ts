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
}
