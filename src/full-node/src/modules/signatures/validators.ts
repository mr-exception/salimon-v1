import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateSignatureDTO {
  @IsNotEmpty()
  @IsUUID()
  address: string;
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  publicKey: string;
  @IsNotEmpty()
  secret: string;
}

export class UpdateSignatureDTO {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  publicKey: string;
  @IsNotEmpty()
  secret: string;
}
