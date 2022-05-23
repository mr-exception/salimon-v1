import Styles from "./styles.module.css";
import { timstampsToRelativeString } from "Utils/date";
import { useContext } from "react";
import { AuthContext } from "AuthContextProvider";
import { IPlainMessage } from "DataContext/MessagsContextProvider";

interface IProps {
  message: IPlainMessage;
}

const MessageBox: React.FC<IProps> = ({ message }) => {
  const { address } = useContext(AuthContext);
  return (
    <div
      className={
        (message.srcAddress === address ? Styles.sent : Styles.received) +
        " col-xs-12"
      }
    >
      <div className={Styles.box}>
        <div className="col-xs-12">{message.data.data}</div>
        <div className={Styles.date + " col-xs-12"}>
          {timstampsToRelativeString(message.createdAt)}
        </div>
      </div>
    </div>
  );
};

export default MessageBox;
