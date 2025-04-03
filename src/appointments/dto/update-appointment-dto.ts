import { IsDateString, IsString, IsBoolean, IsOptional } from 'class-validator';

export class UpdateAppointmentDto {
  @IsOptional()
  @IsDateString()
  readonly currentDate: string;

  @IsOptional()
  @IsString()
  readonly content: string;

  @IsOptional()
  @IsBoolean()
  readonly editable: boolean;

  @IsOptional()
  @IsString()
  readonly preciseTime?: string;
}
