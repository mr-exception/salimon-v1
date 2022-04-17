import { AuthContext } from "AuthContextProvider";
import { ContactsContext } from "DataContext/ContactsContextProvider";
import React, { useContext } from "react";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import { IContact } from "Structs/Contact";
import { IThread } from "Structs/Thread";
import { IRecord } from "Utils/storage";
import { timestampToDateTime } from "Utils/string";

function onlineStatusString(contact: IContact): string {
  let active_at = Number.MIN_VALUE;
  contact.hosts.forEach((host) => {
    if (active_at < host.active_at) {
      active_at = host.active_at;
    }
  });
  if (active_at < 0) {
    return "offline";
  }
  const diff = Date.now() / 1000 - active_at;
  if (Math.abs(diff) < 120) {
    return "online";
  }
  return `offline (last activity: ${timestampToDateTime(active_at)})`;
}

interface IProps {
  activeThread: IRecord<IThread>;
}

const Header: React.FC<IProps> = ({ activeThread }) => {
  const { address } = useContext(AuthContext);
  const { contacts } = useContext(ContactsContext);

  const activeContacts = activeThread.value.members
    .filter((record) => record !== address)
    .map((record) => contacts.find((cnt) => cnt.value.address === record))
    .filter((record) => !!record) as IRecord<IContact>[];

  if (activeContacts.length === 0) return null;
  return (
    <div
      className="w-full border-b-2 border-gray-lighter border-solid"
      style={{ minHeight: 50 }}
    >
      <div className="col-xs-12">
        <div className="row">
          <div className="col-xs-8 mt-1 text-2xl">
            {activeContacts[0].value.name + " "}
            <span className="text-sm">
              {onlineStatusString(activeContacts[0].value)}
            </span>
          </div>
          <div className="col-xs-4 mt-1 flex flex-row justify-end">
            <FaTrash size={20} className="m-2 text-warning cursor-pointer" />
            <FaPencilAlt size={20} className="m-2 cursor-pointer" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
