import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateGarageVehicleDto {
  @IsString()
  @MaxLength(100)
  brand!: string;

  @IsString()
  @MaxLength(100)
  model!: string;

  @IsInt()
  @Min(1900)
  @Max(2100)
  year!: number;

  @IsString()
  @MaxLength(30)
  tireSize!: string;

  @IsOptional()
  @IsDateString()
  installDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  nickname?: string;
}
