import React from "react";
import { IHeartBeat } from "datamodels/heartbeat";
import Moment from "moment";

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
        <div className="font-bold col-md-12">Host node successfully found!</div>
        <div className="text-sm italic col-md-11 col-md-offset-1">
          Host name: {data.name}
        </div>
        <div className="text-sm italic col-md-11 col-md-offset-1">
          Contract commission fee: {data.commissionFee} kp
        </div>
        <div className="text-sm italic col-md-11 col-md-offset-1">
          Service time: {serviceTime()}
        </div>
        <div className="text-sm italic col-md-11 col-md-offset-1">
          Packet price: {data.packetPrice} wei for each 1kp
        </div>
        <div className="text-sm italic col-md-11 col-md-offset-1">
          Response time: {responseTime}ms
        </div>
      </div>
    </div>
  );
};

export default HeartBeatInfo;
