import React, { useState } from "react";
import Button from "Ui-Kit/Button/Button";
import TextField from "Ui-Kit/Form/TextField/TextField";

interface IProps {
  updatePassword: (value?: string) => void;
}
const PasswordCard: React.FC<IProps> = ({ updatePassword }: IProps) => {
  const [password, setPassword] = useState<string>();
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>();
  return (
    <div className="row justify-center">
      <div className="col-xs-6 bg-secondary mt-4 rounded-md">
        <div className="row my-4">
          <div className="col-xs-12">
            <TextField
              label="password"
              placeHolder="use a secure new password"
              value={password}
              onChange={setPassword}
            />
          </div>
          <div className="col-xs-12">
            <TextField
              label="password confirmation"
              placeHolder="confirm your entered password"
              value={passwordConfirmation}
              onChange={setPasswordConfirmation}
            />
          </div>
          <div className="col-xs-12 text-right mt-4">
            <Button
              variant="primary"
              onClick={() => {
                updatePassword(password);
              }}
            >
              Update Password
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordCard;
