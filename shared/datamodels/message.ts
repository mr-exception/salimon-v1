import { IEntity } from "./common";

export interface IPacketMeta {
  position: number;
  dataPath: string;
}

export interface IMessage extends IEntity {
  messageId: string;
  srcAddress: string;
  dstAddress: string;
  packetCount: number;
  data: IPacketMeta[];
}
