import { IMessage } from "datamodels/message";
import { IHost } from "./Host";

export interface IPacket {
  src: string;
  dst: string;
  data: string;
  messageId: string;
  pckCount: number;
  position: number;
}

export interface IFetchedMessage {
  traces: { data: IMessage; host: IHost }[];
  messageId: string;
}
