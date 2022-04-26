import React, { useContext, useState } from "react";
import Styles from "./styles.module.css";
import { ModalsContext } from "Modals/ModalsContextProvider";
import AddHostModal from "./Components/AddHostModal/AddHostModal";
import { HostsContext } from "DataContext/HostsContextProvider";
import HostCard from "./Components/HostCard/HostCard";
import { FaPlus } from "react-icons/fa";
const Hosts = () => {
  const modalsContext = useContext(ModalsContext);
  const { hosts } = useContext(HostsContext);
  const [search_term, set_search_term] = useState("");
  return (
    <div className="col-xs-12">
      <div className="flex flex-row items-center justify-center p-2 row">
        <input
          value={search_term}
          onChange={(e) => set_search_term(e.target.value)}
          className={Styles.searchInput}
          placeholder="search in hosts..."
        />
        <button
          className="flex flex-1 max-w-[45px] hover:bg-primary rounded-md justify-center items-center mx-2 min-h-[35px]"
          onClick={() => {
            modalsContext.showModal(
              <AddHostModal close={modalsContext.closeModal} />,
              "md"
            );
          }}
        >
          <FaPlus />
        </button>
      </div>
      <div className="p-4 row">
        {hosts.map((host) => (
          <HostCard host={host.value} key={host.id.toString()} id={host.id} />
        ))}
      </div>
    </div>
  );
};

export default Hosts;
