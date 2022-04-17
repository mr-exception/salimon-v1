import axios from "axios";

interface ICheckAddressList {
  addresses: string[];
}
export async function checkAddressList(
  baseURL: string,
  params: ICheckAddressList
): Promise<{ [key: string]: { public_key: string; active_at: number } }> {
  return axios
    .get<{ [key: string]: { public_key: string; active_at: number } }>("/api/addresses/check-list", { baseURL, params })
    .then((response) => response.data);
}
