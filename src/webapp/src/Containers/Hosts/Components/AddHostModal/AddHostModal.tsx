import { heartBeat } from "API/ACK";
import { createSignature } from "API/Signatures";
import { AuthContext } from "AuthContextProvider";
import { AxiosError } from "axios";
import { HostsContext } from "DataContext/HostsContextProvider";
import React, { useContext, useState } from "react";
import { IHeartBeat, IHost } from "Structs/Host";
import Button from "Ui-Kit/Button/Button";
import TextInput from "Ui-Kit/Inputs/TextInput/TextInput";
import { randomString } from "Utils/string";
import HeartBeatInfo from "./Components/HeartBeatInfo";

interface IProps {
  close: () => void;
}
const AddHostModal: React.FC<IProps> = ({ close }: IProps) => {
  const authContext = useContext(AuthContext);
  const hostsContext = useContext(HostsContext);
  const [address, setAddress] = useState<string>();
  const [heartBeatResult, setHeartBeatResult] = useState<IHeartBeat>();
  const [responseTime, setResponseTime] = useState(0);

  const [fetching, setFetching] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  async function fetch() {
    setFetching(true);
    setHeartBeatResult(undefined);
    setError(undefined);
    const rt = Date.now();
    try {
      const result = await heartBeat(address || "", authContext.address);
      setHeartBeatResult(result);
      setResponseTime(Date.now() - rt);
    } catch (err) {
      setError((err as AxiosError).message);
    } finally {
      setFetching(false);
    }
  }

  const [submitting, setSubmitting] = useState(false);
  async function submitHost() {
    if (!heartBeatResult || !address) return;
    setSubmitting(true);
    const secret = randomString(32);
    try {
      await createSignature(address, {
        secret,
        address: authContext.address,
        public_key: authContext.key.getPublicKey(),
      });
      const host: IHost = {
        url: address,
        address: heartBeatResult.address,
        name: heartBeatResult.name,
        commission_fee: heartBeatResult.commission_fee,
        subscription_fee: heartBeatResult.subscription_fee,
        paid_subscription: heartBeatResult.paid_subscription,
        rt: responseTime,
        secret,
        balance: heartBeatResult.balance,
        subscription: heartBeatResult.subscription,
        last_fetched: 0,
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
  // 0xf37dfafe1a8447395fef43b5ed67901aa4a14c4a
  return (
    <div className="row">
      <div className="col-xs-12 font-bold text-lg">Add new host</div>
      <div className="col-xs-6">
        <TextInput label="Host address" value={address} onChange={setAddress} />
      </div>
      <div className="col-xs-6">
        <Button variant="primary" onClick={fetch} size="sm" style={{ marginTop: 32, minWidth: 80 }} loading={fetching}>
          Fetch
        </Button>
      </div>
      <div className="col-xs-12" style={{ minHeight: 150 }}>
        <div className="row">
          {heartBeatResult && <HeartBeatInfo data={heartBeatResult} responseTime={responseTime} />}
          {!!error && (
            <div className="col-xs-12">
              failed to get ack info: <span className="italic">{error}</span>
            </div>
          )}
        </div>
      </div>
      <div className="col-xs-12 text-right">
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
        <Button onClick={close} variant="warning" size="sm" style={{ minWidth: 80 }}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default AddHostModal;
