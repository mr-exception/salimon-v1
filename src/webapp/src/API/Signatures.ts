import axios from "axios";

interface ICreateSecretParam {
  secret: string;
  address: string;
  public_key: string;
}
export async function createSignature(baseURL: string, params: ICreateSecretParam): Promise<boolean> {
  return axios.post("/api/signatures/create", params, { baseURL }).then(() => true);
}

interface IUpdateSecretParam {
  current_secret: string;
  new_secret: string;
  address: string;
  public_key: string;
}
export async function updateSecret(baseURL: string, params: IUpdateSecretParam): Promise<boolean> {
  return axios.post("/api/signatures/update", params, { baseURL }).then(() => true);
}

interface IDestroySecretParam {
  secret: string;
  address: string;
}
export async function destroySecret(baseURL: string, params: IDestroySecretParam): Promise<boolean> {
  return axios.post("/api/signatures/destroy", params, { baseURL }).then(() => true);
}
