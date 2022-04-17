import { AuthContext } from "AuthContextProvider";
import { IndexableType } from "dexie";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { IThread } from "Structs/Thread";
import {
  deleteThreadFromDB,
  getThreadsFromDB,
  insertThreadInDB,
  IRecord,
  updateThreadInDB,
} from "Utils/storage";
import { WorkersContext } from "WorkersContextProvider";
import { useAppendContact } from "./ContactsContextProvider";

export interface IThreadsContext {
  activeThread?: IRecord<IThread>;
  setActiveThread: (value: IRecord<IThread>) => void;
  threads: IRecord<IThread>[];
  addThread: (value: IThread) => void;
  removeThread: (id: IndexableType) => void;
  updateThread: (value: IRecord<IThread>) => void;
}

export const ThreadsContext = createContext<IThreadsContext>({
  setActiveThread: () => {},
  threads: [],
  addThread: (value: IThread) => {},
  removeThread: (id: IndexableType) => {},
  updateThread: (value: IRecord<IThread>) => {},
});

export const ThreadsContextProvider: React.FC<{ children: any }> = ({
  children,
}) => {
  const { threadsWorker } = useContext(WorkersContext);
  const { address, key } = useContext(AuthContext);
  const [activeThread, setActiveThread] = useState<IRecord<IThread>>();
  const [threads, setThreads] = useState<IRecord<IThread>[]>([]);
  const appendContact = useAppendContact();
  async function addThread(value: IThread): Promise<void> {
    const id = await insertThreadInDB(value);
    setThreads([...threads, { value, id }]);
    toast.success("channel created!");
    threadsWorker.postMessage({
      action: "update_threads",
      payload: [
        ...threads.map((record) => record.value.universal_id),
        value.universal_id,
      ],
    });
  }
  async function removeThread(id: IndexableType) {
    await deleteThreadFromDB(id);
    const result = await getThreadsFromDB();
    setThreads(result);
    threadsWorker.postMessage({
      action: "update_threads",
      payload: result.map((record) => record.value.universal_id),
    });
  }
  async function updateThread(value: IRecord<IThread>) {
    await updateThreadInDB(value.id, value.value);
    const result = await getThreadsFromDB();
    setThreads(result);
    setActiveThread(result.find((record) => record.id === value.id));
    threadsWorker.postMessage({
      action: "update_threads",
      payload: result.map((record) => record.value.universal_id),
    });
  }
  useEffect(() => {
    getThreadsFromDB().then((value) => {
      setThreads(value);
      threadsWorker.postMessage({
        action: "update_threads",
        payload: value.map((record) => record.value.universal_id),
      });
    });
  }, [threadsWorker]);

  threadsWorker.onmessage = async (
    ev: MessageEvent<{
      event: string;
      payload: {
        threads: IThread[];
        contacts: { address: string; public_key: string }[];
      };
    }>
  ) => {
    const { event, payload } = ev.data;
    if (event === "new_threads") {
      payload.threads.forEach(async (record) => {
        record.key = key.decryptPrivate(record.key).toString();
        await addThread(record);
      });
      payload.contacts
        .filter((member) => member.address !== address)
        .forEach(async (record) => {
          appendContact(record.address, record.public_key);
        });
    }
  };
  return (
    <ThreadsContext.Provider
      value={{
        threads,
        addThread,
        removeThread,
        activeThread,
        setActiveThread,
        updateThread,
      }}
    >
      {children}
    </ThreadsContext.Provider>
  );
};
