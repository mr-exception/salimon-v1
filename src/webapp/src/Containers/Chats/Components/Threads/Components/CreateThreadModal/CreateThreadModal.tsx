import { registerChannel } from "API/Channels";
import { ContactsContext } from "DataContext/ContactsContextProvider";
import { useRelatedHosts } from "DataContext/HostsContextProvider";
import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import { IContact } from "Structs/Contact";
import Button from "Ui-Kit/Button/Button";
import Key, { encryptWithPublic } from "Utils/Key";
import { IRecord } from "Utils/storage";
import ContactCard from "./Component/ContactCard/ContactCard";
import { v4 as uuidV4 } from "uuid";
import { createAxiosConfig } from "Structs/Host";
import { AuthContext } from "AuthContextProvider";
import { ThreadsContext } from "DataContext/ThreadsContextProvider";

interface IProps {
  close: () => void;
}
const CreateThreadModal: React.FC<IProps> = ({ close }: IProps) => {
  const { contacts } = useContext(ContactsContext);
  const { address, key } = useContext(AuthContext);
  const { addThread } = useContext(ThreadsContext);
  const [selectedContact, setSelectedContact] = useState<IRecord<IContact>>();
  const relatedHosts = useRelatedHosts(selectedContact?.value);

  const [creating, setCreating] = useState<boolean>(false);
  async function create() {
    if (!selectedContact) {
      return toast.error("please select a contact");
    }
    if (relatedHosts.length === 0) {
      toast.error("you don't have any route to this contact");
      return close();
    }
    setCreating(true);
    const channelKey = Key.generateFreshKey();
    const channelPrivateKey = channelKey.getPrivateKey();
    const universal_id = uuidV4();
    const promises = relatedHosts.map(
      (host) =>
        new Promise<void>(async (resolve, reject) => {
          try {
            const keyCipherForContact = encryptWithPublic(
              channelPrivateKey,
              selectedContact.value.public_key
            );
            await registerChannel(
              universal_id,
              keyCipherForContact,
              selectedContact.value.address,
              createAxiosConfig(address, host)
            );
            const keyCipherForMe = key.encryptPublic(channelPrivateKey);
            await registerChannel(
              universal_id,
              keyCipherForMe,
              address,
              createAxiosConfig(address, host)
            );
            resolve();
          } catch (error) {
            reject(error);
          }
        })
    );
    await Promise.allSettled(promises);
    addThread({
      creator: address,
      members: [address, selectedContact.value.address],
      universal_id,
      key: channelKey.getPrivateKey(),
      hosts: selectedContact.value.hosts.map((record) => record.hostId),
    });
    setCreating(false);
    setTimeout(() => {
      close();
    });
  }
  return (
    <div className="row">
      <div className="col-xs-12 font-bold text-lg">Create Thread</div>
      <div className="col-xs-12">
        <div className="row">
          {contacts.map((contact) => (
            <ContactCard
              key={contact.id.toString()}
              contact={contact}
              onSelected={() => {
                setSelectedContact(contact);
              }}
              isSelected={
                !!selectedContact && selectedContact.id === contact.id
              }
            />
          ))}
        </div>
      </div>
      <div className="col-xs-12 text-right">
        <Button variant="warning" style={{ marginRight: 10 }} onClick={close}>
          Cancel
        </Button>
        <Button
          variant="primary"
          loading={creating}
          onClick={create}
          style={{ minWidth: 110 }}
        >
          Register
        </Button>
      </div>
    </div>
  );
};

export default CreateThreadModal;
