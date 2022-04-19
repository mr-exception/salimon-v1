import React from "react";
import {
  Route,
  BrowserRouter as Router,
  Routes as RouteBag,
} from "react-router-dom";
import App from "App/App";
import Profile from "Containers/Profile/Profile";
import Setting from "Containers/Setting/Setting";
import Contacts from "Containers/Contacts/Contacts";
import Chats from "Containers/Chats/Chats";
import { AuthContextProvider } from "AuthContextProvider";
import Hosts from "Containers/Hosts/Hosts";

const Routes = () => {
  return (
    <AuthContextProvider>
      <Router>
        <RouteBag>
          <App>
            <Route path="/hosts" element={<Hosts />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/setting" element={<Setting />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/" element={<Chats />} />
          </App>
        </RouteBag>
      </Router>
    </AuthContextProvider>
  );
};
export default Routes;
