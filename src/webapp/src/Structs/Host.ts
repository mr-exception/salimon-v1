import { IAxiosConfigs } from "API/axios-inital";
import { weiToPweiFixed } from "Utils/currency";

export interface IHost {
  url: string;
  address: string;
  name: string;
  commission_fee: number;
  subscription_fee: number;
  paid_subscription: boolean;
  rt: number;
  secret: string;
  balance: number;
  subscription: number;
  last_fetched: number;
}

export interface IHeartBeat {
  name: string;
  address: string;
  commission_fee: number;
  subscription_fee: number;
  time: number;
  paid_subscription: boolean;
  balance: number;
  subscription: number;
}

export function subscriptionFee(host: IHost | IHeartBeat): string {
  if (!host.paid_subscription) {
    return "free";
  } else {
    return weiToPweiFixed(host.subscription_fee);
  }
}

export function createAxiosConfig(address: string, host: IHost): IAxiosConfigs {
  return {
    baseUrl: host.url,
    secret: host.secret,
    address,
  };
}
