import { IndexableType } from "dexie";
import Key from "Utils/Key";

export interface IChannel {
  creator: string;
  member: string;
  universal_id: string;
  key: string;
}

export function generateKey(cipher: string, localKey: Key): Key {
  const private_key = localKey.decryptPrivate(cipher).toString();
  return Key.generateKeyByPrivateKey(private_key);
}

export interface IThread {
  creator: string;
  members: string[];
  universal_id: string;
  key: string;
  hosts: IndexableType[];
}
