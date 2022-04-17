import { IHeartBeat } from "Structs/Host";
import axios from "axios";

/**
 * returns basic information about node by it's url
 * @param url
 * @returns
 */
export async function heartBeat(url: string, address: string): Promise<IHeartBeat> {
  return axios.get<IHeartBeat>(url + "/api/heart-beat/" + address).then((response) => response.data);
}
