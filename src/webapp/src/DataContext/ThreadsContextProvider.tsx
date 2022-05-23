import { IndexableType } from "dexie";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  deleteThreadFromDB,
  getThreadsFromDB,
  insertThreadInDB,
  IRecord,
  updateThreadInDB,
} from "Utils/storage";
import { getThreadKey, IThreadStorage } from "Structs/Thread";
import Key from "Utils/Key";
import { AuthContext } from "AuthContextProvider";

export interface IThreadsContext {
  activeThread?: IRecord<IThreadStorage>;
  setActiveThread: (value: IRecord<IThreadStorage>) => void;
  threads: IRecord<IThreadStorage>[];
  addThread: (value: IThreadStorage) => void;
  removeThread: (id: IndexableType) => void;
  updateThread: (value: IRecord<IThreadStorage>) => void;
  addOrUpdateThread: (value: IThreadStorage) => void;
}

export const ThreadsContext = createContext<IThreadsContext>({
  setActiveThread: () => {},
  threads: [],
  addThread: (value: IThreadStorage) => {},
  removeThread: (id: IndexableType) => {},
  updateThread: (value: IRecord<IThreadStorage>) => {},
  addOrUpdateThread: (value: IThreadStorage) => {},
});

export const ThreadsContextProvider: React.FC<{ children: any }> = ({
  children,
}) => {
  const [loading, setLoading] = useState(false);
  const [activeThread, setActiveThread] = useState<IRecord<IThreadStorage>>();
  const [threads, setThreads] = useState<IRecord<IThreadStorage>[]>([]);
  async function addThread(value: IThreadStorage): Promise<void> {
    const id = await insertThreadInDB(value);
    setThreads([...threads, { value, id }]);
    toast.success("thread created!");
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

  async function addOrUpdateThread(value: IThreadStorage) {
    const foundThread = threads.find(
      (item) => item.value.threadId === value.threadId
    );
    if (foundThread) {
      await updateThread(foundThread);
    } else {
      await addThread(value);
    }
  }
  useEffect(() => {
    setLoading(true);
    getThreadsFromDB().then((value) => {
      setThreads(value);
      setLoading(false);
    });
  }, []);

  if (loading) return null;
  return (
    <ThreadsContext.Provider
      value={{
        threads,
        addThread,
        removeThread,
        activeThread,
        setActiveThread,
        updateThread,
        addOrUpdateThread,
      }}
    >
      {children}
    </ThreadsContext.Provider>
  );
};

export function useActiveThreadKey(): Key | undefined {
  const { address, key } = useContext(AuthContext);
  const { activeThread } = useContext(ThreadsContext);
  if (!activeThread) {
    return undefined;
  }
  return getThreadKey(activeThread.value, address, key);
}
