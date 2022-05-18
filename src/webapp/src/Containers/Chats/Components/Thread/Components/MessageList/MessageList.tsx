// import { HostsContext } from "DataContext/HostsContextProvider";
// import { useCallback, useContext, useEffect, useState } from "react";
import Key from "Utils/Key";
import Styles from "./styles.module.css";
// import MessageBox from "./Components/MessageBox/MessageBox";
import { IRecord } from "Utils/storage";
import { IThreadStorage } from "Structs/Thread";
// import { ApolloClient, InMemoryCache } from "@apollo/client";
// import { GET_MESSAGES, IGetMessages } from "./queries";
import { IMessage } from "datamodels/message";
import { IHost } from "Structs/Host";
import { useContext, useEffect } from "react";
import { MessagesContext } from "DataContext/MessagsContextProvider";
// import { IndexableType } from "dexie";

interface IMessageTrace {
  data: IMessage[];
  hosts: IHost[];
  messageId: string;
}

interface IProps {
  activeThread: IRecord<IThreadStorage>;
  threadKey: Key;
}

let requestOnLoad = false;
const MessageList: React.FC<IProps> = ({ activeThread, threadKey }) => {
  const { requestThreadMessages } = useContext(MessagesContext);
  useEffect(() => {
    if (requestOnLoad) return;
    requestOnLoad = true;
    requestThreadMessages(activeThread.value, 1, 10);
    setTimeout(() => {
      requestOnLoad = false;
    }, 100);
  }, []);
  // const { hosts } = useContext(HostsContext);
  // const relatedHosts = hosts.filter((host) =>
  //   activeThread.value.hosts.includes(host.id)
  // );
  // const [messages, setMessages] = useState<IMessageTrace[]>([]);

  // const fetchMessageFromHost = useCallback(
  //   async (hostRecord: IRecord<IHost>) => {
  //     const { value: host, id } = hostRecord;
  //     let hostMessages: IMessageTrace[] = [];
  //     const queryClient = new ApolloClient({
  //       uri: host.url + "/graphql",
  //       cache: new InMemoryCache(),
  //     });
  //     const result = await queryClient.query<IGetMessages>({
  //       query: GET_MESSAGES,
  //       variables: { targetId: activeThread.value.threadId },
  //     });

  //     result.data.getMessages.forEach((message) => {
  //       const exists = messageExsits(hostMessages, message.messageId);
  //       if (!exists) {
  //         hostMessages = [...hostMessages, newTrace(message, host)];
  //       } else {
  //         const newMessagesState: IMessageTrace[] = hostMessages.map(
  //           (record) => {
  //             if (record.messageId === message.messageId) {
  //               record = addNewTraceToMessage(message, host, record);
  //             }
  //             return record;
  //           }
  //         );
  //         hostMessages = [...newMessagesState];
  //       }
  //     });
  //     return hostMessages;
  //   },
  //   []
  // );
  // useEffect(() => {
  //   if (activeThreadId === activeThread.id) {
  //     return;
  //   }
  //   activeThreadId = activeThread.id;
  //   let fetchedMessages: IMessageTrace[] = [];
  //   const promises = relatedHosts.map(async (hostRecord) => {
  //     return new Promise<IMessageTrace[]>(async (resolve) => {
  //       const hostMessages = await fetchMessageFromHost(hostRecord);
  //       fetchedMessages = [...fetchedMessages, ...hostMessages];
  //       resolve(hostMessages);
  //     });
  //   });
  //   Promise.allSettled(promises).then((result) => {
  //     for (let i = 0; i < result.length; i++) {
  //       const { status, value: response } = result[i] as {
  //         status: "fulfilled" | "rejected";
  //         value: IMessageTrace[];
  //       };
  //       if (status !== "fulfilled") continue;
  //       response.forEach((record) => {
  //         let found = false;
  //         for(let i)
  //       });
  //     }
  //   });
  // }, [activeThread.id, fetchMessageFromHost, relatedHosts]);

  return (
    <div className={Styles.messageList}>
      {/* {messages.map((message, index) => (
        <MessageBox key={index} message={message.data} hosts={message.hosts} />
      ))} */}
    </div>
  );
};

export default MessageList;

function addNewTraceToMessage(
  message: IMessage,
  host: IHost,
  trace: IMessageTrace
): IMessageTrace {
  trace.data = [...trace.data, message];
  trace.hosts = [...trace.hosts, host];
  return trace;
}

function newTrace(message: IMessage, host: IHost): IMessageTrace {
  return { data: [message], hosts: [host], messageId: message.messageId };
}

function messageExsits(trace: IMessageTrace[], messageId: string): boolean {
  return trace.find((trace) => trace.messageId === messageId) !== undefined;
}

function updateTraceList(
  traces: IMessageTrace[],
  message: IMessage,
  host: IHost
): IMessageTrace[] {
  const exists = messageExsits(traces, message.messageId);
  if (!exists) {
    traces = [...traces, newTrace(message, host)];
    return traces;
  } else {
    return traces.map((record) => {
      if (record.messageId === message.messageId) {
        record = addNewTraceToMessage(message, host, record);
      }
      return record;
    });
  }
}
