import { IMessage } from "./message";
import { IThread } from "./thread";

export interface IEntity {
  _id: string;
  createdAt: number;
  updatedAt: number;
}

export interface IUpdate {
  type: "threadCreated" | "newMessage" | "threadUpdated" | "threadRemoved";
  thread?: IThread;
  message?: IMessage;
}
