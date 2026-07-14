import { AccountType } from '@tirehub/shared';
import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsEnum(AccountType)
  accountType!: AccountType;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ValidateIf((o: RegisterDto) => o.accountType === AccountType.PRIVATE)
  @IsString()
  firstName?: string;

  @ValidateIf((o: RegisterDto) => o.accountType === AccountType.PRIVATE)
  @IsOptional()
  @IsString()
  lastName?: string;

  @ValidateIf((o: RegisterDto) => o.accountType === AccountType.SHOP)
  @IsString()
  shopName?: string;

  @ValidateIf((o: RegisterDto) => o.accountType === AccountType.SHOP)
  @IsString()
  address?: string;

  @ValidateIf((o: RegisterDto) => o.accountType === AccountType.SHOP)
  @IsOptional()
  @IsString()
  description?: string;
}
