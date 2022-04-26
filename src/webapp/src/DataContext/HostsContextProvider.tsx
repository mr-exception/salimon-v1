import { ApolloClient, InMemoryCache, ObservableQuery } from "@apollo/client";
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
import { IHost } from "Structs/Host";
import {
  deleteHostFromDB,
  getHostsFromDB,
  insertHostInDB,
  updateHostsIfExists,
  IRecord,
} from "Utils/storage";
import { GET_HEARTBEAT, IGetHeartbeat } from "./queries";

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
  const { address } = useContext(AuthContext);
  const [hosts, setHosts] = useState<IRecord<IHost>[]>([]);
  const [heartBeatQueries, setHeartBeatQueries] = useState<{
    [key: string]: ObservableQuery;
  }>({});

  // add the heartbeat watch query to the list
  const subsribeToHostMetrics = useCallback(
    (host: IHost, id: IndexableType) => {
      const client = new ApolloClient({
        uri: host.url + "/graphql",
        cache: new InMemoryCache(),
      });
      if (!!heartBeatQueries[id.toString()]) {
        return;
      }
      const query = client.watchQuery<IGetHeartbeat>({
        query: GET_HEARTBEAT,
        variables: { address },
        pollInterval: 60 * 1000,
      });
      setHeartBeatQueries({
        ...heartBeatQueries,
        ...{ [id.toString()]: query },
      });
      query.subscribe((response) => {
        setHosts(
          hosts.map((record) => {
            if (record.id === id) {
              record.value = { ...record.value, ...response.data.heartBeat };
              updateHostsIfExists([record]);
            }
            return record;
          })
        );
      });
    },
    [heartBeatQueries, address, hosts]
  );

  async function addHost(value: IHost): Promise<void> {
    const id = await insertHostInDB(value);
    setHosts([...hosts, { value, id }]);
    subsribeToHostMetrics(value, id);
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

  useEffect(() => {
    hosts.forEach((host) => subsribeToHostMetrics(host.value, host.id));
  }, [hosts, subsribeToHostMetrics]);

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
