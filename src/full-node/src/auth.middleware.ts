import { Injectable, NestMiddleware } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import { Signature, SignatureDocument } from './models/signature.schema';
import { createHash } from 'crypto';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    @InjectModel(Signature.name) private model: Model<SignatureDocument>,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const secret = req.headers['x-secret'] as string;
    const address = req.headers['x-address'] as string;
    if (!secret) {
      return res.status(401).send({
        message: 'unauthorized',
      });
    }
    const result = await this.model.findOne({
      secret: createHash('md5').update(secret).digest('base64'),
      address,
    });
    if (!result)
      return res.status(401).send({
        message: 'unauthorized',
      });
    next();
  }
}
