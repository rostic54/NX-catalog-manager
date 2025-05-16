import { IsNotEmpty, IsString } from 'class-validator';
import { MeetingDetailedInfo, TitleSuggestions } from '../utils/types';

export class ResponseAiAssistantDto {
  @IsString()
  @IsNotEmpty()
  readonly sessionId: string;

  @IsNotEmpty()
  readonly result: string | MeetingDetailedInfo | TitleSuggestions;
}
