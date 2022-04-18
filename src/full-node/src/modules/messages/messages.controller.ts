import { Body, Controller, Delete, Post, Req, Res } from '@nestjs/common';
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

@Controller('messages')
export class MessagesController {
  constructor(
    @InjectModel(Message.name) private model: Model<MessageDocument>,
  ) {}
  @Post('submit')
  async createMessage(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: SubmitMessageDTO,
  ) {
    const { messageId, data, position, pckCount, dst } = body;
    const message = await this.model.findOne({ messageId });
    if (!message) {
      const record = new this.model(
        createEntity({
          dstAddress: dst,
          srcAddress: req.headers['x-address'],
          packetCount: pckCount,
          messageId,
          data: [{ position, dataPath: data }],
        }),
      );
      const result = await record.save();
      res.send(messageResponse(result));
      return;
    }
    message.data.push({ position, dataPath: data });
    message.save();
    res.send(messageResponse(message));
  }
}
