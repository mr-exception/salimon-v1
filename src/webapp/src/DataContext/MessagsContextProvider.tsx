import { createContext, useContext, useEffect, useState } from "react";
import { IHost } from "Structs/Host";
import { IMessage, IMessageData } from "datamodels/message";
import { HostsContext } from "./HostsContextProvider";
import { getThreadKey, IThreadStorage } from "Structs/Thread";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { GET_MESSAGES, IGetMessages } from "./queries";
import { getMessage } from "API/Packets";
import { createAxios } from "API/axios-inital";
import { AuthContext } from "AuthContextProvider";
import Key from "Utils/Key";
import { ThreadsContext } from "./ThreadsContextProvider";

export interface IPlainMessage {
  data: IMessageData;
  srcAddress: string;
  dstAddress: string;
  threadId: string;
  createdAt: number;
}
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
  data?: IMessageData;
  packetsOrder: number[];
  packetCount: number;
  createdAt: number;
}
interface IFetchedCompleteMessage extends IFetchedMessage {
  data: IMessageData;
}

export interface IFinalizedMessage {
  messageId: string;
  srcAddress: string;
  dstAddress: string;
  packets: string[];
}

export interface IMessagesContext {
  messages: IFetchedMessage[];
  newMessage: (value: IMessage, host: IHost) => void;
  requestThreadMessages: (
    thread: IThreadStorage,
    page: number,
    pageSize: number
  ) => Promise<void>;
}

export const MessagesContext = createContext<IMessagesContext>({
  messages: [],
  newMessage: () => {},
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
  const { address, key } = useContext(AuthContext);
  const { threads } = useContext(ThreadsContext);
  const [fetchedMessages, setFetchedMessages] = useState<IFetchedMessage[]>([]);

  async function requestThreadMessages(
    thread: IThreadStorage,
    page: number,
    pageSize: number
  ) {
    const threadKey = getThreadKey(thread, address, key);
    if (!threadKey) {
      console.error("thread key not found");
      return;
    }
    const relatedHosts = hosts
      .filter((host) => thread.hosts.includes(host.id))
      .map((item) => item.value);
    relatedHosts.forEach((host) => {
      const promise = new Promise<IFetchedMessage[]>(async (resolve) => {
        resolve(await fetchMessageFromHost(host, thread.threadId, address));
      });
      promise.then((response) => {
        setFetchedMessages((state) =>
          updateFetchedMessages(state, response, threadKey)
        );
      });
    });
  }

  async function newMessage(value: IMessage, host: IHost) {
    const foundThread = threads.find(
      (record) => record.value.threadId === value.dstAddress
    );
    if (foundThread) {
      const threadKey = getThreadKey(foundThread.value, address, key);
      if (!threadKey) {
        console.error("thread key not found");
        return;
      }
      const packetData = await getMessage(
        value.dataPath,
        createAxios(host.url, address, host.secret)
      );
      const fetchedMessage = {
        srcAddress: value.srcAddress,
        dstAddress: value.dstAddress,
        messageId: value.messageId,
        packetCount: value.packetCount,
        packetsOrder: value.packetsOrder,
        packets: packetData.split("\n").filter((line) => !!line),
        createdAt: value.createdAt,
      };
      console.log(fetchedMessage);
      setFetchedMessages((state) =>
        updateFetchedMessages(state, [fetchedMessage], threadKey)
      );
    }
  }

  return (
    <MessagesContext.Provider
      value={{
        messages: fetchedMessages,
        requestThreadMessages,
        newMessage,
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
      createdAt: messageData.createdAt,
    });
  }
  return hostMessages;
}

function updateFetchedMessages(
  storageList: IFetchedMessage[],
  fetchedList: IFetchedMessage[],
  threadKey: Key
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
        storageList[j] = checkMessageComplete(storageList[j], threadKey);
        found = true;
        break;
      }
    }
    if (!found) {
      storageList = [
        ...storageList,
        checkMessageComplete(fetchedMessage, threadKey),
      ];
    }
  }
  return storageList;
}

function checkMessageComplete(
  message: IFetchedMessage,
  key: Key
): IFetchedMessage {
  if (message.packets.length === message.packetCount) {
    const cipherArray = [];
    for (let i = 0; i < message.packets.length; i++) {
      cipherArray.push(message.packets[message.packetsOrder[i]]);
    }
    const cipher = cipherArray.join("");
    const plain = key.decryptPrivate(cipher).toString();

    message.data = JSON.parse(plain) as IMessageData;
  }
  return message;
}

export function useThreadMessages(threadId: string): IPlainMessage[] {
  const { messages } = useContext(MessagesContext);
  const threadMessages = messages.filter(
    (message) =>
      message.srcAddress === threadId || message.dstAddress === threadId
  );
  const completedMessages = threadMessages.filter(
    (record) => !!record.data
  ) as IFetchedCompleteMessage[];
  return completedMessages.map((record) => {
    return {
      srcAddress: record.srcAddress,
      dstAddress: record.dstAddress,
      threadId: record.dstAddress,
      data: record.data,
      createdAt: record.createdAt,
    };
  });
}
