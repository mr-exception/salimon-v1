import { Body, Controller, Delete, Post, Req, Res } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IThread } from 'datamodels/thread';
import { createHash } from 'crypto';
import {
  Thread,
  ThreadDocument,
  threadResponse,
} from 'src/models/thread.schema';
import { Model } from 'mongoose';
import { Request, Response } from 'express';
import { CreateThreadDTO, UpdateThreadDTO } from './validators';
import { createEntity } from 'src/models/entity.schema';
import mongoose from 'mongoose';

@Controller('threads')
export class ThreadsController {
  constructor(@InjectModel(Thread.name) private model: Model<ThreadDocument>) {}
  @Post('create')
  async createThread(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: CreateThreadDTO,
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
    res.send(threadResponse(result));
  }
  @Post('update')
  async updateThread(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: UpdateThreadDTO,
  ) {
    const thread = await this.model.findOne({
      ownerAddress: req.headers['x-address'],
      _id: body.id,
    });
    if (!thread) {
      res.status(404).send({
        message: 'entity not found',
      });
      return;
    }
    thread.name = body.name;
    thread.members = body.members;
    thread.name = body.name;
    await thread.save();
    res.send(threadResponse(thread));
  }
  @Delete('delete/:id')
  async deleteThread(@Req() req: Request) {
    await this.model.deleteOne({
      ownerAddress: req.headers['x-address'],
      _id: req.params.id,
    });
    return {
      message: 'thread removed successfully',
    };
  }
}
