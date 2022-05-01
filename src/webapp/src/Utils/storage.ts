import Dexie, { IndexableType, Table } from "dexie";
import { IContact } from "Structs/Contact";
import { IHost } from "Structs/Host";
import { IThreadStorage } from "Structs/Thread";

export interface IRecord<T> {
  value: T;
  id: IndexableType;
}

export function initDB(): Dexie {
  const db = new Dexie("salimon");
  db.version(1).stores({
    hosts: "++id,url,name,serviceType,commissionFee,packetPrice,balance",
    contacts: "++id,name,address,publicKey,hosts",
    threads: "++id,universalId,creator,members,key,hosts",
  });
  return db;
}
// ------------------------------------------------------------------------------------------------------
// hosts
// ------------------------------------------------------------------------------------------------------
export function getHostsTable(): Table<IHost, IndexableType> {
  const db = initDB();
  return db.table<IHost>("hosts");
}

export async function getHostsFromDB(): Promise<IRecord<IHost>[]> {
  const table = getHostsTable();
  const keys = await table.toCollection().primaryKeys();
  return await Promise.all(
    keys.map(
      (key) =>
        new Promise<IRecord<IHost>>(async (resolve, reject) => {
          const record = await table.get(key);
          if (!record) return reject(`host with key ${key} not found`);
          resolve({ value: record, id: key });
        })
    )
  );
}

export async function updateHostsIfExists(
  records: IRecord<IHost>[]
): Promise<void> {
  const table = getHostsTable();
  Promise.all(
    records.map(
      (record) =>
        new Promise<void>(async (resolve, reject) => {
          const host = await table.get(record.id);
          if (!!host) {
            await table.update(record.id, record.value);
          }
          resolve();
        })
    )
  );
}

export async function insertHostInDB(value: IHost) {
  const table = getHostsTable();
  return table.add(value);
}

export async function deleteHostFromDB(id: IndexableType) {
  const table = getHostsTable();
  return table.delete(id);
}
// ------------------------------------------------------------------------------------------------------
// contacts
// ------------------------------------------------------------------------------------------------------
export function getContactsTable(): Table<IContact, IndexableType> {
  const db = initDB();
  return db.table<IContact>("contacts");
}

export async function getContactsFromDB(): Promise<
  { value: IContact; id: IndexableType }[]
> {
  const table = getContactsTable();
  const keys = await table.toCollection().primaryKeys();
  return await Promise.all(
    keys.map(
      (key) =>
        new Promise<{ value: IContact; id: IndexableType }>(
          async (resolve, reject) => {
            const record = await table.get(key);
            if (!record) return reject(`host with key ${key} not found`);
            resolve({ value: record, id: key });
          }
        )
    )
  );
}

export async function insertContactInDB(value: IContact) {
  const table = getContactsTable();
  return table.add(value);
}

export async function deleteContactFromDB(id: IndexableType) {
  const table = getContactsTable();
  return table.delete(id);
}

export async function updateContactInDB(id: IndexableType, contact: IContact) {
  const table = getContactsTable();
  return table.update(id, contact);
}
// ------------------------------------------------------------------------------------------------------
// threads
// ------------------------------------------------------------------------------------------------------
export function getThreadsTable(): Table<IThreadStorage, IndexableType> {
  const db = initDB();
  return db.table<IThreadStorage>("threads");
}

export async function getThreadsFromDB(): Promise<
  { value: IThreadStorage; id: IndexableType }[]
> {
  const table = getThreadsTable();
  const keys = await table.toCollection().primaryKeys();
  return await Promise.all(
    keys.map(
      (key) =>
        new Promise<{ value: IThreadStorage; id: IndexableType }>(
          async (resolve, reject) => {
            const record = await table.get(key);
            if (!record) return reject(`thread with key ${key} not found`);
            resolve({ value: record, id: key });
          }
        )
    )
  );
}

export async function insertThreadInDB(value: IThreadStorage) {
  const table = getThreadsTable();
  return table.add(value);
}

export async function deleteThreadFromDB(id: IndexableType) {
  const table = getThreadsTable();
  return table.delete(id);
}

export async function updateThreadInDB(
  id: IndexableType,
  contact: IThreadStorage
) {
  const table = getThreadsTable();
  return table.update(id, contact);
}
