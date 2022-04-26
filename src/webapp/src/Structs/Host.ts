import { IAxiosConfigs } from "API/axios-inital";
import { weiToPweiFixed } from "Utils/currency";
import { IHeartBeat } from "datamodels/heartbeat";

export interface IHost extends IHeartBeat {
  url: string;
  rt: number;
  secret: string;
  lastFetched: number;
}

export function subscriptionFee(host: IHost | IHeartBeat): string {
  if (host.packetPrice === 0) {
    return "free";
  } else {
    return weiToPweiFixed(host.packetPrice);
  }
}

export function createAxiosConfig(address: string, host: IHost): IAxiosConfigs {
  return {
    baseUrl: host.url,
    secret: host.secret,
    address,
  };
}
