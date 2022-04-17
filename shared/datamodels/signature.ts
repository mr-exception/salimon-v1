import { IEntity } from "./common";

export interface ISignature extends IEntity {
  publicKey: string;
  secret: string;
  balance: number;
  address: string;
}
