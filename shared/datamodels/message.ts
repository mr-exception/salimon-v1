import { IEntity } from "./common";

export interface IPacketMeta {
  position: number;
  dataPath: string;
}

export interface IMessage extends IEntity {
  srcAddress: string;
  dstAddress: string;
  packetCount: number;
  data: IPacketMeta[];
}
