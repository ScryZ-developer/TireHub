import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { SellerType, UserRole } from '@tirehub/shared';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { SellersService } from '../sellers/sellers.service';
import { UsersService } from '../users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/users.entity';
import { Seller } from '../sellers/sellers.entity';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(
    private readonly usersService: UsersService,
    private readonly sellersService: SellersService,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Seller)
    private readonly sellersRepository: Repository<Seller>,
  ) {}

  @Get('stats')
  async getStats() {
    const [usersCount, sellersCount, shopsCount, privateCount, verifiedShops] =
      await Promise.all([
        this.usersRepository.count(),
        this.sellersRepository.count(),
        this.sellersRepository.count({ where: { type: SellerType.SHOP } }),
        this.sellersRepository.count({ where: { type: SellerType.PRIVATE } }),
        this.sellersRepository.count({ where: { isVerified: true } }),
      ]);

    return {
      usersCount,
      sellersCount,
      shopsCount,
      privateCount,
      verifiedShops,
      defaultCity: 'Красноярск',
    };
  }

  @Get('users')
  findAllUsers() {
    return this.usersService.findAll();
  }

  @Get('sellers')
  findAllSellers() {
    return this.sellersService.findAll();
  }

  @Patch('sellers/:id/verify')
  verifySeller(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: { isVerified: boolean },
  ) {
    return this.sellersService.setVerified(id, body.isVerified);
  }
}
