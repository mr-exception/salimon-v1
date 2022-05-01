import { Axios } from "axios";
import { IPacket } from "Structs/Packet";

interface ISendPacketParams {
  dst: string;
  data: string;
  position: number;
  msg_count: number;
  msg_id: string;
}
export async function sendPacket(
  params: ISendPacketParams,
  axios: Axios
): Promise<IPacket> {
  return axios
    .post<IPacket>("api/packets/send", params)
    .then((response) => response.data);
}

interface IFetchPacketsParam {
  thread?: string;
  dst?: string;
  src?: string;
  position?: number;
  msg_count?: number;
  msg_id?: string;
  from?: string;
  to?: string;
  page?: number;
  pageSize?: number;
}
export async function fetchPackets(
  params: IFetchPacketsParam,
  axios: Axios
): Promise<IPacket[]> {
  return axios
    .get<{ data: IPacket[] }>("/packets/fetch", { params })
    .then((response) => response.data.data);
}
