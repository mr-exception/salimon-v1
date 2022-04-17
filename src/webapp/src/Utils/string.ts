import Moment from "moment";

export function randomString(length: number): string {
  const chars = "1234567890qwertyuiopasdfghjklzxcvbnm!@#$%^&*()_+=,.";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

export function timestampToDateTime(value: number): string {
  const moment = Moment(value * 1000);
  return moment.format("Y/MM/DD HH:mm");
}
