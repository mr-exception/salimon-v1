import { IsNotEmpty, IsUUID } from 'class-validator';

export class SubmitMessageDTO {
  @IsNotEmpty()
  @IsUUID()
  messageId: string;
  @IsNotEmpty()
  members: string[];
  @IsNotEmpty()
  name: string;
}
