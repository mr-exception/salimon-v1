import { IndexableType } from "dexie";

export interface IContact {
  address: string;
  name: string;
  public_key: string;
  hosts: {
    hostId: IndexableType;
    active_at: number;
  }[];
}
