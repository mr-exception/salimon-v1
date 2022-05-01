import { IndexableType } from "dexie";

export interface IContact {
  address: string;
  name: string;
  publicKey: string;
  hosts: {
    hostId: IndexableType;
    activeAt: number;
  }[];
}
