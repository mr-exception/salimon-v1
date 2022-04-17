import React from "react";
import Thread from "./Components/Thread/Thread";
import Threads from "./Components/Threads/Threads";
const Chats = () => {
  return (
    <div className="col-xs-12 h-full">
      <div className="row h-full">
        <div className="col-xs-3">
          <Threads />
        </div>
        <div className="col-xs-9 bg-secondary h-full flex flex-col justify-center items-center p-0 border-l-2 border-solid border-gray-lighter">
          <Thread />
        </div>
      </div>
    </div>
  );
};

export default Chats;
