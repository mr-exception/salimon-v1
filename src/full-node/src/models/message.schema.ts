import { Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IMessage, IPacketMeta } from 'datamodels/message';
import { Entity } from './entity.schema';

export type MessageDocument = Message & Document;

@Schema()
export class PacketMeta implements IPacketMeta {
  @Prop(String)
  dataPath: string;
  @Prop(Number)
  position: number;
}

@Schema()
export class Message extends Entity implements IMessage {
  @Prop(String)
  dstAddress: string;
  @Prop(Number)
  packetCount: number;
  @Prop(String)
  srcAddress: string;
  @Prop([PacketMeta])
  data: IPacketMeta[];
}
