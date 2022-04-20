import { IsMongoId, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateThreadDTO {
  @IsNotEmpty()
  members: {
    address: string;
    privateKey: string;
  }[];
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  @IsUUID()
  threadId: string;
}

export class UpdateThreadDTO {
  @IsNotEmpty()
  @IsMongoId()
  id: string;
  @IsNotEmpty()
  members: {
    address: string;
    privateKey: string;
  }[];
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  @IsUUID()
  threadId: string;
}
