import { Seller as SellerDto, SellerType } from '@tirehub/shared';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Seller } from './sellers.entity';

@Injectable()
export class SellersService {
  constructor(
    @InjectRepository(Seller)
    private readonly sellersRepository: Repository<Seller>,
  ) {}

  async findById(id: string): Promise<Seller | null> {
    return this.sellersRepository.findOne({ where: { id } });
  }

  async findByUserId(userId: string): Promise<Seller | null> {
    return this.sellersRepository.findOne({ where: { userId } });
  }

  async findAll(): Promise<SellerDto[]> {
    const sellers = await this.sellersRepository.find({
      order: { createdAt: 'DESC' },
    });
    return sellers.map((s) => this.toPublic(s));
  }

  async create(data: {
    userId: string;
    type: SellerType;
    name: string;
    city: string;
    phone?: string;
    email?: string;
    description?: string;
    address?: string;
    latitude?: number;
    longitude?: number;
  }): Promise<Seller> {
    const seller = this.sellersRepository.create({
      userId: data.userId,
      type: data.type,
      name: data.name,
      city: data.city,
      phone: data.phone,
      email: data.email,
      description: data.description,
      address: data.address,
      latitude: data.latitude ?? 56.0153,
      longitude: data.longitude ?? 92.8932,
      isVerified: data.type === SellerType.SHOP ? false : false,
    });

    return this.sellersRepository.save(seller);
  }

  async setVerified(id: string, isVerified: boolean): Promise<SellerDto> {
    const seller = await this.findById(id);
    if (!seller) {
      throw new NotFoundException(`Seller ${id} not found`);
    }

    seller.isVerified = isVerified;
    const saved = await this.sellersRepository.save(seller);
    return this.toPublic(saved);
  }

  toPublic(seller: Seller): SellerDto {
    return {
      id: seller.id,
      type: seller.type,
      name: seller.name,
      city: seller.city,
      phone: seller.phone,
      email: seller.email,
      avatarUrl: seller.avatarUrl,
      description: seller.description,
      address: seller.address,
      latitude: Number(seller.latitude),
      longitude: Number(seller.longitude),
      rating: Number(seller.rating),
      listingsCount: seller.listingsCount,
      isVerified: seller.isVerified,
      createdAt: seller.createdAt.toISOString(),
    };
  }
}
