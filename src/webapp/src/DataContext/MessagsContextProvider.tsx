import { createContext, useContext, useEffect, useState } from "react";
import { IHost } from "Structs/Host";
import { IMessage } from "datamodels/message";
import { HostsContext } from "./HostsContextProvider";
import { IThreadStorage } from "Structs/Thread";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { GET_MESSAGES, IGetMessages } from "./queries";
import { getMessage } from "API/Packets";
import { createAxios } from "API/axios-inital";
import { AuthContext } from "AuthContextProvider";

export interface IMessageTrace {
  data: IMessage[];
  hosts: IHost[];
  messageId: string;
  threadId: string;
}

export interface IFetchedMessage {
  messageId: string;
  srcAddress: string;
  dstAddress: string;
  packets: string[];
  packetsOrder: number[];
  packetCount: number;
}

export interface IFinalizedMessage {
  messageId: string;
  srcAddress: string;
  dstAddress: string;
  packets: string[];
}

export interface IMessagesContext {
  messageTraces: IMessageTrace[];
  messages: IFetchedMessage[];
  requestThreadMessages: (
    thread: IThreadStorage,
    page: number,
    pageSize: number
  ) => Promise<void>;
}

export const MessagesContext = createContext<IMessagesContext>({
  messageTraces: [],
  messages: [],
  requestThreadMessages: async (
    thread: IThreadStorage,
    page: number,
    pageSize: number
  ) => {
    console.log(
      `requested ${thread.threadId} on page ${page} with pageSize ${pageSize}`
    );
  },
});

export const MessagesContextProvider: React.FC<{ children: any }> = ({
  children,
}) => {
  const { hosts } = useContext(HostsContext);
  const { address } = useContext(AuthContext);
  const [messageTraces, setMessageTraces] = useState<IMessageTrace[]>([]);
  const [fetchedMessages, setFetchedMessages] = useState<IFetchedMessage[]>([]);

  async function requestThreadMessages(
    thread: IThreadStorage,
    page: number,
    pageSize: number
  ) {
    const relatedHosts = hosts
      .filter((host) => thread.hosts.includes(host.id))
      .map((item) => item.value);
    relatedHosts.forEach((host) => {
      const promise = new Promise<IFetchedMessage[]>(async (resolve) => {
        resolve(await fetchMessageFromHost(host, thread.threadId, address));
      });
      promise.then((response) => {
        setFetchedMessages((state) => updateFetchedMessages(state, response));
      });
    });
  }
  console.log(fetchedMessages);

  return (
    <MessagesContext.Provider
      value={{
        messageTraces,
        messages: fetchedMessages,
        requestThreadMessages,
      }}
    >
      {children}
    </MessagesContext.Provider>
  );
};

async function fetchMessageFromHost(
  host: IHost,
  threadId: string,
  clientAddress: string
): Promise<IFetchedMessage[]> {
  let hostMessages: IFetchedMessage[] = [];
  const queryClient = new ApolloClient({
    uri: host.url + "/graphql",
    cache: new InMemoryCache(),
  });
  const result = await queryClient.query<IGetMessages>({
    query: GET_MESSAGES,
    variables: { targetId: threadId },
  });

  for (let i = 0; i < result.data.getMessages.length; i++) {
    const messageData = result.data.getMessages[i];
    const packetData = await getMessage(
      messageData.dataPath,
      createAxios(host.url, clientAddress, host.secret)
    );
    hostMessages.push({
      srcAddress: messageData.srcAddress,
      dstAddress: messageData.dstAddress,
      messageId: messageData.messageId,
      packetCount: messageData.packetCount,
      packetsOrder: messageData.packetsOrder,
      packets: packetData.split("\n").filter((line) => !!line),
    });
  }
  return hostMessages;
}

function updateFetchedMessages(
  storageList: IFetchedMessage[],
  fetchedList: IFetchedMessage[]
): IFetchedMessage[] {
  for (let i = 0; i < fetchedList.length; i++) {
    const fetchedMessage = fetchedList[i];
    let found = false;
    for (let j = 0; j < storageList.length; j++) {
      if (storageList[j].messageId === fetchedMessage.messageId) {
        storageList[j].packets = [
          ...storageList[j].packets,
          ...fetchedMessage.packets,
        ];
        storageList[j].packetsOrder = [
          ...storageList[j].packetsOrder,
          ...fetchedMessage.packetsOrder,
        ];
        found = true;
        break;
      }
    }
    if (!found) {
      storageList = [...storageList, fetchedMessage];
    }
  }
  return storageList;
}

export function useThreadMessages(threadId: string): IFetchedMessage[] {
  const { messages } = useContext(MessagesContext);
  return messages.filter(
    (message) =>
      message.srcAddress === threadId || message.dstAddress === threadId
  );
}
