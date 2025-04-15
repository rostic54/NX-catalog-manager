import {
  IsDateString,
  IsString,
  IsBoolean,
  IsOptional,
  IsArray,
  IsMongoId,
  IsNotEmpty,
} from 'class-validator';

export class UpdateAppointmentDto {
  @IsOptional()
  @IsDateString()
  readonly currentDate: string;

  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  readonly ownerId: string;

  @IsOptional()
  @IsString()
  readonly content: string;

  @IsOptional()
  @IsBoolean()
  readonly editable: boolean;

  @IsArray()
  @IsNotEmpty()
  @IsMongoId({ each: true })
  readonly attendees: string[];

  @IsOptional()
  @IsString()
  readonly preciseTime?: string;
}
