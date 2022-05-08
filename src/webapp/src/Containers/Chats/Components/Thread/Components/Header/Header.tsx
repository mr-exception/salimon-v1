import { AuthContext } from "AuthContextProvider";
import { ContactsContext } from "DataContext/ContactsContextProvider";
import { ThreadsContext } from "DataContext/ThreadsContextProvider";
import React, { useContext } from "react";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import { IContact } from "Structs/Contact";
import { IThreadStorage } from "Structs/Thread";
import { IRecord } from "Utils/storage";
import { timestampToDateTime } from "Utils/string";

function onlineStatusString(contact: IContact): string {
  let activeAt = Number.MIN_VALUE;
  contact.hosts.forEach((host) => {
    if (activeAt < host.activeAt) {
      activeAt = host.activeAt;
    }
  });
  if (activeAt < 0) {
    return "offline";
  }
  const diff = Date.now() / 1000 - activeAt;
  if (Math.abs(diff) < 120) {
    return "online";
  }
  return `offline (last activity: ${timestampToDateTime(activeAt)})`;
}

interface IProps {
  activeThread: IRecord<IThreadStorage>;
}

const Header: React.FC<IProps> = ({ activeThread }) => {
  return (
    <div
      className="w-full border-b-2 border-solid border-gray-lighter"
      style={{ minHeight: 50 }}
    >
      <div className="col-xs-12">
        <div className="row">
          <div className="mt-1 text-2xl col-xs-8">
            {activeThread.value.name}
          </div>
          <div className="flex flex-row justify-end mt-1 col-xs-4">
            <FaTrash size={20} className="m-2 cursor-pointer text-warning" />
            <FaPencilAlt size={20} className="m-2 cursor-pointer" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
