import { IEntity } from "./common";

export interface IThread extends IEntity {
  name: string;
  ownerAddress: string;
  // members public address
  members: string[];
}
