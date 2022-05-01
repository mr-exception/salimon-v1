import { gql } from "@apollo/client";
import { ISignature } from "datamodels/signature";
export const GET_SIGNATURES = gql`
  query GetSignatures($address: String) {
    getSignatures(address: $address) {
      _id
      createdAt
      updatedAt
      address
      publicKey
      name
      secret
      balance
      activeAt
    }
  }
`;
export interface IGetSignatures {
  getSignatures: ISignature[];
}
