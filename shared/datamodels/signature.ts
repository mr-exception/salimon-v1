import { IEntity } from "./common";

export interface ISignature extends IEntity {
  publicKey: string;
  secret: string;
  address: string;
}
