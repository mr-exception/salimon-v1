import { AuthContext } from "AuthContextProvider";
import React, { useContext, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import Button from "Ui-Kit/Button/Button";
import TextInput from "Ui-Kit/Inputs/TextInput/TextInput";
import Key from "Utils/Key";
import { v4 as uuidV4 } from "uuid";

const InitForm: React.FC = () => {
  const authContext = useContext(AuthContext);
  const [address, setAddress] = useState<string>(uuidV4);
  const [password, setPassword] = useState<string>();
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>();

  const [error, setError] = useState<string>();
  function submit() {
    setError(undefined);
    if (!!password) {
      if (passwordConfirmation !== password) {
        setError("password and it's confirmation does not match");
        return;
      }
      authContext.setPassword(password);
    }
    if (!address) {
      setError("please enter the ETH address");
      return;
    }
    authContext.setAddress(address);
    const key = Key.generateFreshKey();
    authContext.setKey(key);
  }
  return (
    <div className="flex items-center justify-center w-full">
      <div className="col-xs-10 col-md-8 col-lg-6">
        <div className="row">
          <div className="my-2 text-2xl text-center col-xs-12">
            Welcome to Salimon!
          </div>
          <div className="my-2 text-justify col-xs-12 text-md">
            to start using salimon network, you need a valid and unique address
            in uuid v4 format, it's recommended to not change the autofilled
            uuid in the text field below.
          </div>
          <div className="my-2 text-justify col-xs-12 text-md">
            you can change your address anytime, but it makes more time in
            future to notify all clients and network in future about this
            critical change in your profile.
          </div>
          <div className="my-2 col-xs-12">
            <TextInput
              placeholder="0x7bd62f48846cd9E370F2AdE8e45bF7Ca9971c1f7"
              label="Address"
              value={address}
              onChange={(value) => {
                setAddress(value.toLowerCase());
              }}
            />
          </div>
          <div className="my-2 text-justify col-xs-12 text-md">
            you can set an offline password to secure your profile, pay
            attention to security warnings in application to keep your profile
            safe. salimon will ask your password each time you open this page.
            just leave them blank if you are sure that your device is safe.
          </div>
          <div className="my-2 col-xs-12">
            <div className="row">
              <div className="col-xs-12 col-md-6 col-lg-6">
                <TextInput
                  placeholder="strong password"
                  type="password"
                  label="Password"
                  value={password}
                  onChange={setPassword}
                />
              </div>
              <div className="col-xs-12 col-md-6 col-lg-6">
                <TextInput
                  placeholder="strong password"
                  type="password"
                  label="Password confirmation"
                  value={passwordConfirmation}
                  onChange={setPasswordConfirmation}
                />
              </div>
            </div>
          </div>
          <div
            className="text-left col-xs-12 text-warning"
            style={{ minHeight: 30 }}
          >
            {error}
          </div>
          <div className="mt-2 text-right col-xs-12">
            <Button variant="primary" size="md" onClick={submit}>
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InitForm;
