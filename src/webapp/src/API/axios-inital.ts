import axios, { Axios } from "axios";
export function createAxios(
  baseURL: string,
  address: string,
  secret: string
): Axios {
  return axios.create({
    baseURL,
    headers: {
      accept: "application/json",
      "x-address": address,
      "x-secret": secret,
    },
  });
}
