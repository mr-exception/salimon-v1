import React, { useContext, useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import MenuItem from "./Components/MenuItem/MenuItem";
import { FaUsers, FaUser, FaGlobe } from "react-icons/fa";
import { IoMdSettings, IoMdChatboxes } from "react-icons/io";
import Styles from "./styles.module.css";
import { ModalsContextProvider } from "Modals/ModalsContextProvider";
import ModalContainer from "Modals/ModalContainer";
import { HostsContextProvider } from "DataContext/HostsContextProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "AuthContextProvider";
import InitForm from "./Components/InitForm/InitForm";
import AuthStep from "./Components/AuthStep/AuthStep";
import { ContactsContextProvider } from "DataContext/ContactsContextProvider";
import Splash from "./Components/Splash/Splash";
import { ThreadsContextProvider } from "DataContext/ThreadsContextProvider";

interface IProps {
  children: any;
}
const App: React.FC<IProps> = ({ children }: IProps) => {
  const { address, password } = useContext(AuthContext);
  const [passedAuth, setPassedAuth] = useState(false);
  const [splashing, setSplashing] = useState<boolean>(true);
  const history = useHistory();
  const href = useLocation().pathname;
  let activeSection: string = "chats";
  if (href === "/") {
    activeSection = "chats";
  } else {
    activeSection = href.replaceAll("/", "");
  }

  useEffect(() => {
    setTimeout(() => {
      setSplashing(false);
    }, 2500);
  }, []);

  if (splashing) {
    return (
      <div className={Styles.container + " bg-secondary"}>
        <Splash />
      </div>
    );
  }

  if (address === "N/A") {
    return (
      <div className={Styles.container + " bg-secondary"}>
        <InitForm />
      </div>
    );
  }
  if (password !== "N/A" && !passedAuth) {
    return (
      <div className={Styles.container + " bg-secondary"}>
        <AuthStep passed={() => setPassedAuth(true)} />
      </div>
    );
  }

  return (
    <div className={Styles.container}>
      <div className={Styles.toolbar}>
        <MenuItem
          IconComponent={IoMdChatboxes}
          caption="chats"
          onClick={() => {
            history.push("/");
          }}
          isActive={activeSection === "chats"}
        />
        <MenuItem
          IconComponent={FaUsers}
          caption="contacts"
          onClick={() => {
            history.push("/contacts");
          }}
          isActive={activeSection === "contacts"}
        />
        <MenuItem
          IconComponent={FaGlobe}
          caption="hosts"
          onClick={() => {
            history.push("/hosts");
          }}
          isActive={activeSection === "hosts"}
        />
        <MenuItem
          IconComponent={FaUser}
          caption="profile"
          onClick={() => {
            history.push("/profile");
          }}
          isActive={activeSection === "profile"}
        />
        <MenuItem
          IconComponent={IoMdSettings}
          caption="setting"
          onClick={() => {
            history.push("/setting");
          }}
          isActive={activeSection === "setting"}
        />
      </div>
      <HostsContextProvider>
        <ContactsContextProvider>
          <ThreadsContextProvider>
            <ModalsContextProvider>
              <div className={Styles.children}>{children}</div>
              <ModalContainer />
            </ModalsContextProvider>
          </ThreadsContextProvider>
        </ContactsContextProvider>
      </HostsContextProvider>
      <ToastContainer
        bodyStyle={{ maxWidth: "90%", wordBreak: "break-all" }}
        position="top-center"
        autoClose={3500}
        limit={3}
        newestOnTop={true}
        theme="colored"
        draggable={false}
        closeOnClick={false}
      />
    </div>
  );
};

export default App;
