import { IEntity } from "./common";

export interface IThread extends IEntity {
  threadId: string;
  name: string;
  ownerAddress: string;
  // members public address
  members: {
    address: string;
    privateKey: string;
  }[];
}
