import React, { useContext } from "react";
import { toast } from "react-toastify";
import { IHost, subscriptionFee } from "Structs/Host";
import Button from "Ui-Kit/Button/Button";
import { weiToPweiFixed } from "Utils/currency";
import { MdSecurity } from "react-icons/md";
import { FaLink, FaTrash } from "react-icons/fa";
import { IndexableType } from "dexie";
import { ModalsContext } from "Modals/ModalsContextProvider";
import RemoveHostModal from "./Components/RemoveHostModal/RemoveHostModal";

interface IProps {
  host: IHost;
  id: IndexableType;
}

const HostCard: React.FC<IProps> = ({ host, id }: IProps) => {
  const { showModal, closeModal } = useContext(ModalsContext);
  return (
    <div className="col-xs-12 col-lg-6">
      <div className="row border-2 border-solid rounded-md border-base mx-1 p-2">
        <div className="col-xs-6 py-1">Name: {host.name}</div>
        <div className="col-xs-6 py-1">Subscription fee: {subscriptionFee(host)}</div>
        <div className="col-xs-6 py-1 flex">
          Url: {host.url}
          <FaLink
            style={{ marginLeft: 10, marginTop: 6 }}
            className="cursor-pointer"
            size={12}
            onClick={() => {
              window.open(host.url, "blank");
            }}
          />
        </div>
        <div className="col-xs-6 py-1">Response time: {host.rt}ms</div>
        <div className="col-xs-6 py-1">Commission fee: {weiToPweiFixed(host.commission_fee)}</div>
        <div className="col-xs-6 py-1">Your balance: {weiToPweiFixed(host.balance)}</div>
        <div className="col-xs-6 py-1">Your Subscription: {host.subscription} packets</div>
        <div className="col-xs-6 py-1 text-right">
          <Button
            size="sm"
            onClick={() => {
              toast.info("you secret token: " + host.secret, {
                onClick: () => {
                  console.log("clicked on toast");
                },
              });
            }}
          >
            <MdSecurity />
          </Button>
          <Button
            size="sm"
            style={{ marginLeft: 5 }}
            variant="warning"
            onClick={() => {
              showModal(<RemoveHostModal host={host} hostId={id} close={closeModal} />);
            }}
          >
            <FaTrash />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HostCard;
