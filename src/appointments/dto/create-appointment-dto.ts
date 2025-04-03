import {
  IsNotEmpty,
  IsDateString,
  IsString,
  IsBoolean,
  IsOptional,
  IsMongoId,
} from 'class-validator';

export class CreateAppointmentDto {
  @IsOptional()
  @IsMongoId()
  readonly id?: string;

  @IsNotEmpty()
  @IsDateString()
  readonly currentDate: string;

  @IsNotEmpty()
  @IsString()
  readonly content: string;

  @IsNotEmpty()
  @IsBoolean()
  readonly editable: boolean;

  @IsString()
  @IsOptional()
  readonly preciseTime?: string;
}
