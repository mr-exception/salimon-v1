import { gql } from "@apollo/client";
import { IHeartBeat } from "datamodels/heartbeat";

export const GET_HEARTBEAT = gql`
  query GetHeartBeat($address: String!) {
    heartBeat(address: $address) {
      name
      serviceType
      time
      packetPrice
      commissionFee
    }
  }
`;
export interface IGetHeartbeat {
  heartBeat: IHeartBeat;
}
