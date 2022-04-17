import moment from "moment";

export const generateDateString = (timestamps: number) => {
  const date = new Date(timestamps);
  return `${date.getHours()}:${date.getMinutes()}`;
};
export const timstampsToRelativeString = (timestamps: number) => {
  const now = Date.now() / 1000;
  if (now - timestamps < 24 * 3600) {
    return moment.unix(timestamps).fromNow();
  }
  return moment.unix(timestamps).format("MMM Do YYYY");
};
