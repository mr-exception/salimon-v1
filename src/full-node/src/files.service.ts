import { Injectable } from '@nestjs/common';
import { appendFileSync, writeFileSync } from 'fs';

@Injectable()
export class FilesService {
  storeFile(path: string, content: string, append = true) {
    if (!!append) {
      appendFileSync(path, content);
    } else {
      writeFileSync(path, content);
    }
  }
  storePacket(path: string, content: string) {
    this.storeFile(path, content + '\n', true);
  }
  storeMessage(shortName: string, packets: string[]) {
    packets.forEach((content) =>
      this.storePacket(`./messages/${shortName}.txt`, content),
    );
  }
}
