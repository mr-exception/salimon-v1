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
import { AuthContext } from "AuthContextProvider";
import { ThreadsContext } from "DataContext/ThreadsContextProvider";
import { createThread } from "API/Threads";
import { createAxios } from "API/axios-inital";
import TextInput from "Ui-Kit/Inputs/TextInput/TextInput";

interface IProps {
  close: () => void;
}
const CreateThreadModal: React.FC<IProps> = ({ close }: IProps) => {
  const { contacts } = useContext(ContactsContext);
  const { address, key } = useContext(AuthContext);
  const { addThread } = useContext(ThreadsContext);
  const [selectedContact, setSelectedContact] = useState<IRecord<IContact>>();
  const [name, setName] = useState<string>("");
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
    const threadId = uuidV4();
    const keyCipherForContact = encryptWithPublic(
      channelPrivateKey,
      selectedContact.value.publicKey
    );
    const keyCipherForMe = key.encryptPublic(channelPrivateKey);
    const promises = relatedHosts.map(
      (host) =>
        new Promise<void>(async (resolve, reject) => {
          try {
            await createThread(
              {
                name,
                threadId,
                members: [
                  {
                    address,
                    privateKey: keyCipherForMe,
                  },
                  {
                    address: selectedContact.value.address,
                    privateKey: keyCipherForContact,
                  },
                ],
              },
              createAxios(host.url, address, host.secret)
            );
            resolve();
          } catch (error) {
            reject(error);
          }
        })
    );
    await Promise.allSettled(promises);
    addThread({
      _id: "",
      threadId,
      ownerAddress: address,
      members: [
        { address, privateKey: channelPrivateKey },
        {
          address: selectedContact.value.address,
          privateKey: keyCipherForContact,
        },
      ],
      name: name,
      hosts: selectedContact.value.hosts.map((record) => record.hostId),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    setCreating(false);
    setTimeout(() => {
      close();
    });
  }
  return (
    <div className="row">
      <div className="text-lg font-bold col-xs-12">Create Thread</div>
      <div className="col-xs-12">
        <TextInput label="thread title" value={name} onChange={setName} />
      </div>
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
      <div className="text-right col-xs-12">
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
