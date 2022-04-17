import { Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ISignature } from 'datamodels/signature';
import { Entity } from './entity.schema';

export type SignatureDocument = Signature & Document;

@Schema()
export class Signature extends Entity implements ISignature {
  @Prop(String)
  address: string;
  @Prop(String)
  publicKey: string;
  @Prop(String)
  secret: string;
}
