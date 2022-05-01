import { IThread } from "datamodels/thread";
import { IndexableType } from "dexie";

export interface IThreadStorage extends IThread {
  hosts: IndexableType[];
}
