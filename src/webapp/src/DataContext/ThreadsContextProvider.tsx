import { IndexableType } from "dexie";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  deleteThreadFromDB,
  getThreadsFromDB,
  insertThreadInDB,
  IRecord,
  updateThreadInDB,
} from "Utils/storage";
import { IThreadStorage } from "Structs/Thread";

export interface IThreadsContext {
  activeThread?: IRecord<IThreadStorage>;
  setActiveThread: (value: IRecord<IThreadStorage>) => void;
  threads: IRecord<IThreadStorage>[];
  addThread: (value: IThreadStorage) => void;
  removeThread: (id: IndexableType) => void;
  updateThread: (value: IRecord<IThreadStorage>) => void;
}

export const ThreadsContext = createContext<IThreadsContext>({
  setActiveThread: () => {},
  threads: [],
  addThread: (value: IThreadStorage) => {},
  removeThread: (id: IndexableType) => {},
  updateThread: (value: IRecord<IThreadStorage>) => {},
});

export const ThreadsContextProvider: React.FC<{ children: any }> = ({
  children,
}) => {
  const [activeThread, setActiveThread] = useState<IRecord<IThreadStorage>>();
  const [threads, setThreads] = useState<IRecord<IThreadStorage>[]>([]);
  async function addThread(value: IThreadStorage): Promise<void> {
    const id = await insertThreadInDB(value);
    setThreads([...threads, { value, id }]);
    toast.success("channel created!");
  }
  async function removeThread(id: IndexableType) {
    await deleteThreadFromDB(id);
    const result = await getThreadsFromDB();
    setThreads(result);
  }
  async function updateThread(value: IRecord<IThreadStorage>) {
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
