import { gql } from "@apollo/client";
import { IUpdate } from "datamodels/common";
import { IHeartBeat } from "datamodels/heartbeat";
import { IThread } from "datamodels/thread";
export const GET_UPDATES = gql`
  query GetHeartBeat($address: String!, $page: Int, $pageSize: Int) {
    heartBeat(address: $address) {
      name
      serviceType
      time
      packetPrice
      commissionFee
      balance
    }
    getThreads(member: $address, page: $page, pageSize: $pageSize) {
      _id
      createdAt
      updatedAt
      members {
        address
        privateKey
      }
      name
      threadId
      ownerAddress
    }
    getThreadsCount(member: $address)
  }
`;
export interface IGetUpdates {
  heartBeat: IHeartBeat;
  getThreads: IThread[];
  getThreadsCount: number;
}

export const SUB_TO_UPDATES = gql`
  subscription SubToUpdates($address: String!) {
    subToUpdates(address: $address) {
      type
      thread {
        _id
        createdAt
        updatedAt
        members {
          address
          privateKey
        }
        name
        threadId
        ownerAddress
      }
    }
  }
`;

export interface ISubToUpdates {
  subToUpdates: IUpdate;
}
