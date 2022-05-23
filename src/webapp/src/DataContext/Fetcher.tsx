import { ApolloClient, InMemoryCache } from "@apollo/client";
import { AuthContext } from "AuthContextProvider";
import { IndexableType } from "dexie";
import { useCallback, useContext, useEffect } from "react";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { IHost } from "Structs/Host";
import {
  GET_UPDATES,
  IGetUpdates,
  ISubToUpdates,
  SUB_TO_UPDATES,
} from "./queries";
import { ThreadsContext } from "./ThreadsContextProvider";
import { IThreadStorage } from "Structs/Thread";
import { HostsContext } from "./HostsContextProvider";
import { MessagesContext } from "./MessagsContextProvider";

// I had to do it! this state glitch was fucking with me
// btw: this component is used as a provider in project, so it won't cause any side effect
let fetchingHosts: IndexableType[] = [];

export const Fetcher: React.FC<{ children: any }> = ({ children }) => {
  const { address } = useContext(AuthContext);
  const { addThread, threads, addOrUpdateThread } = useContext(ThreadsContext);
  const { hosts, updateHost } = useContext(HostsContext);
  const { newMessage } = useContext(MessagesContext);

  // add the heartbeat watch query to the list
  const subscribeToHost = useCallback(
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
        updateHost({ value: { ...result.data.heartBeat, ...host }, id });

        for (let i = 0; i < result.data.getThreads.length; i++) {
          const fetchedThread = result.data.getThreads[i];
          await addOrUpdateThread({ ...fetchedThread, hosts: [id] });
        }

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
            variables: {
              address,
            },
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
                        (thread) =>
                          thread.value.threadId === threadStorage.threadId
                      )
                    ) {
                      addThread(threadStorage);
                    }
                  }
                  break;
                case "threadUpdated":
                case "threadRemoved":
                case "newMessage":
                  if (update.message) {
                    newMessage(update.message, host);
                  }
                  break;
                default:
                  console.log(update);
              }
            }
          });
      } catch (error) {
        console.error(error);
      }
    },
    [address, threads, hosts]
  );

  useEffect(() => {
    for (let i = 0; i < hosts.length; i++) {
      if (!fetchingHosts.includes(hosts[i].id)) {
        subscribeToHost(hosts[i].value, hosts[i].id);
        fetchingHosts.push(hosts[i].id);
      }
    }
  }, [subscribeToHost, hosts]);

  return <>{children}</>;
};
