import { AuthContext } from "AuthContextProvider";
import React, { useContext, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import Button from "Ui-Kit/Button/Button";
import TextInput from "Ui-Kit/Inputs/TextInput/TextInput";

interface IProps {
  passed: () => void;
}

const AuthStep: React.FC<IProps> = ({ passed }) => {
  const authContext = useContext(AuthContext);
  const [password, setPassword] = useState<string>();

  const [error, setError] = useState<string>();
  function submit() {
    setError(undefined);
    if (password !== authContext.password) {
      setError("incorrect password");
      return;
    }
    passed();
  }
  return (
    <div className="flex items-center w-full justify-center">
      <div className="col-xs-6 col-md-4 col-lg-4">
        <div className="row">
          <div className="col-xs-12 text-center text-2xl my-2">
            Welcome to Salimon!
          </div>
          <div className="col-xs-12 text-center text-md my-2">
            please enter your security password to use the application
          </div>
          <div className="col-xs-12 col-md-8 col-md-offset-2 my-2">
            <TextInput
              placeholder="like 123?"
              type="password"
              label="Password"
              value={password}
              onChange={setPassword}
            />
          </div>
          <div
            className="col-xs-12 text-left text-warning"
            style={{ minHeight: 30 }}
          >
            {error}
          </div>
          <div className="col-xs-12 text-center mt-2">
            <Button variant="primary" size="md" onClick={submit}>
              Login
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthStep;
