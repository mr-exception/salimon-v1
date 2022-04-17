import { IPacket } from "./Packet";

export type MessageType = "text" | "file" | "image" | "audio" | "shared_key";

export interface IMessageData {
  data: string;
  type: MessageType;
}
export interface IMessage {
  type: MessageType;
  data: string;
  src: string;
  dst: string;
  id: string;
  date: number;
}

export interface IPacketGroup {
  packets: IPacket[];
  src: string;
  dst: string;
  count: number;
  id: string;
  date: number;
}
