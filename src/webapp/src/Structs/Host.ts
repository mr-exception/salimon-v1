import { weiToPweiFixed } from "Utils/currency";
import { IHeartBeat } from "datamodels/heartbeat";

export interface IHost extends IHeartBeat {
  url: string;
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
