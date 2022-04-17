export interface IPacket {
  src: string;
  dst: string;
  data: string;
  msg_id: string;
  msg_count: number;
  position: number;
  created_at: number;
}
