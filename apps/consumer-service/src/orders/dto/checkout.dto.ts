import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CheckoutDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  deliveryMethod?: string;

  @IsOptional()
  @IsString()
  deliveryAddress?: string;
}
