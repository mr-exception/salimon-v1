import { Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IMessage, IPacketMeta } from 'datamodels/message';
import { Entity } from './entity.schema';
import { Field, ObjectType } from '@nestjs/graphql';

export type MessageDocument = Message & Document;

@ObjectType()
@Schema()
export class PacketMeta implements IPacketMeta {
  @Prop(String)
  @Field()
  dataPath: string;
  @Prop(Number)
  @Field()
  position: number;
}

@ObjectType()
@Schema()
export class Message extends Entity implements IMessage {
  @Prop(String)
  @Field()
  dstAddress: string;
  @Prop(Number)
  @Field()
  packetCount: number;
  @Prop(String)
  @Field()
  srcAddress: string;
  @Prop([PacketMeta])
  @Field()
  data: IPacketMeta[];
}
