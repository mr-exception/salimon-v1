import axios, { Axios } from "axios";

export interface IAxiosConfigs {
  baseUrl: string;
  address: string;
  secret: string;
}
export function createAxios(configs: IAxiosConfigs): Axios {
  return axios.create({
    baseURL: configs.baseUrl,
    headers: {
      accept: "application/json",
      "x-address": configs.address,
      "x-secret": configs.secret,
    },
  });
}
