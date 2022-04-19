import { IndexableType } from "dexie";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { IThread } from "Structs/Thread";
import {
  deleteThreadFromDB,
  getThreadsFromDB,
  insertThreadInDB,
  IRecord,
  updateThreadInDB,
} from "Utils/storage";

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
  const [activeThread, setActiveThread] = useState<IRecord<IThread>>();
  const [threads, setThreads] = useState<IRecord<IThread>[]>([]);
  async function addThread(value: IThread): Promise<void> {
    const id = await insertThreadInDB(value);
    setThreads([...threads, { value, id }]);
    toast.success("channel created!");
  }
  async function removeThread(id: IndexableType) {
    await deleteThreadFromDB(id);
    const result = await getThreadsFromDB();
    setThreads(result);
  }
  async function updateThread(value: IRecord<IThread>) {
    await updateThreadInDB(value.id, value.value);
    const result = await getThreadsFromDB();
    setThreads(result);
    setActiveThread(result.find((record) => record.id === value.id));
  }
  useEffect(() => {
    getThreadsFromDB().then((value) => {
      setThreads(value);
    });
  }, []);

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
