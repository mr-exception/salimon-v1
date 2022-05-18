import { gql } from "@apollo/client";
import { IMessage } from "datamodels/message";

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
