import { destroySecret } from "API/Signatures";
import { IndexableType } from "dexie";
import { HostsContext } from "DataContext/HostsContextProvider";
import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import { IHost } from "Structs/Host";
import Button from "Ui-Kit/Button/Button";
interface IProps {
  close: () => void;
  host: IHost;
  hostId: IndexableType;
}
const RemoveHostModal: React.FC<IProps> = ({ close, host, hostId }: IProps) => {
  const { removeHost } = useContext(HostsContext);

  const [submitting, setSubmitting] = useState(false);
  async function deleteHost() {
    setSubmitting(true);
    try {
      await destroySecret(host.url, { address: "0x7bd62f48846cd9E370F2AdE8e45bF7Ca9971c1f7", secret: host.secret });
      removeHost(hostId);
      toast.error("host removed");
      setTimeout(() => {
        close();
      });
    } catch (err) {
      console.log(err);
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <div className="row">
      <div className="col-xs-12 font-bold text-lg">Remove Host</div>
      <div className="col-xs-12 text-justify">
        <span>are you sure from removing this host?</span>
        <ul style={{ marginLeft: 18, listStyle: "disc" }}>
          <li>
            your secret token with this host will be destroyed forever and you can't retrive your current secret token
            with this host anymore.
          </li>
          <li>
            your address on this host will be free for anyone else to lock it with a new secret token. it's obviouse
            that you can't send message through this host when you don't have the registered secret key.
          </li>
          <li>making an offline backup from you account won't help you to retrive this host registeration.</li>
          <li>you can register this address again if it's not locked by another client.</li>
        </ul>
      </div>
      <div className="col-xs-12 text-right">
        <Button
          onClick={deleteHost}
          variant="danger"
          size="sm"
          style={{ marginRight: 10, minWidth: 80 }}
          loading={submitting}
        >
          Delete
        </Button>
        <Button onClick={close} variant="primary" size="sm" style={{ minWidth: 80 }}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default RemoveHostModal;
