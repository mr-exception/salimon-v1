import Styles from "./styles.module.css";
import { IMessage } from "Structs/Message";
import { timstampsToRelativeString } from "Utils/date";
import { useContext } from "react";
import { AuthContext } from "AuthContextProvider";

interface IProps {
  message: IMessage;
}

const MessageBox: React.FC<IProps> = ({ message }) => {
  const { address } = useContext(AuthContext);
  return (
    <div
      className={
        (message.src === address ? Styles.sent : Styles.received) + " col-xs-12"
      }
    >
      <div className={Styles.box}>
        <div className="col-xs-12">{message.data}</div>
        <div className={Styles.date + " col-xs-12"}>
          {timstampsToRelativeString(message.date)}
        </div>
      </div>
    </div>
  );
};

export default MessageBox;
