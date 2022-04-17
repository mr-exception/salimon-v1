export function weiToKwei(value: number): number {
  return value / 1000;
}
export function weiToKweiFixed(value: number, fixed: number = 3): string {
  return weiToKwei(value).toFixed(fixed) + " KWei";
}
export function weiToMwei(value: number): number {
  return weiToKwei(value) / 1000;
}
export function weiToMweiFixed(value: number, fixed: number = 3): string {
  return weiToMwei(value).toFixed(fixed) + "MWei";
}
export function weiToGwei(value: number): number {
  return weiToMwei(value) / 1000;
}
export function weiToGweiFixed(value: number, fixed: number = 3): string {
  return weiToGwei(value).toFixed(fixed) + " GWei";
}
export function weiToTwei(value: number): number {
  return weiToGwei(value) / 1000;
}
export function weiToTweiFixed(value: number, fixed: number = 3): string {
  return weiToTwei(value).toFixed(fixed) + " TWei";
}
export function weiToPwei(value: number): number {
  return weiToTwei(value) / 1000;
}
export function weiToPweiFixed(value: number, fixed: number = 3): string {
  return weiToPwei(value).toFixed(fixed) + " PWei";
}
