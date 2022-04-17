import { AuthContext } from "AuthContextProvider";
import React, { useContext, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import Button from "Ui-Kit/Button/Button";
import TextInput from "Ui-Kit/Inputs/TextInput/TextInput";
import Key from "Utils/Key";

const InitForm: React.FC = () => {
  const authContext = useContext(AuthContext);
  const [address, setAddress] = useState<string>();
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
    <div className="flex items-center w-full justify-center">
      <div className="col-xs-10 col-md-8 col-lg-6">
        <div className="row">
          <div className="col-xs-12 text-center text-2xl my-2">
            Welcome to Salimon!
          </div>
          <div className="col-xs-12 text-justify text-md my-2">
            to start using salimon, you need a valid ethereum wallet address to
            link your account. we recommend using metamask browser extention.
            everyone in salimon network will know you just by your wallet
            address, no extra identication required.
          </div>
          <div className="col-xs-12 text-justify text-md my-2">
            salimon application doesn't need any secret passphrase from your ETH
            wallet. your wallet does not need to have any balance, we don't have
            access to your wallet. just make sure you own the entered wallet
            address, because you have to pay or receive your activity shares
            with this address. you can't change your wallet address in future.
          </div>
          <div className="col-xs-12 my-2">
            <TextInput
              placeholder="0x7bd62f48846cd9E370F2AdE8e45bF7Ca9971c1f7"
              label="Ethereum address"
              value={address}
              onChange={(value) => {
                setAddress(value.toLowerCase());
              }}
            />
          </div>
          <div className="col-xs-12 text-justify text-md my-2">
            you can set an offline password to secure your profile, pay
            attention to security warnings in application to keep your profile
            safe. salimon will ask your password each time you open this page.
            just leave them blank if you are sure that your device is safe.
          </div>
          <div className="col-xs-12 my-2">
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
            className="col-xs-12 text-left text-warning"
            style={{ minHeight: 30 }}
          >
            {error}
          </div>
          <div className="col-xs-12 text-right mt-2">
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
