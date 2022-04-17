import React, { useContext, useState } from "react";
import Styles from "./styles.module.css";
import { ModalsContext } from "Modals/ModalsContextProvider";
import AddHostModal from "./Components/AddHostModal/AddHostModal";
import { HostsContext } from "DataContext/HostsContextProvider";
import HostCard from "./Components/HostCard/HostCard";
const Hosts = () => {
  const modalsContext = useContext(ModalsContext);
  const { hosts } = useContext(HostsContext);
  const [search_term, set_search_term] = useState("");
  return (
    <div className="col-xs-12">
      <div className="row flex flex-row p-2 justify-center items-center">
        <input
          value={search_term}
          onChange={(e) => set_search_term(e.target.value)}
          className={Styles.searchInput}
          placeholder="search in hosts..."
        />
        <button
          className={Styles.searchAdd}
          onClick={() => {
            modalsContext.showModal(<AddHostModal close={modalsContext.closeModal} />, "md");
          }}
        >
          <img src="/img/add.svg" alt="add" />
        </button>
      </div>
      <div className="row p-4">
        {hosts.map((host) => (
          <HostCard host={host.value} key={host.id.toString()} id={host.id} />
        ))}
      </div>
    </div>
  );
};

export default Hosts;
