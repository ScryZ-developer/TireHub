import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { TireSeason } from '@tirehub/shared';

export class CreateProductAttributeDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  width?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  profile?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  diameter?: number;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  pcd?: string;

  @IsOptional()
  @IsNumber()
  offsetEt?: number;

  @IsOptional()
  @IsEnum(TireSeason)
  season?: TireSeason;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  loadIndex?: string;

  @IsOptional()
  @IsString()
  @MaxLength(5)
  speedIndex?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  boltCount?: number;
}
