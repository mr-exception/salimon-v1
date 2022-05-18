import { IThread } from "datamodels/thread";
import { IndexableType } from "dexie";
import Key from "Utils/Key";

export interface IThreadStorage extends IThread {
  hosts: IndexableType[];
}

export function getThreadKey(
  thread: IThread,
  address: string,
  clientKey: Key
): Key | undefined {
  const membership = thread.members.find((item) => item.address === address);
  if (!membership) {
    return undefined;
  }
  const privateKeyString = clientKey
    .decryptPrivate(membership.privateKey)
    .toString();
  const threadKey = Key.generateKeyByPrivateKey(privateKeyString);
  return threadKey;
}
