import { AuthContext } from "AuthContextProvider";
import { MessagesContextProvider } from "DataContext/MessagsContextProvider";
import {
  ThreadsContext,
  useActiveThreadKey,
} from "DataContext/ThreadsContextProvider";
import { useContext } from "react";
import Header from "./Components/Header/Header";
import MessageList from "./Components/MessageList/MessageList";
import NoThread from "./Components/NoThread/NoThread";
import SendBox from "./Components/SendBox/SendBox";
const Thread = () => {
  const { activeThread } = useContext(ThreadsContext);
  const threadKey = useActiveThreadKey();
  if (!activeThread || !threadKey) {
    return <NoThread />;
  }
  return (
    <div className="flex flex-col flex-1 w-full overflow-hidden bg-gray">
      <Header activeThread={activeThread} />
      <MessagesContextProvider>
        <MessageList activeThread={activeThread} threadKey={threadKey} />
      </MessagesContextProvider>
      <SendBox activeThread={activeThread} />
    </div>
  );
};

export default Thread;
