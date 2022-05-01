import { Axios } from "axios";

interface ICreateThreadDTO {
  members: {
    address: string;
    privateKey: string;
  }[];
  name: string;
  threadId: string;
}
export async function createThread(
  params: ICreateThreadDTO,
  axios: Axios
): Promise<boolean> {
  return axios.post("/threads/create", params).then(() => true);
}
