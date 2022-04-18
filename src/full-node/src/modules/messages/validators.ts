import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class SubmitMessageDTO {
  @IsNotEmpty()
  @IsUUID()
  messageId: string;
  @IsNotEmpty()
  data: string;
  @IsNotEmpty()
  @IsUUID()
  dst: string;
  @IsNotEmpty()
  @IsNumber()
  pckCount: number;
  @IsNotEmpty()
  @IsNumber()
  position: number;
}
