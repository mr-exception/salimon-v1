import React, { useState } from "react";
import Button from "Ui-Kit/Button/Button";
import TextField from "Ui-Kit/Form/TextField/TextField";

interface IProps {
  address: string;
  setAddress: (value: string) => void;
}
const AddressCard: React.FC<IProps> = ({ address, setAddress }: IProps) => {
  const [value, setValue] = useState<string>(address);
  return (
    <div className="row justify-center">
      <div className="col-xs-6 bg-secondary mt-4 rounded-md">
        <div className="row my-4">
          <div className="col-xs-12">
            <TextField
              label="address"
              placeHolder="0xF37DFafE1a8447395fEf43B5ed67901AA4a14C4a"
              value={value}
              onChange={setValue}
            />
          </div>
          <div className="col-xs-12 text-right mt-4">
            <Button
              variant="primary"
              onClick={() => {
                setAddress(value);
              }}
            >
              Update Address
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressCard;
