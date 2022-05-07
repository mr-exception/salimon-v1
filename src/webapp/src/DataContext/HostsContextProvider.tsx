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
  updateHostsIfExists,
  IRecord,
} from "Utils/storage";
import {
  GET_UPDATES,
  IGetUpdates,
  ISubToUpdates,
  SUB_TO_UPDATES,
} from "./queries";
import { ThreadsContext } from "./ThreadsContextProvider";
import { IThreadStorage } from "Structs/Thread";

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

// I had to do it! this state glitch was fucking with me
// btw: this component is used as a provider in project, so it won't cause any side effect
let fetchingHosts: IndexableType[] = [];

export const HostsContextProvider: React.FC<{ children: any }> = ({
  children,
}) => {
  const { address } = useContext(AuthContext);
  const { addThread, threads } = useContext(ThreadsContext);
  const [hosts, setHosts] = useState<IRecord<IHost>[]>([]);

  // add the heartbeat watch query to the list
  const subsribeToHost = useCallback(
    async (host: IHost, id: IndexableType) => {
      if (fetchingHosts.includes(id)) return;
      fetchingHosts = [id, ...fetchingHosts];
      const queryClient = new ApolloClient({
        uri: host.url + "/graphql",
        cache: new InMemoryCache(),
      });
      try {
        const result = await queryClient.query<IGetUpdates>({
          query: GET_UPDATES,
          variables: { address, pageSize: 100, page: 1 },
        });
        setHosts((records) =>
          records.map((record) => {
            if (record.id === id) {
              record.value = { ...record.value, ...result.data.heartBeat };
              updateHostsIfExists([record]);
            }
            return record;
          })
        );

        const subscribeClient = new ApolloClient({
          link: new GraphQLWsLink(
            createClient({
              url: host.url.replace(/http|https/, "ws") + "/graphql",
            })
          ),
          cache: new InMemoryCache(),
        });
        subscribeClient
          .subscribe<ISubToUpdates>({
            query: SUB_TO_UPDATES,
            variables: { address },
          })
          .subscribe((response) => {
            const data = response.data;
            if (data) {
              const { subToUpdates: update } = data;
              switch (update.type) {
                case "threadCreated":
                  if (!!update.thread) {
                    const threadStorage: IThreadStorage = {
                      ...update.thread,
                      hosts: [id],
                    };
                    if (
                      !threads.find(
                        (thread) => thread.value._id === threadStorage._id
                      )
                    ) {
                      addThread(threadStorage);
                    }
                  }
                  break;
                case "threadUpdated":
                case "threadRemoved":
                case "newMessage":
                default:
                  console.log(update);
              }
            }
          });
      } catch (error) {
        console.error(error);
      }
    },
    [address]
  );

  async function addHost(value: IHost): Promise<void> {
    const id = await insertHostInDB(value);
    setHosts([...hosts, { value, id }]);
    subsribeToHost(value, id);
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
      value.forEach((host) => subsribeToHost(host.value, host.id));
    });
  }, [subsribeToHost]);

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
