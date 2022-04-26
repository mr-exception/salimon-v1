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
      <div className="p-2 mx-1 border-2 border-solid rounded-md row border-base">
        <div className="py-1 col-xs-6">Name: {host.name}</div>
        <div className="py-1 col-xs-6">
          Subscription fee: {subscriptionFee(host)}
        </div>
        <div className="flex py-1 col-xs-6">
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
        <div className="py-1 col-xs-6">Response time: {host.rt}ms</div>
        <div className="py-1 col-xs-6">
          Commission fee: {weiToPweiFixed(host.commissionFee)} pk
        </div>
        <div className="py-1 col-xs-6">
          Your balance: {weiToPweiFixed(host.balance)}
        </div>
        <div className="py-1 col-xs-6">
          Your Subscription: {host.balance} packets
        </div>
        <div className="py-1 text-right col-xs-6">
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
              showModal(
                <RemoveHostModal host={host} hostId={id} close={closeModal} />
              );
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
