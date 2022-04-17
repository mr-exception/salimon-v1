import {
  IMessage,
  IMessageData,
  IPacketGroup,
  MessageType,
} from "Structs/Message";
import { IPacket } from "Structs/Packet";
import { v4 as uuidV4 } from "uuid";
import Key from "Utils/Key";
import { sendPacket } from "API/Packets";
import { IHost } from "Structs/Host";

export function createMessageData(
  data: string,
  type: MessageType = "text"
): IMessageData {
  return {
    data,
    type,
  };
}

export function encryptMessage(
  data: IMessageData,
  src_key: Key,
  dst_key: Key
): string {
  const encrypted = dst_key.encryptPublic(
    src_key.encryptPrivate(JSON.stringify(data))
  );
  return encrypted;
}

export function decryptMessage(
  data: string,
  firstKey: Key,
  secondKey: Key
): Buffer {
  return secondKey.decryptPublic(firstKey.decryptPrivate(data).toString());
}

export function decryptRecvMessage(
  data: string,
  srcKey: Key,
  dstKey: Key
): IMessageData {
  return JSON.parse(decryptMessage(data, srcKey, dstKey).toString());
}
export function decryptSentMessage(
  data: string,
  srcKey: Key,
  dstKey: Key
): IMessageData {
  return JSON.parse(decryptMessage(data, dstKey, srcKey).toString());
}

const packetDataLenght = 2048;
export function messageToPackets(
  cipher: string,
  src: string,
  dst: string,
  msg_id: string
): IPacket[] {
  const result: IPacket[] = [];
  let offset = 0;
  let position = 0;
  const msg_count = Math.ceil(cipher.length / packetDataLenght);
  while (offset < cipher.length) {
    result.push({
      src,
      dst,
      msg_count,
      position,
      data: cipher.substring(offset, offset + packetDataLenght),
      msg_id,
      created_at: Date.now() / 1000,
    });
    offset += packetDataLenght;
    position += 1;
  }
  return result;
}

export async function sendMessage(
  src: string,
  dst: string,
  key: Key,
  data: string,
  relatedHosts: IHost[],
  type: MessageType = "text"
): Promise<void> {
  const messageData = createMessageData(data, type);
  const cipher = key.encryptPublic(JSON.stringify(messageData));
  const packets = messageToPackets(cipher, src, dst, uuidV4());
  await Promise.allSettled(
    packets.map((packet) => {
      return new Promise((resolve, reject) => {
        sendPacket(
          {
            msg_count: packet.msg_count,
            msg_id: packet.msg_id,
            dst: packet.dst,
            data: packet.data,
            position: packet.position,
          },
          {
            baseUrl: relatedHosts[0].url,
            address: src,
            secret: relatedHosts[0].secret,
          }
        )
          .then(resolve)
          .catch(reject);
      });
    })
  );
}

export function groupPacketsByMessage(packets: IPacket[]): IPacketGroup[] {
  const result: IPacketGroup[] = [];
  for (let i = 0; i < packets.length; i++) {
    let found = false;
    for (let j = 0; j < result.length; j++) {
      // console.log(result[i]);
      if (packets[i].msg_id === result[j].id) {
        result[j].packets.push(packets[i]);
        if (result[j].date > packets[i].created_at) {
          result[j].date = packets[i].created_at;
        }
        found = true;
        break;
      }
    }
    if (!found) {
      result.push({
        packets: [packets[i]],
        src: packets[i].src,
        dst: packets[i].dst,
        id: packets[i].msg_id,
        count: packets[i].msg_count,
        date: packets[i].created_at,
      });
    }
  }
  return result;
}

export function packetsToMessages(packets: IPacket[], key: Key): IMessage[] {
  const packetGroups = groupPacketsByMessage(packets);
  return packetGroups
    .map((group) => {
      if (group.packets.length < group.count) return undefined;
      const cipher = group.packets
        .sort((a, b) => a.position - b.position)
        .map((packet) => packet.data)
        .join("");
      const plain = JSON.parse(
        key.decryptPrivate(cipher).toString()
      ) as IMessageData;
      return {
        src: group.src,
        dst: group.dst,
        id: group.id,
        type: plain.type,
        data: plain.data,
        date: group.date,
      };
    })
    .filter((record) => !!record) as IMessage[];
}
