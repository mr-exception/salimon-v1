import { IEntity } from "./common";

export interface ISignature extends IEntity {
  name: string;
  publicKey: string;
  secret: string;
  balance: number;
  address: string;
  activeAt: number;
}
