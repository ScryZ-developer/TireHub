import { Seller as SellerDto, User as UserDto, UserRole } from '@tirehub/shared';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async findAll(): Promise<UserDto[]> {
    const users = await this.usersRepository.find({
      order: { createdAt: 'DESC' },
    });

    return users.map((user) => this.toPublic(user));
  }

  async create(data: {
    email: string;
    passwordHash: string;
    role?: UserRole;
    firstName?: string;
    lastName?: string;
    phone?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
    sellerId?: string;
  }): Promise<User> {
    const user = this.usersRepository.create({
      email: data.email,
      passwordHash: data.passwordHash,
      role: data.role ?? UserRole.BUYER,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      city: data.city ?? 'Красноярск',
      latitude: data.latitude ?? 56.0153,
      longitude: data.longitude ?? 92.8932,
      sellerId: data.sellerId,
    });

    return this.usersRepository.save(user);
  }

  async createFromDto(dto: CreateUserDto): Promise<UserDto> {
    const existing = await this.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.create({
      email: dto.email,
      passwordHash,
      role: dto.role,
      firstName: dto.firstName,
      lastName: dto.lastName,
      phone: dto.phone,
    });

    return this.toPublic(user);
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }

    if (dto.email && dto.email !== user.email) {
      const existing = await this.findByEmail(dto.email);
      if (existing) {
        throw new ConflictException('Email already registered');
      }
      user.email = dto.email;
    }

    if (dto.password) {
      user.passwordHash = await bcrypt.hash(dto.password, 10);
    }

    if (dto.role != null) {
      user.role = dto.role;
    }

    if (dto.firstName !== undefined) {
      user.firstName = dto.firstName;
    }

    if (dto.lastName !== undefined) {
      user.lastName = dto.lastName;
    }

    if (dto.phone !== undefined) {
      user.phone = dto.phone;
    }

    return this.usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }

    await this.usersRepository.remove(user);
  }

  toPublic(user: User, seller?: SellerDto): UserDto {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      city: user.city,
      latitude: user.latitude != null ? Number(user.latitude) : undefined,
      longitude: user.longitude != null ? Number(user.longitude) : undefined,
      sellerId: user.sellerId,
      seller,
      createdAt: user.createdAt.toISOString(),
    };
  }
}
