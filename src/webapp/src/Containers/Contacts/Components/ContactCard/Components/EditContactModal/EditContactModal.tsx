import { ContactsContext } from "DataContext/ContactsContextProvider";
import React, { useContext, useState } from "react";
import { IContact } from "Structs/Contact";
import Button from "Ui-Kit/Button/Button";
import TextInput from "Ui-Kit/Inputs/TextInput/TextInput";
import { IRecord } from "Utils/storage";

interface IProps {
  contact: IRecord<IContact>;
  close: () => void;
}
const EditContactModal: React.FC<IProps> = ({ close, contact }: IProps) => {
  const { updateContact } = useContext(ContactsContext);
  const [name, setName] = useState<string>(contact.value.name);
  const [address, setAddress] = useState<string>(contact.value.address);

  const [errors, setErrors] = useState<string[]>([]);

  async function saveContact() {
    const errs: string[] = [];
    if (!name) errs.push("please define a name for this contact");
    if (!address) errs.push("please define an address for this contact");

    if (errs.length > 0) {
      setErrors(errs);
    }

    const updatedContact = { ...contact.value };
    updatedContact.name = name;
    updatedContact.address = address;
    updateContact({ id: contact.id, value: updatedContact });
    setTimeout(() => {
      close();
    });
  }
  return (
    <div className="row">
      <div className="text-lg font-bold col-xs-12">Create Contact</div>
      <div className="col-xs-12">
        <TextInput
          label="Full name"
          placeholder="Majid Moshafegh"
          value={name}
          onChange={setName}
        />
      </div>
      <div className="col-xs-12">
        <TextInput
          label="Address"
          placeholder="0x7bd62f48846cd9E370F2AdE8e45bF7Ca9971c1f7"
          value={address}
          onChange={(value) => {
            setAddress(value.toLowerCase());
          }}
        />
      </div>
      <div className="col-xs-12" style={{ minHeight: 50 }}>
        <div className="row">
          {!!errors &&
            errors.map((err) => (
              <div className="col-xs-12">
                <span className="italic">{err}</span>
              </div>
            ))}
        </div>
      </div>
      <div className="text-right col-xs-12">
        <Button
          onClick={saveContact}
          variant="primary"
          size="sm"
          disabled={errors.length > 0}
          style={{ marginRight: 10, minWidth: 130 }}
        >
          Save
        </Button>
        <Button
          onClick={close}
          variant="warning"
          size="sm"
          style={{ minWidth: 80 }}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default EditContactModal;
