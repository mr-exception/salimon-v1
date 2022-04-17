import { IChannel } from "Structs/Thread";
import { createAxios, IAxiosConfigs } from "./axios-inital";

export async function registerChannel(
  universal_id: string,
  key: string,
  member: string,
  configs: IAxiosConfigs
): Promise<boolean> {
  return createAxios(configs)
    .post("/api/channels/register", { universal_id, key, member })
    .then(() => true);
}
export async function unregisterChannel(
  universal_id: string,
  member: string,
  configs: IAxiosConfigs
): Promise<boolean> {
  return createAxios(configs)
    .delete(`/api/channels/unregister/${universal_id}/${member}`)
    .then(() => true);
}

interface IListChannelParams {
  universal_id: string;
  member: string;
  creator: string;
}
export async function list(
  params: IListChannelParams,
  configs: IAxiosConfigs
): Promise<IChannel[]> {
  return createAxios(configs)
    .get<{ data: IChannel[] }>(`/api/channels/list`, { params })
    .then((response) => response.data.data);
}
