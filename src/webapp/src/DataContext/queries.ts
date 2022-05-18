import { gql } from "@apollo/client";
import { IUpdate } from "datamodels/common";
import { IHeartBeat } from "datamodels/heartbeat";
import { IMessage } from "datamodels/message";
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

export const GET_MESSAGES = gql`
  query GetMessages($targetId: String!) {
    getMessages(targetId: $targetId, page: 1, pageSize: 100) {
      _id
      messageId
      dstAddress
      dataPath
      packetCount
      srcAddress
      packetsOrder
    }
    getMessagesCount(targetId: $targetId)
  }
`;

export interface IGetMessages {
  getMessages: IMessage[];
  getMessagesCount: number;
}
