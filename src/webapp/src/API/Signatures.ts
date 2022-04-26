import axios from "axios";

interface ICreateSignatureDTO {
  name: string;
  secret: string;
  address: string;
  publicKey: string;
}
export async function createSignature(
  baseURL: string,
  params: ICreateSignatureDTO
): Promise<boolean> {
  return axios.post("/signatures/create", params, { baseURL }).then(() => true);
}

interface IUpdateSecretDTO {
  current_secret: string;
  new_secret: string;
  address: string;
  public_key: string;
}
export async function updateSecret(
  baseURL: string,
  params: IUpdateSecretDTO
): Promise<boolean> {
  return axios.post("/signatures/update", params, { baseURL }).then(() => true);
}

interface IDestroySecretDTO {
  secret: string;
  address: string;
}
export async function destroySecret(
  baseURL: string,
  params: IDestroySecretDTO
): Promise<boolean> {
  return axios
    .delete("/signatures/delete", {
      baseURL,
      headers: { "x-address": params.address, "x-secret": params.secret },
    })
    .then(() => true);
}
