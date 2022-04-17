import { IndexableType } from "dexie";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { IContact } from "Structs/Contact";
import {
  deleteContactFromDB,
  getContactsFromDB,
  insertContactInDB,
  IRecord,
  updateContactInDB,
} from "Utils/storage";

export interface IContactsContext {
  contacts: IRecord<IContact>[];
  addContact: (value: IContact) => void;
  removeContact: (id: IndexableType) => void;
  updateContact: (value: IRecord<IContact>) => void;
}

export const ContactsContext = createContext<IContactsContext>({
  contacts: [],
  addContact: (value: IContact) => {},
  removeContact: (id: IndexableType) => {},
  updateContact: (value: IRecord<IContact>) => {},
});

export const ContactsContextProvider: React.FC<{ children: any }> = ({
  children,
}) => {
  const [contacts, setContacts] = useState<IRecord<IContact>[]>([]);
  async function addContact(value: IContact): Promise<void> {
    const id = await insertContactInDB(value);
    setContacts([...contacts, { value, id }]);
    toast.success("contact created!");
  }
  async function removeContact(id: IndexableType) {
    await deleteContactFromDB(id);
    setContacts(await getContactsFromDB());
  }
  async function updateContact(value: IRecord<IContact>) {
    await updateContactInDB(value.id, value.value);
    const result = await getContactsFromDB();
    setContacts(result);
  }
  useEffect(() => {
    getContactsFromDB().then((value) => {
      setContacts(value);
    });
  }, []);
  return (
    <ContactsContext.Provider
      value={{
        contacts,
        addContact,
        removeContact,
        updateContact,
      }}
    >
      {children}
    </ContactsContext.Provider>
  );
};

export function useGetContact(address?: string): IRecord<IContact> | undefined {
  const { contacts } = useContext(ContactsContext);
  return contacts.find((record) => record.value.address === address);
}
export function useAppendContact(): (
  address: string,
  public_key: string
) => void {
  const { contacts, addContact } = useContext(ContactsContext);
  return function append(address: string, public_key: string): void {
    let found = false;
    for (let i = 0; i < contacts.length; i++) {
      if (contacts[i].value.address === address) {
        found = true;
        break;
      }
    }
    if (!found) {
      addContact({
        address,
        name: address,
        hosts: [],
        public_key,
      });
    }
  };
}
