import {
  IsNotEmpty,
  IsDateString,
  IsString,
  IsBoolean,
  IsOptional,
  IsMongoId,
  IsArray,
} from 'class-validator';

export class CreateAppointmentDto {
  @IsOptional()
  @IsMongoId()
  readonly id?: string;

  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  readonly ownerId: string;

  @IsNotEmpty()
  @IsDateString()
  readonly currentDate: string;

  @IsNotEmpty()
  @IsString()
  readonly content: string;

  @IsNotEmpty()
  @IsBoolean()
  readonly editable: boolean;

  @IsArray()
  @IsOptional()
  @IsMongoId({ each: true })
  readonly attendees: string[];

  @IsString()
  @IsOptional()
  readonly preciseTime?: string;
}
