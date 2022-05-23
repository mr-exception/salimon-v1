import { ApolloClient, InMemoryCache } from "@apollo/client";
import { AuthContext } from "AuthContextProvider";
import { IndexableType } from "dexie";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "react-toastify";
import { IContact } from "Structs/Contact";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { IHost } from "Structs/Host";
import {
  deleteHostFromDB,
  getHostsFromDB,
  insertHostInDB,
  IRecord,
  updateHostsIfExists,
} from "Utils/storage";

export interface IHostsContext {
  hosts: IRecord<IHost>[];
  addHost: (value: IHost) => void;
  removeHost: (id: IndexableType) => void;
  updateHost: (value: IRecord<IHost>) => void;
}

export const HostsContext = createContext<IHostsContext>({
  hosts: [],
  addHost: (value: IHost) => {},
  removeHost: (id: IndexableType) => {},
  updateHost: (value: IRecord<IHost>) => {},
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

  async function updateHost(value: IRecord<IHost>): Promise<void> {
    await updateHostsIfExists([value]);
    const result = await getHostsFromDB();
    setHosts(result);
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
    <HostsContext.Provider value={{ hosts, addHost, removeHost, updateHost }}>
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
