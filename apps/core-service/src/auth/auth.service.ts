import { AccountType, KRASNOYARSK, SellerType, UserRole } from '@tirehub/shared';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Seller } from '../sellers/sellers.entity';
import { SellersService } from '../sellers/sellers.service';
import { User } from '../users/users.entity';
import { UsersService } from '../users/users.service';
import { NotificationsService } from '../notifications/notifications.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly sellersService: SellersService,
    private readonly jwtService: JwtService,
    private readonly notificationsService: NotificationsService,
    private readonly dataSource: DataSource,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    this.validateRegisterDto(dto);

    const city = dto.city ?? KRASNOYARSK.city;
    const latitude = dto.latitude ?? KRASNOYARSK.latitude;
    const longitude = dto.longitude ?? KRASNOYARSK.longitude;
    const passwordHash = await bcrypt.hash(dto.password, 10);

    const isShop = dto.accountType === AccountType.SHOP;
    const sellerType = isShop ? SellerType.SHOP : SellerType.PRIVATE;
    const sellerName = isShop
      ? dto.shopName!
      : [dto.firstName, dto.lastName].filter(Boolean).join(' ') || dto.email.split('@')[0];

    const { user, seller } = await this.dataSource.transaction(async (manager) => {
      const userRepo = manager.getRepository(User);
      const sellerRepo = manager.getRepository(Seller);

      const userEntity = userRepo.create({
        email: dto.email,
        passwordHash,
        role: UserRole.SELLER,
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        city,
        latitude,
        longitude,
      });
      const savedUser = await userRepo.save(userEntity);

      const sellerEntity = sellerRepo.create({
        userId: savedUser.id,
        type: sellerType,
        name: sellerName,
        city,
        phone: dto.phone,
        email: dto.email,
        description: dto.description,
        address: isShop ? dto.address : undefined,
        latitude,
        longitude,
        isVerified: false,
      });
      const savedSeller = await sellerRepo.save(sellerEntity);

      savedUser.sellerId = savedSeller.id;
      await userRepo.save(savedUser);

      return { user: savedUser, seller: savedSeller };
    });

    await this.notificationsService.publish({
      type: 'user.registered',
      userId: user.id,
      email: user.email,
    });

    return {
      user: this.usersService.toPublic(user, this.sellersService.toPublic(seller)),
      accessToken: this.signToken(user),
    };
  }

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto.email, dto.password);
    const seller = user.sellerId
      ? await this.sellersService.findById(user.sellerId)
      : null;

    return {
      user: this.usersService.toPublic(
        user,
        seller ? this.sellersService.toPublic(seller) : undefined,
      ),
      accessToken: this.signToken(user),
    };
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);

    if (user) {
      await this.notificationsService.publish({
        type: 'user.password_reset_requested',
        userId: user.id,
        email: user.email,
      });
    }

    return {
      message: 'If the email exists, a reset link has been sent',
    };
  }

  resetPassword(_token: string, _password: string) {
    return {
      message: 'Password reset is not implemented yet',
    };
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  private signToken(user: User): string {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return this.jwtService.sign(payload);
  }

  private validateRegisterDto(dto: RegisterDto) {
    if (dto.accountType === AccountType.PRIVATE) {
      if (!dto.firstName?.trim()) {
        throw new BadRequestException('firstName is required for private accounts');
      }
      return;
    }

    if (!dto.shopName?.trim()) {
      throw new BadRequestException('shopName is required for shop accounts');
    }
    if (!dto.address?.trim()) {
      throw new BadRequestException('address is required for shop accounts');
    }
  }
}
