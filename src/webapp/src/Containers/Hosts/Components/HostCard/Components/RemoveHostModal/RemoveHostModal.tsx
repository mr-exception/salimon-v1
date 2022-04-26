import { destroySecret } from "API/Signatures";
import { IndexableType } from "dexie";
import { HostsContext } from "DataContext/HostsContextProvider";
import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import { IHost } from "Structs/Host";
import Button from "Ui-Kit/Button/Button";
import { AuthContext } from "AuthContextProvider";
interface IProps {
  close: () => void;
  host: IHost;
  hostId: IndexableType;
}
const RemoveHostModal: React.FC<IProps> = ({ close, host, hostId }: IProps) => {
  const { removeHost } = useContext(HostsContext);
  const { address } = useContext(AuthContext);

  const [submitting, setSubmitting] = useState(false);
  async function deleteHost() {
    setSubmitting(true);
    try {
      await destroySecret(host.url, { address, secret: host.secret });
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
      <div className="text-lg font-bold col-xs-12 mb-[20px]">Remove Host</div>
      <div className="text-justify col-xs-12">
        <span>are you sure from removing this host?</span>
        <ul style={{ marginLeft: 18, listStyle: "disc" }}>
          <li>
            your secret token with this host will be destroyed forever and you
            can't retrive your current secret token with this host anymore.
          </li>
          <li>
            your address on this host will be free for anyone else to lock it
            with a new secret token. it's obviouse that you can't send message
            through this host when you don't have the registered secret key.
          </li>
          <li>
            making an offline backup from you account won't help you to retrive
            this host registeration.
          </li>
          <li>
            you can register this address again if it's not locked by another
            client.
          </li>
        </ul>
      </div>
      <div className="text-right col-xs-12 mt-[20px]">
        <Button
          onClick={deleteHost}
          variant="danger"
          size="sm"
          style={{ marginRight: 10, minWidth: 80 }}
          loading={submitting}
        >
          Delete
        </Button>
        <Button
          onClick={close}
          variant="primary"
          size="sm"
          style={{ minWidth: 80 }}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default RemoveHostModal;
