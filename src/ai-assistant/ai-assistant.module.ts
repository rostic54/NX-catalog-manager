import { Module } from '@nestjs/common';
import { AiAssistantController } from './ai-assistant.controller';
import { AiAssistantService } from './ai-assistant.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [AiAssistantController],
  imports: [HttpModule],
  providers: [AiAssistantService],
})
export class AiAssistantModule {}
