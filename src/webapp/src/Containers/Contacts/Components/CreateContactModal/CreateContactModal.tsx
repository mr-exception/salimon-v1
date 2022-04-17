import { checkAddressList } from "API/CheckAddressList";
import { AxiosError } from "axios";
import { ContactsContext } from "DataContext/ContactsContextProvider";
import { IndexableType } from "dexie";
import { HostsContext } from "DataContext/HostsContextProvider";
import React, { useContext, useState } from "react";
import { IContact } from "Structs/Contact";
import { IHost } from "Structs/Host";
import Button from "Ui-Kit/Button/Button";
import TextInput from "Ui-Kit/Inputs/TextInput/TextInput";
import { timestampToDateTime } from "Utils/string";

interface ICheckResult {
  result: boolean;
  public_key: string;
  active_at: number;
  host: { value: IHost; id: IndexableType };
  ts: number;
}

interface IProps {
  close: () => void;
}
const CreateContactModal: React.FC<IProps> = ({ close }: IProps) => {
  const { hosts } = useContext(HostsContext);
  const { addContact } = useContext(ContactsContext);
  const [name, setName] = useState<string>();
  const [address, setAddress] = useState<string>();
  const [fetchResult, setFetchResult] = useState<ICheckResult[]>();

  const [errors, setErrors] = useState<string[]>([]);
  const [notFound, setNotFound] = useState<boolean>(false);

  const [fetching, setFetching] = useState<"not_fetched" | "fetching" | "fetched">("not_fetched");
  async function fetchRoutes() {
    setFetching("fetching");
    setErrors([]);
    setNotFound(false);
    let currentErrors: string[] = [];
    try {
      const result = (await Promise.all(
        hosts.map(async (host) => {
          const ts = Date.now();
          if (!address) return false;
          try {
            const checkResult = await checkAddressList(host.value.url, { addresses: [address] });
            if (!!checkResult[address]) {
              return {
                result: true,
                host,
                ts: Date.now() - ts,
                public_key: (checkResult[address] || {}).public_key,
                active_at: (checkResult[address] || {}).active_at,
              };
            } else {
              return {
                result: false,
                host,
                ts: Date.now() - ts,
              };
            }
          } catch (err) {
            currentErrors.push(`${host.value.url}: ${(err as AxiosError).message}`);
          }
        })
      )) as {
        result: boolean;
        public_key?: string;
        active_at?: number;
        host: { value: IHost; id: IndexableType };
        ts: number;
      }[];
      setNotFound(!result.reduce<boolean>((cursor, current) => current.result || cursor, false));
      setFetchResult(result.filter((record) => !!record.result) as ICheckResult[]);
    } catch (err) {
      console.log(err);
    } finally {
      setFetching("fetched");
      setErrors(currentErrors);
    }
  }
  async function saveContact() {
    if (!name || !address || notFound || !fetchResult) return;
    let public_key = "none";
    let active_at: number = -1;
    for (let i = 0; i < fetchResult.length; i++) {
      if (active_at < fetchResult[i].active_at) {
        public_key = fetchResult[i].public_key;
        active_at = fetchResult[i].active_at;
      }
    }
    const contact: IContact = {
      name,
      address,
      public_key,
      hosts: (fetchResult || []).map((record) => ({ hostId: record.host.id, active_at: record.active_at })),
    };
    addContact(contact);
    setTimeout(() => {
      close();
    });
  }
  return (
    <div className="row">
      <div className="col-xs-12 font-bold text-lg">Create Contact</div>
      <div className="col-xs-12">
        <TextInput label="Full name" placeholder="Majid Moshafegh" value={name} onChange={setName} />
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
          {!!fetchResult &&
            fetchResult.map((result, index) => {
              if (result.result) {
                return (
                  <div key={index} className="col-xs-12">
                    is registered in {result.host.value.name} ({result.host.value.url}), last activity:
                    {" " + timestampToDateTime(result.active_at)}!
                  </div>
                );
              } else {
                return (
                  <div key={index} className="col-xs-12">
                    not registered in {result.host.value.name} ({result.host.value.url})
                  </div>
                );
              }
            })}
          {!!errors &&
            errors.map((err) => (
              <div className="col-xs-12">
                <span className="italic">{err}</span>
              </div>
            ))}
          {!!notFound && (
            <div className="col-xs-12">
              <span className="italic">
                this address is not registered in any host from your registered hosts. you can't send any message to
                this contact with your current host list
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="col-xs-12 text-right">
        <Button
          onClick={fetchRoutes}
          variant="primary"
          size="sm"
          style={{ marginRight: 10, minWidth: 130 }}
          loading={fetching === "fetching"}
        >
          Fetch Routes
        </Button>
        {!notFound && fetching === "fetched" && (
          <Button onClick={saveContact} variant="primary" size="sm" style={{ marginRight: 10, minWidth: 130 }}>
            Save
          </Button>
        )}
        <Button onClick={close} variant="warning" size="sm" style={{ minWidth: 80 }}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default CreateContactModal;
