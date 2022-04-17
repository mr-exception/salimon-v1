import { IsNotEmpty } from 'class-validator';

export class CreateSignatureDTO {
  @IsNotEmpty()
  address: string;
  @IsNotEmpty()
  publicKey: string;
  @IsNotEmpty()
  secret: string;
}

export class UpdateSignatureDTO {
  @IsNotEmpty()
  publicKey: string;
  @IsNotEmpty()
  secret: string;
}
