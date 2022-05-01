import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ISignature } from 'datamodels/signature';
import { Entity } from './entity.schema';
import { Field, ObjectType } from '@nestjs/graphql';

export type SignatureDocument = Signature & Document;

@Schema()
@ObjectType()
export class Signature extends Entity implements ISignature {
  @Prop(String)
  @Field()
  address: string;
  @Prop(String)
  @Field()
  publicKey: string;
  @Prop(String)
  @Field()
  name: string;
  @Prop(String)
  @Field()
  secret: string;
  @Prop(Number)
  @Field()
  balance: number;
  @Prop(Number)
  @Field()
  activeAt: number;
}

export const SignatureSchema = SchemaFactory.createForClass(Signature);

export function signatureResponse(signature: Signature): ISignature {
  return {
    _id: signature._id,
    name: signature.name,
    activeAt: signature.activeAt,
    address: signature.address,
    publicKey: signature.publicKey,
    balance: signature.balance,
    secret: signature.secret,
    createdAt: signature.createdAt,
    updatedAt: signature.updatedAt,
  };
}
