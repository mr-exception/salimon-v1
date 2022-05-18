import { IEntity } from "./common";
export interface IMessage extends IEntity {
  messageId: string;
  srcAddress: string;
  dstAddress: string;
  dataPath: string;
  packetCount: number;
  packetsOrder: number[];
}

export type MessageType = "Text";

export interface IMessageData {
  data: string;
  type: MessageType;
}

export function createMessageShortName(messageId: string, dstAddress: string): string {
  return `${dstAddress}-${messageId}`;
}
