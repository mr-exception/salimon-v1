import { Body, Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Message,
  MessageDocument,
  messageResponse,
} from 'src/models/message.schema';
import { Model } from 'mongoose';
import { Request, Response } from 'express';
import { SubmitMessageDTO } from './validators';
import { createEntity } from 'src/models/entity.schema';
import { FilesService } from 'src/files.service';
import { join } from 'path';
import { createReadStream, existsSync } from 'fs';

export function createMessageShortName(
  messageId: string,
  dstAddress: string,
): string {
  return `${dstAddress}-${messageId}`;
}

@Controller('messages')
export class MessagesController {
  constructor(
    @InjectModel(Message.name) private model: Model<MessageDocument>,
    private filesService: FilesService,
  ) {}
  @Post('submit')
  async createMessage(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: SubmitMessageDTO,
  ) {
    const { messageId, data, position, pckCount, dst } = body;
    const shortName = createMessageShortName(messageId, dst);
    const message = await this.model.findOne({ messageId });
    if (!message) {
      const record = new this.model(
        createEntity({
          dstAddress: dst,
          srcAddress: req.headers['x-address'],
          packetCount: pckCount,
          messageId,
          dataPath: shortName,
          packetsOrder: [position],
        }),
      );
      const result = await record.save();
      this.filesService.storeMessage(shortName, [data]);
      res.send(messageResponse(result));
      return;
    }
    message.packetsOrder.push(position);
    this.filesService.storeMessage(shortName, [data]);
    message.save();
    res.send(messageResponse(message));
  }
  @Get('get/:messageId')
  async getMessage(
    @Param('messageId') messageId: string,
    @Res() res: Response,
  ) {
    const path = join(process.cwd(), 'messages', messageId + '.txt');
    if (!existsSync(path)) {
      res.status(404).send({ message: 'message not found' });
      return;
    }
    const file = createReadStream(path);
    file.pipe(res);
  }
}
