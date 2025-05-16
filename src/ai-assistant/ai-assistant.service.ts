import {
  ChatSession,
  GenerativeModel,
  GoogleGenerativeAI,
} from '@google/generative-ai';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 } from 'uuid';
import { ResponseAiAssistantDto } from './dto/response-ai-assitant.dto';
import { generateEventDetailsDto } from './dto/generate-event-details.dto';
import {
  getPromptTemplate,
  getTitleSuggestions,
  imageUrlPrompt,
} from './utils/prompt-templates';
import { normalizeValue } from 'src/shared/utils/helpers';
import { MeetingDetailedInfo, TitleSuggestions } from './utils/types';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';

interface AiAssistant {
  sessionId: string;
  chat: ChatSession;
}

const GEMINI_MODEL = 'gemini-2.0-flash';

@Injectable()
export class AiAssistantService {
  private readonly googleAI: GoogleGenerativeAI;
  private readonly model: GenerativeModel;
  private readonly chatSessionId: { [sessionId: string]: ChatSession } = {};
  private readonly logger = new Logger(AiAssistantService.name);
  private readonly requestCacher = new Map();
  private readonly maxRetries = 3;

  constructor(
    private configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not defined in environment variables');
    }
    console.log('API KEY:', apiKey);
    this.googleAI = new GoogleGenerativeAI(apiKey);
    this.model = this.googleAI.getGenerativeModel({
      model: GEMINI_MODEL,
      generationConfig: {
        temperature: 0.5,
        maxOutputTokens: 512,
        responseMimeType: 'application/json',
      },
    });
  }

  private getChatSessionId(sessionId: string | null): AiAssistant {
    if (!sessionId) {
      sessionId = v4();
    }
    if (!this.chatSessionId[sessionId]) {
      this.chatSessionId[sessionId] = this.model.startChat();
    }
    return {
      sessionId,
      chat: this.chatSessionId[sessionId],
    };
  }

  async generateResponse(
    data: generateEventDetailsDto,
  ): Promise<ResponseAiAssistantDto> {
    try {
      const { sessionId, chat } = this.getChatSessionId(data.sessionId);

      // Cache manager TODO: Move to separate service or install cacheManager
      const cacheTarget = normalizeValue(data.prompt.targetItem);
      const cacheType = normalizeValue(data.prompt.subTopic);
      let cacheKey = '';
      if (!cacheTarget || !cacheType) {
        cacheKey = cacheType ? `${cacheType}` : `${cacheTarget}`;
      } else {
        cacheKey = `${cacheType}_${cacheTarget}`;
      }
      const cacheResult = this.requestCacher.has(cacheKey);

      if (cacheResult) {
        const cachedResult = this.requestCacher.get(
          `${cacheType}_${cacheTarget}`,
        ) as string;
        return {
          sessionId,
          result: JSON.parse(cachedResult) as MeetingDetailedInfo,
        };
      }

      const prompt = getPromptTemplate(data.prompt, data.sessionId);
      console.log('PROMPT:', prompt);
      const result = await chat.sendMessage(prompt);
      const responseText = result.response ? result.response.text() : '';
      const parsedResponse = JSON.parse(responseText) as MeetingDetailedInfo;
      let base64Image = '';
      if (parsedResponse.image) {
        base64Image = await this.fetchAiGenerateEventDetailsWithRetries(
          chat,
          parsedResponse.image.split('?')[0],
          data,
        );
        parsedResponse.image = base64Image;
      }

      this.requestCacher.set(cacheKey, JSON.stringify(parsedResponse));

      this.logger.log(`Response: ${responseText}`);
      return {
        sessionId,
        result: parsedResponse,
      };
    } catch (error) {
      this.logger.error('Error generating response:', error);
      throw new Error('Failed to generate response');
    }
  }
  async generateTitleSuggestions(
    data: generateEventDetailsDto,
  ): Promise<ResponseAiAssistantDto> {
    try {
      const { sessionId, chat } = this.getChatSessionId(data.sessionId);

      const prompt = getTitleSuggestions(data.prompt, sessionId);
      console.log('TITLES PROMPT:', prompt);
      const result = await chat.sendMessage(prompt);
      const responseText = result.response ? result.response.text() : '';

      this.logger.log(`Response: ${responseText}`);
      return {
        sessionId,
        result: JSON.parse(responseText) as TitleSuggestions,
      };
    } catch (error) {
      this.logger.error('Error generating response:', error);
      throw new Error('Failed to generate response');
    }
  }

  /**
   *  HELPERS
   */

  private async downloadAndConvertToBase64(url: string): Promise<string> {
    if (!url || !url.match(/\.(jpg|jpeg|png|gif)$/i)) {
      throw new Error('Invalid image URL');
    }

    try {
      const response = await lastValueFrom(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        this.httpService.get(url, { responseType: 'arraybuffer' }),
      );
      const buffer = Buffer.from(response.data);

      if (buffer.length === 0) {
        throw new Error('Empty image data');
      }

      // Determine MIME type (simplified; use 'file-type' for accuracy)
      const mimeType = url.endsWith('.png') ? 'image/png' : 'image/jpeg';
      return `data:${mimeType};base64,${buffer.toString('base64')}`;
    } catch (error) {
      throw new Error(`Failed to download image: ${error.message}`);
    }
  }

  private async fetchAiGenerateEventDetailsWithRetries(
    chat: ChatSession,
    imageUrl: string,
    data: generateEventDetailsDto,
  ): Promise<string> {
    let attempts = 0;
    let lastError: Error | null = null;

    while (attempts < this.maxRetries) {
      attempts++;
      try {
        if (attempts > 1) {
          const result = await chat.sendMessage(imageUrlPrompt(data.prompt));
          const responseText = result.response ? result.response.text() : '';
          imageUrl = JSON.parse(responseText) as string;
        }
        // const result = await chat.sendMessage(prompt);

        // const geminiData = JSON.parse((await response).response.text());
        // if (
        //   !geminiData.facts ||
        //   !geminiData.stats ||
        //   !geminiData.summary ||
        //   !geminiData.image
        // ) {
        //   throw new Error('Invalid Gemini response format');
        // }

        // if (!geminiData.image.match(/\.(jpg|jpeg|png|gif)$/i)) {
        //   throw new Error('Invalid image URL format');
        // }
        await this.testImageDownload(imageUrl);

        return await this.downloadAndConvertToBase64(imageUrl);
      } catch (error) {
        lastError = error as Error;
        console.warn(
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          `[${imageUrl}] Attempt ${attempts} failed: ${error.message}`,
        );
        if (attempts === this.maxRetries) {
          throw new BadRequestException(
            `[${imageUrl}] Failed to fetch valid Gemini response after ${this.maxRetries} attempts: ${lastError.message}`,
          );
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    throw new BadRequestException('Unexpected error: No attempts made');
  }

  private async testImageDownload(url: string): Promise<void> {
    try {
      const response = await lastValueFrom(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        this.httpService.get(url, { responseType: 'arraybuffer' }),
      );
      const buffer = Buffer.from(response.data);
      if (buffer.length === 0) {
        throw new Error('Empty image data');
      }
    } catch (error) {
      throw new Error(`Image download failed: ${error.message}`);
    }
  }
}
