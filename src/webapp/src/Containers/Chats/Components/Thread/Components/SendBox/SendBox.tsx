import { FC, useContext, useState } from "react";
import TextInput from "Ui-Kit/Inputs/TextInput/TextInput";
import { MdSend } from "react-icons/md";
import { AuthContext } from "AuthContextProvider";
import { sendMessage } from "Utils/message";
import { HostsContext } from "DataContext/HostsContextProvider";
import { IRecord } from "Utils/storage";
import { IThread } from "Structs/Thread";
import Key from "Utils/Key";

interface IProps {
  activeThread: IRecord<IThread>;
}
const SendBox: FC<IProps> = ({ activeThread }) => {
  const [text, setText] = useState<string>();

  const { address } = useContext(AuthContext);
  const { hosts } = useContext(HostsContext);
  async function send() {
    if (!text) return;
    try {
      const relatedHosts = hosts.filter((host) =>
        activeThread.value.hosts.includes(host.id)
      );
      const channelKey = Key.generateKeyByPrivateKey(activeThread.value.key);
      await sendMessage(
        address,
        activeThread.value.universal_id,
        channelKey,
        text,
        relatedHosts.map((record) => record.value),
        "text"
      );
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div
      className="flex w-full border-t-2 border-solid border-gray-lighter"
      style={{ minHeight: 50 }}
    >
      <div style={{ flex: 11 }} className="flex items-center justify-center">
        <TextInput value={text} onChange={setText} style={{ width: "100%" }} />
      </div>
      <div
        style={{ flex: 1, minWidth: 50 }}
        className="flex items-center justify-center"
      >
        <MdSend
          size={35}
          className="cursor-pointer hover:text-base"
          onClick={send}
        />
      </div>
    </div>
  );
};

export default SendBox;
