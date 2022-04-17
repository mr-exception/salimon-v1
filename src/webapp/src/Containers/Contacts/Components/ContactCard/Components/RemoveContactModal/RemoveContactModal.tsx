import { ContactsContext } from "DataContext/ContactsContextProvider";
import { IndexableType } from "dexie";
import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import Button from "Ui-Kit/Button/Button";
interface IProps {
  close: () => void;
  id: IndexableType;
}
const RemoveContactModal: React.FC<IProps> = ({ close, id }: IProps) => {
  const { removeContact } = useContext(ContactsContext);

  const [submitting, setSubmitting] = useState(false);
  async function deleteContact() {
    setSubmitting(true);
    try {
      removeContact(id);
      toast.error("contact removed");
      setTimeout(() => {
        close();
      });
    } catch (err) {
      console.log(err);
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <div className="row">
      <div className="col-xs-12 font-bold text-lg">Remove Contact</div>
      <div className="col-xs-12 text-justify my-2">
        <span>are you sure from removing this contact?</span>
      </div>
      <div className="col-xs-12 text-right">
        <Button
          onClick={deleteContact}
          variant="danger"
          size="sm"
          style={{ marginRight: 10, minWidth: 80 }}
          loading={submitting}
        >
          Delete
        </Button>
        <Button onClick={close} variant="primary" size="sm" style={{ minWidth: 80 }}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default RemoveContactModal;
