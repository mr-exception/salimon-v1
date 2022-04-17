import { Body, Controller, Delete, Post, Req, Res } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ISignature } from 'datamodels/signature';
import { createHash } from 'crypto';
import {
  Signature,
  SignatureDocument,
  signatureResponse,
} from 'src/models/signature.schema';
import { Model } from 'mongoose';
import { Request, Response } from 'express';
import { CreateSignatureDTO, UpdateSignatureDTO } from './validators';
import { createEntity } from 'src/models/entity.schema';

@Controller('signatures')
export class SignaturesController {
  constructor(
    @InjectModel(Signature.name) private model: Model<SignatureDocument>,
  ) {}
  @Post('create')
  async createSignature(
    @Res() res: Response,
    @Body() body: CreateSignatureDTO,
  ) {
    const { secret, address, publicKey } = body;
    const signature = await this.model.findOne({ address });
    if (!!signature) {
      res.status(401).send({ message: 'this address is taken' });
    }
    const record = new this.model(
      createEntity({
        balance: 0,
        address,
        publicKey,
        secret: createHash('md5').update(secret).digest('base64'),
      }),
    );
    const result = await record.save();
    res.send(signatureResponse(result));
  }
  @Post('update')
  async updateSignature(
    @Req() req: Request,
    @Body() body: UpdateSignatureDTO,
  ): Promise<ISignature> {
    const signature = await this.model.findOne({
      secret: createHash('md5')
        .update(req.headers['x-secret'] as string)
        .digest('base64'),
      address: req.headers['x-address'],
    });
    signature.secret = createHash('md5').update(body.secret).digest('base64');
    signature.publicKey = body.publicKey;
    await signature.save();
    return signatureResponse(signature);
  }
  @Delete('delete')
  async deleteSignature(@Req() req: Request) {
    await this.model.deleteOne({
      secret: createHash('md5')
        .update(req.headers['x-secret'] as string)
        .digest('base64'),
      address: req.headers['x-address'],
    });
    return {
      message: 'signature removed successfully',
    };
  }
}
