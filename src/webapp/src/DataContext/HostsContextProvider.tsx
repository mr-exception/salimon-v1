import { IndexableType } from "dexie";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { IContact } from "Structs/Contact";
import { IHost } from "Structs/Host";
import {
  deleteHostFromDB,
  getHostsFromDB,
  insertHostInDB,
  IRecord,
} from "Utils/storage";

export interface IHostsContext {
  hosts: IRecord<IHost>[];
  addHost: (value: IHost) => void;
  removeHost: (id: IndexableType) => void;
}

export const HostsContext = createContext<IHostsContext>({
  hosts: [],
  addHost: (value: IHost) => {},
  removeHost: (id: IndexableType) => {},
});

export const HostsContextProvider: React.FC<{ children: any }> = ({
  children,
}) => {
  const [hosts, setHosts] = useState<IRecord<IHost>[]>([]);
  async function addHost(value: IHost): Promise<void> {
    const id = await insertHostInDB(value);
    setHosts([...hosts, { value, id }]);
    toast.success("registered to host successfully!");
  }
  async function removeHost(id: IndexableType) {
    await deleteHostFromDB(id);
    const values = await getHostsFromDB();
    setHosts(values);
  }
  useEffect(() => {
    getHostsFromDB().then((value) => {
      setHosts(value);
    });
  }, []);

  return (
    <HostsContext.Provider value={{ hosts, addHost, removeHost }}>
      {children}
    </HostsContext.Provider>
  );
};

// custom hooks
export function useRelatedHosts(contact?: IContact): IHost[] {
  const { hosts } = useContext(HostsContext);
  if (!contact) return [];
  const activeHostIds = contact.hosts.map((record) => record.hostId);
  const relatedHosts = hosts.filter((record) =>
    activeHostIds.includes(record.id)
  );
  return relatedHosts.map((record) => record.value);
}
