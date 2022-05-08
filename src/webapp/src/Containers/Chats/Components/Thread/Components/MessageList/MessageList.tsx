import { fetchPackets } from "API/Packets";
import { AuthContext } from "AuthContextProvider";
import { HostsContext } from "DataContext/HostsContextProvider";
import { ThreadsContext } from "DataContext/ThreadsContextProvider";
import { useContext, useEffect, useState } from "react";
import { packetsToMessages } from "Utils/message";
import Key from "Utils/Key";
import Styles from "./styles.module.css";
import { IMessage } from "Structs/Message";
import MessageBox from "./Components/MessageBox/MessageBox";
import { createAxios } from "API/axios-inital";
const MessageList = () => {
  const { activeThread } = useContext(ThreadsContext);
  const { address, key } = useContext(AuthContext);
  const { hosts } = useContext(HostsContext);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [threadKey, setThreadKey] = useState<Key>();
  useEffect(() => {
    if (!activeThread) return;
    const privateKeyString = key
      .decryptPrivate(
        activeThread.value.members.find((item) => item.address === address)
          ?.privateKey || ""
      )
      .toString();
    const generatedThreadKey = Key.generateKeyByPrivateKey(privateKeyString);
    setThreadKey(generatedThreadKey);
    fetchPackets(
      { thread: activeThread.value.threadId },
      createAxios(hosts[0].value.url, address, hosts[0].value.secret)
    ).then(async (packets) => {
      const result = packetsToMessages(packets, key);
      setMessages(result.map((record) => record));
    });
  }, [activeThread, address, hosts, key]);
  return (
    <div className={Styles.messageList}>
      {messages.map((message, index) => (
        <MessageBox key={index} message={message} />
      ))}
    </div>
  );
};

export default MessageList;
