import Styles from "./styles.module.css";
import { timstampsToRelativeString } from "Utils/date";
import { useContext } from "react";
import { AuthContext } from "AuthContextProvider";
import { IMessage } from "datamodels/message";
import { IHost } from "Structs/Host";

interface IProps {
  message: IMessage;
  hosts: IHost[];
}

const MessageBox: React.FC<IProps> = ({ message, hosts }) => {
  const { address } = useContext(AuthContext);
  return (
    <div
      className={
        (message.srcAddress === address ? Styles.sent : Styles.received) +
        " col-xs-12"
      }
    >
      <div className={Styles.box}>
        <div className="col-xs-12">{message.dataPath}</div>
        <div className={Styles.date + " col-xs-12"}>
          {timstampsToRelativeString(message.createdAt)}
        </div>
      </div>
    </div>
  );
};

export default MessageBox;
