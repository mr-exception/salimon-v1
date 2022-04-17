import { createContext, useContext, useEffect, useState } from "react";
import Key from "Utils/Key";
import { WorkersContext } from "WorkersContextProvider";

export interface IModalContext {
  address: string;
  password: string;
  key: Key;

  setAddress: (value: string) => void;
  setPassword: (value: string) => void;
  setKey: (value: Key) => void;
}

export const AuthContext = createContext<IModalContext>({
  address: "N/A",
  key: Key.generateFreshKey(),
  password: "N/A",

  setAddress: () => {},
  setKey: () => {},
  setPassword: () => {},
});

export const AuthContextProvider: React.FC<{ children: any }> = ({
  children,
}) => {
  const { hostsWorker, threadsWorker } = useContext(WorkersContext);
  const [address, setAddress] = useState<string>("N/A");
  const [key, setKey] = useState<Key>(Key.generateFreshKey());
  const [password, setPassword] = useState<string>("N/A");

  function updateAddress(value: string) {
    localStorage.setItem("address", value);
    setAddress(value);
    hostsWorker.postMessage({ action: "update_address", payload: value });
    threadsWorker.postMessage({ action: "update_address", payload: value });
  }
  function updateKey(value: Key) {
    localStorage.setItem("public_key", value.getPublicKey());
    localStorage.setItem("private_key", value.getPrivateKey());
    setKey(value);
  }
  function updatePassword(value: string) {
    localStorage.setItem("password", value);
    setPassword(value);
  }

  useEffect(() => {
    setAddress(localStorage.getItem("address") || "N/A");
    const public_key = localStorage.getItem("public_key");
    const private_key = localStorage.getItem("private_key");
    if (!!public_key && !!private_key) {
      setKey(Key.generateFullKey(public_key, private_key));
    }
    setPassword(localStorage.getItem("password") || "N/A");
    hostsWorker.postMessage({
      action: "update_address",
      payload: localStorage.getItem("address") || "N/A",
    });
    threadsWorker.postMessage({
      action: "update_address",
      payload: localStorage.getItem("address") || "N/A",
    });
  }, [hostsWorker, threadsWorker]);
  return (
    <AuthContext.Provider
      value={{
        address,
        setAddress: updateAddress,
        key,
        setKey: updateKey,
        password,
        setPassword: updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
