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
    const { name, members } = body;
    const record = new this.model(
      createEntity({
        members,
        name,
        ownerAddress: req.headers['x-address'],
      }),
    );
    const result = await record.save();
    res.send(messageResponse(result));
  }
}
