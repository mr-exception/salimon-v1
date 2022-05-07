import { Body, Controller, Delete, Post, Req, Res } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Thread,
  ThreadDocument,
  threadResponse,
} from 'src/models/thread.schema';
import { Model } from 'mongoose';
import { Request, Response } from 'express';
import { CreateThreadDTO, UpdateThreadDTO } from './validators';
import { createEntity } from 'src/models/entity.schema';
import { pubsub } from 'src/publish-center';

@Controller('threads')
export class ThreadsController {
  constructor(@InjectModel(Thread.name) private model: Model<ThreadDocument>) {}
  @Post('create')
  async createThread(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: CreateThreadDTO,
  ) {
    const { name, members, threadId } = body;
    if (await this.model.findOne({ threadId })) {
      res.status(403).send({ message: 'this thread is already registered' });
      return;
    }
    const record = new this.model(
      createEntity({
        threadId,
        members,
        name,
        ownerAddress: req.headers['x-address'],
      }),
    );
    const result = await record.save();
    pubsub.publish('subToUpdates', {
      subToUpdates: { type: 'threadCreated', thread: threadResponse(result) },
    });
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
