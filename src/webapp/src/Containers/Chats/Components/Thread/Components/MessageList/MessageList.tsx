import Key from "Utils/Key";
import Styles from "./styles.module.css";
import { IRecord } from "Utils/storage";
import { IThreadStorage } from "Structs/Thread";
import { useContext, useEffect } from "react";
import {
  MessagesContext,
  useThreadMessages,
} from "DataContext/MessagsContextProvider";
import MessageBox from "./Components/MessageBox/MessageBox";

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
  const threadMessages = useThreadMessages(activeThread.value.threadId);
  return (
    <div className={Styles.messageList}>
      {threadMessages.map((message, index) => (
        <MessageBox key={index} message={message} />
      ))}
    </div>
  );
};

export default MessageList;
