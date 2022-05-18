import { Axios } from "axios";
import { IMessage } from "datamodels/message";
import { IPacket } from "Structs/Packet";

interface ISendPacketParams {
  messageId: string;
  data: string;
  dst: string;
  position: number;
  pckCount: number;
}
export async function sendPacket(
  params: ISendPacketParams,
  axios: Axios
): Promise<IPacket> {
  return axios
    .post<IPacket>("messages/submit", params)
    .then((response) => response.data);
}

export async function getMessage(
  messageId: string,
  axios: Axios
): Promise<string> {
  return axios
    .get<string>("/messages/get/" + messageId)
    .then((response) => response.data);
}
