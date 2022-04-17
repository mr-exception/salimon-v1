import React from "react";
import { IHeartBeat, subscriptionFee } from "Structs/Host";
import Moment from "moment";
import { weiToPweiFixed } from "Utils/currency";

interface IProps {
  data: IHeartBeat;
  responseTime: number;
}
const HeartBeatInfo: React.FC<IProps> = ({ data, responseTime }: IProps) => {
  function serviceTime(): string {
    const moment = Moment(data.time * 1000);
    return moment.format("Y/MM/DD HH:mm");
  }
  return (
    <div className="col-md-12">
      <div className="row">
        <div className="col-md-12 font-bold">Host node successfully found!</div>
        <div className="col-md-11 col-md-offset-1 text-sm italic">Host name: {data.name}</div>
        <div className="col-md-11 col-md-offset-1 text-sm italic">
          Contract commission fee: {weiToPweiFixed(data.commission_fee)}
        </div>
        <div className="col-md-11 col-md-offset-1 text-sm italic">Subscription fee: {subscriptionFee(data)}</div>
        <div className="col-md-11 col-md-offset-1 text-sm italic">Service time: {serviceTime()}</div>
        <div className="col-md-11 col-md-offset-1 text-sm italic">Balance: {weiToPweiFixed(data.balance)}</div>
        <div className="col-md-11 col-md-offset-1 text-sm italic">Subscription: {data.subscription} packets</div>
        <div className="col-md-11 col-md-offset-1 text-sm italic">Response time: {responseTime}ms</div>
      </div>
    </div>
  );
};

export default HeartBeatInfo;
