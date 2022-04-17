import React from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import App from "App/App";
import Hosts from "Containers/Hosts/Hosts";
import Profile from "Containers/Profile/Profile";
import Setting from "Containers/Setting/Setting";
import Contacts from "Containers/Contacts/Contacts";
import Chats from "Containers/Chats/Chats";
import { AuthContextProvider } from "AuthContextProvider";
import { WorkersContextProvider } from "WorkersContextProvider";

const Routes = () => {
  return (
    <WorkersContextProvider
      hostsWorker={new Worker("/workers/hosts.js")}
      threadsWorker={new Worker("/workers/threads.js")}
    >
      <AuthContextProvider>
        <Router>
          <Switch>
            <App>
              <Route exact path="/hosts">
                <Hosts />
              </Route>
              <Route exact path="/profile">
                <Profile />
              </Route>
              <Route exact path="/setting">
                <Setting />
              </Route>
              <Route exact path="/contacts">
                <Contacts />
              </Route>
              <Route exact path="/">
                <Chats />
              </Route>
            </App>
          </Switch>
        </Router>
      </AuthContextProvider>
    </WorkersContextProvider>
  );
};
export default Routes;
