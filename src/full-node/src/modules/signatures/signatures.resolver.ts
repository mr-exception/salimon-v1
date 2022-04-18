import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Query as MonoQuery } from 'mongoose';
import { ISignature } from 'datamodels/signature';
import {
  Signature,
  SignatureDocument,
  signatureResponse,
} from 'src/models/signature.schema';

@Resolver()
export class SignaturesResolver {
  constructor(
    @InjectModel(Signature.name) private model: Model<SignatureDocument>,
  ) {}

  @Query(() => [Signature])
  async getSignatures(
    @Args('balanceMin', { type: () => Int, nullable: true }) balanceMin: number,
    @Args('balanceMax', { type: () => Int, nullable: true }) balanceMax: number,
    @Args('address', { type: () => String, nullable: true }) address: string,
    @Args('page', { type: () => Int, nullable: true, defaultValue: 1 })
    page: number,
    @Args('pageSize', { type: () => Int, nullable: true, defaultValue: 10 })
    pageSize: number,
  ): Promise<ISignature[]> {
    const queryInstance = generateQuery(address, balanceMin, balanceMax);

    const signatures = await this.model
      .find(queryInstance.getQuery())
      .limit(pageSize)
      .skip((page - 1) * pageSize);
    return signatures.map(signatureResponse);
  }

  @Query(() => Number)
  async getSignaturesCount(
    @Args('balanceMin', { type: () => Int, nullable: true }) balanceMin: number,
    @Args('balanceMax', { type: () => Int, nullable: true }) balanceMax: number,
    @Args('address', { type: () => String, nullable: true }) address: string,
  ): Promise<number> {
    const queryInstance = generateQuery(address, balanceMin, balanceMax);
    const count = await this.model.find(queryInstance.getQuery()).count();
    return count;
  }
}

function generateQuery(
  address?: string,
  balanceMin?: number,
  balanceMax?: number,
) {
  let queryInstance = new MonoQuery();
  if (address) {
    queryInstance = queryInstance.where('address').equals(address);
  }
  if (balanceMin) {
    queryInstance = queryInstance.where('balance').gt(balanceMin);
  }
  if (balanceMax) {
    queryInstance = queryInstance.where('balance').lt(balanceMax);
  }
  return queryInstance;
}
