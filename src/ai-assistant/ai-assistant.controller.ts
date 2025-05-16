import { Body, Controller, Post } from '@nestjs/common';
import { generateEventDetailsDto } from './dto/generate-event-details.dto';
import { AiAssistantService } from './ai-assistant.service';
import { ResponseAiAssistantDto } from './dto/response-ai-assitant.dto';

@Controller('ai-assistant')
export class AiAssistantController {
  constructor(private aiAssistantService: AiAssistantService) {}

  @Post()
  async askAssistant(
    @Body() req: generateEventDetailsDto,
  ): Promise<ResponseAiAssistantDto> {
    // Handle the request here
    return this.aiAssistantService.generateResponse(req);
  }

  @Post('titles')
  async askTitlesToAssistant(
    @Body() req: generateEventDetailsDto,
  ): Promise<ResponseAiAssistantDto> {
    // Handle the request here
    return this.aiAssistantService.generateTitleSuggestions(req);
  }
}
