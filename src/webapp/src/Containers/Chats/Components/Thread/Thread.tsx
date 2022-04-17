import { ThreadsContext } from "DataContext/ThreadsContextProvider";
import { useContext } from "react";
import Header from "./Components/Header/Header";
import MessageList from "./Components/MessageList/MessageList";
import NoThread from "./Components/NoThread/NoThread";
import SendBox from "./Components/SendBox/SendBox";
const Thread = () => {
  const { activeThread } = useContext(ThreadsContext);
  if (!activeThread) {
    return <NoThread />;
  }
  return (
    <div className="flex flex-col flex-1 w-full overflow-hidden bg-gray">
      <Header activeThread={activeThread} />
      <MessageList />
      <SendBox activeThread={activeThread} />
    </div>
  );
};

export default Thread;
