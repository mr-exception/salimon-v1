import { createSignature } from "API/Signatures";
import { AuthContext } from "AuthContextProvider";
import { AxiosError } from "axios";
import { HostsContext } from "DataContext/HostsContextProvider";
import React, { useContext, useState } from "react";
import { IHost } from "Structs/Host";
import { IHeartBeat } from "datamodels/heartbeat";
import Button from "Ui-Kit/Button/Button";
import TextInput from "Ui-Kit/Inputs/TextInput/TextInput";
import { randomString } from "Utils/string";
import HeartBeatInfo from "./Components/HeartBeatInfo";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { GET_HEARTBEAT, IGetHeartbeat } from "./queries";

interface IProps {
  close: () => void;
}
const AddHostModal: React.FC<IProps> = ({ close }: IProps) => {
  const authContext = useContext(AuthContext);
  const hostsContext = useContext(HostsContext);
  const [address, setAddress] = useState<string>();
  const [heartBeatResult, setHeartBeatResult] = useState<IHeartBeat>();

  const client = new ApolloClient({
    uri: address + "/graphql",
    cache: new InMemoryCache(),
  });

  const [fetching, setFetching] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  async function fetch() {
    setError(undefined);
    setFetching(true);
    const time = Date.now();
    try {
      const result = (
        await client.query<IGetHeartbeat>({
          query: GET_HEARTBEAT,
          variables: {
            address: authContext.address,
          },
        })
      ).data.heartBeat;
      setHeartBeatResult(result);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setFetching(false);
    }
  }

  const [submitting, setSubmitting] = useState(false);
  async function submitHost() {
    if (!heartBeatResult || !address) return;
    setSubmitting(true);
    const secret = randomString(64);
    try {
      await createSignature(address, {
        name: "sample-name",
        secret,
        address: authContext.address,
        publicKey: authContext.key.getPublicKey(),
      });
      const host: IHost = {
        url: address,
        ...heartBeatResult,
        secret,
        lastFetched: 0,
      };
      hostsContext.addHost(host);
      setTimeout(() => {
        close();
      });
    } catch (err) {
      setError((err as AxiosError).message);
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <div className="row">
      <div className="text-lg font-bold col-xs-12">Add new host</div>
      <div className="col-xs-6">
        <TextInput label="Host address" value={address} onChange={setAddress} />
      </div>
      <div className="col-xs-6">
        <Button
          variant="primary"
          onClick={fetch}
          size="sm"
          style={{ marginTop: 32, minWidth: 80 }}
          loading={fetching}
        >
          Fetch
        </Button>
      </div>
      <div className="col-xs-12" style={{ minHeight: 150 }}>
        <div className="row">
          {heartBeatResult && <HeartBeatInfo data={heartBeatResult} />}
          {!!error && (
            <div className="col-xs-12">
              <span className="italic">{error}</span>
            </div>
          )}
        </div>
      </div>
      <div className="text-right col-xs-12">
        <Button
          onClick={submitHost}
          variant="primary"
          size="sm"
          style={{ marginRight: 10, minWidth: 80 }}
          loading={submitting}
          disabled={!heartBeatResult}
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

export default AddHostModal;
