import { Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IThread } from 'datamodels/thread';
import { Entity } from './entity.schema';

export type ThreadDocument = Thread & Document;

@Schema()
export class Thread extends Entity implements IThread {
  @Prop([String])
  members: string[];
  @Prop(String)
  name: string;
  @Prop(String)
  ownerAddress: string;
}
