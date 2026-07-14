import {
  IsArray,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';
import {
  ProductType,
  ListingCondition,
  ListingStatus,
  TireSeason,
} from '@tirehub/shared';

export class CreateListingDto {
  @IsUUID()
  sellerId!: string;

  @IsString()
  @MaxLength(255)
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(ProductType)
  type!: ProductType;

  @IsEnum(ListingCondition)
  condition!: ListingCondition;

  @IsNumber()
  @Min(0)
  price!: number;

  @IsInt()
  @Min(1)
  quantity!: number;

  @IsString()
  @MaxLength(100)
  city!: string;

  @IsArray()
  @IsString({ each: true })
  imageUrls!: string[];

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsInt()
  width?: number;

  @IsOptional()
  @IsInt()
  profile?: number;

  @IsOptional()
  @IsNumber()
  diameter?: number;

  @IsOptional()
  @IsString()
  pcd?: string;

  @IsOptional()
  @IsInt()
  offsetEt?: number;

  @IsOptional()
  @IsEnum(TireSeason)
  season?: TireSeason;

  @IsOptional()
  @IsInt()
  boltCount?: number;
}

export class UpdateListingDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  quantity?: number;

  @IsOptional()
  @IsEnum(ListingStatus)
  status?: ListingStatus;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imageUrls?: string[];
}

export class ListingQueryDto {
  @IsOptional()
  @IsEnum(ProductType)
  type?: ProductType;

  @IsOptional()
  @IsString()
  sellerType?: string;

  @IsOptional()
  @IsEnum(ListingCondition)
  condition?: ListingCondition;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number;
}
