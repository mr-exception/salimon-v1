import { IsMongoId, IsNotEmpty } from 'class-validator';

export class CreateThreadDTO {
  @IsNotEmpty()
  members: string[];
  @IsNotEmpty()
  name: string;
}

export class UpdateThreadDTO {
  @IsNotEmpty()
  @IsMongoId()
  id: string;
  @IsNotEmpty()
  members: string[];
  @IsNotEmpty()
  name: string;
}
