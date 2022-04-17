import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Signature, SignatureDocument } from '../../models/signature.schema';
import { CreateSignatureDTO } from './validators';
import { createEntity } from 'src/models/entity.schema';

@Injectable()
export class SignaturesService {
  constructor(
    @InjectModel(Signature.name) private model: Model<SignatureDocument>,
  ) {}

  async create(createCatDto: CreateSignatureDTO): Promise<Signature> {
    const createdCat = new this.model(
      createEntity({
        balance: 0,
        ...createCatDto,
      }),
    );
    return createdCat.save();
  }
}
