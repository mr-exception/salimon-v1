import { ContactsContext } from "DataContext/ContactsContextProvider";
import { ModalsContext } from "Modals/ModalsContextProvider";
import { useContext, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { IContact } from "Structs/Contact";
import Button from "Ui-Kit/Button/Button";
import { IRecord } from "Utils/storage";
import ContactCard from "./Components/ContactCard/ContactCard";
import CreateContactModal from "./Components/CreateContactModal/CreateContactModal";
import Styles from "./styles.module.css";
const Contacts = () => {
  const { contacts } = useContext(ContactsContext);
  const { showModal, closeModal } = useContext(ModalsContext);
  const [searchTerm, setSearchTerm] = useState<string>();

  function filteredContacts(): IRecord<IContact>[] {
    return contacts.filter((contact) =>
      contact.value.name.includes(searchTerm || "")
    );
  }
  if (contacts.length === 0) {
    return (
      <div className="h-full col-xs-12">
        <div className="items-center justify-center h-full row">
          <div
            className="flex flex-col items-center justify-center p-4 text-center rounded-lg col-xs-10 col-md-6 col-lg-4 bg-primary"
            style={{ minHeight: 120 }}
          >
            <span className="text-xl">you don't have any contact.</span>
            <Button
              onClick={() => {
                showModal(<CreateContactModal close={closeModal} />, "md");
              }}
              variant="secondary"
              style={{ maxWidth: 200, marginTop: 20 }}
            >
              Add new contact
            </Button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="col-xs-12">
      <div className="flex flex-row items-center justify-center p-2 row">
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={Styles.searchInput}
          placeholder="search in contacts..."
        />
        <button
          className="flex flex-1 max-w-[45px] hover:bg-primary rounded-md justify-center items-center mx-2 min-h-[35px]"
          onClick={() => {
            showModal(<CreateContactModal close={closeModal} />, "md");
          }}
        >
          <FaPlus />
        </button>
      </div>
      <div className="row">
        {filteredContacts().map((record) => (
          <ContactCard contact={record} key={record.id.toString()} />
        ))}
      </div>
    </div>
  );
};

export default Contacts;
