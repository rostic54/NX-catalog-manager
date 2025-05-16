import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Prompt } from '../utils/types';

export class generateEventDetailsDto {
  @IsString()
  @IsOptional()
  readonly sessionId: string;

  @IsNotEmpty()
  readonly prompt: Prompt;
}
