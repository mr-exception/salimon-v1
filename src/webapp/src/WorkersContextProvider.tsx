import { createContext } from "react";

export interface IWorkersContext {
  hostsWorker: Worker;
  threadsWorker: Worker;
}

export const WorkersContext = createContext<IWorkersContext>({
  hostsWorker: new Worker("/workers/hosts.js"),
  threadsWorker: new Worker("/workers/threads.js"),
});

export const WorkersContextProvider: React.FC<{
  children: any;
  hostsWorker: Worker;
  threadsWorker: Worker;
}> = ({ children, hostsWorker, threadsWorker }) => {
  return (
    <WorkersContext.Provider
      value={{
        hostsWorker,
        threadsWorker,
      }}
    >
      {children}
    </WorkersContext.Provider>
  );
};
