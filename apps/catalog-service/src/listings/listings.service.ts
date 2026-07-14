import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Listing,
  ListingStatus,
  Seller,
  SellerType,
  PaginatedResponse,
} from '@tirehub/shared';
import { ListingEntity } from './entities/listing.entity';
import { SellerEntity } from './entities/seller.entity';
import {
  CreateListingDto,
  UpdateListingDto,
  ListingQueryDto,
} from './dto/listing.dto';

@Injectable()
export class ListingsService {
  constructor(
    @InjectRepository(ListingEntity)
    private readonly listingsRepo: Repository<ListingEntity>,
    @InjectRepository(SellerEntity)
    private readonly sellersRepo: Repository<SellerEntity>,
  ) {}

  private toSeller(entity: SellerEntity): Seller {
    return {
      id: entity.id,
      type: entity.type,
      name: entity.name,
      city: entity.city,
      phone: entity.phone,
      email: entity.email,
      avatarUrl: entity.avatarUrl,
      description: entity.description,
      rating: Number(entity.rating),
      listingsCount: entity.listingsCount,
      isVerified: entity.isVerified,
      createdAt: entity.createdAt.toISOString(),
    };
  }

  private toListing(entity: ListingEntity): Listing {
    return {
      id: entity.id,
      sellerId: entity.sellerId,
      seller: entity.seller ? this.toSeller(entity.seller) : undefined,
      title: entity.title,
      description: entity.description,
      type: entity.type,
      condition: entity.condition,
      price: Number(entity.price),
      quantity: entity.quantity,
      city: entity.city,
      imageUrls: entity.imageUrls ?? [],
      status: entity.status,
      viewsCount: entity.viewsCount,
      brand: entity.brand,
      attributes: {
        width: entity.width,
        profile: entity.profile,
        diameter: entity.diameter ? Number(entity.diameter) : undefined,
        pcd: entity.pcd,
        offsetEt: entity.offsetEt,
        season: entity.season,
        boltCount: entity.boltCount,
      },
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt?.toISOString(),
    };
  }

  async findAll(query: ListingQueryDto): Promise<PaginatedResponse<Listing>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const qb = this.listingsRepo
      .createQueryBuilder('listing')
      .leftJoinAndSelect('listing.seller', 'seller')
      .where('listing.status = :status', { status: ListingStatus.ACTIVE });

    if (query.type) {
      qb.andWhere('listing.type = :type', { type: query.type });
    }
    if (query.condition) {
      qb.andWhere('listing.condition = :condition', { condition: query.condition });
    }
    if (query.city) {
      qb.andWhere('listing.city ILIKE :city', { city: `%${query.city}%` });
    }
    if (query.sellerType) {
      qb.andWhere('seller.type = :sellerType', { sellerType: query.sellerType });
    }
    if (query.q) {
      qb.andWhere(
        '(listing.title ILIKE :q OR listing.brand ILIKE :q OR listing.description ILIKE :q)',
        { q: `%${query.q}%` },
      );
    }

    qb.orderBy('listing.created_at', 'DESC');
    qb.skip(skip).take(limit);

    const [items, total] = await qb.getManyAndCount();

    return {
      data: items.map((item) => this.toListing(item)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Listing> {
    const listing = await this.listingsRepo.findOne({
      where: { id },
      relations: ['seller'],
    });
    if (!listing) {
      throw new NotFoundException(`Listing ${id} not found`);
    }
    await this.listingsRepo.increment({ id }, 'viewsCount', 1);
    listing.viewsCount += 1;
    return this.toListing(listing);
  }

  async findBySeller(sellerId: string): Promise<Listing[]> {
    const items = await this.listingsRepo.find({
      where: { sellerId, status: ListingStatus.ACTIVE },
      relations: ['seller'],
      order: { createdAt: 'DESC' },
    });
    return items.map((item) => this.toListing(item));
  }

  async create(dto: CreateListingDto): Promise<Listing> {
    const seller = await this.sellersRepo.findOne({ where: { id: dto.sellerId } });
    if (!seller) {
      throw new NotFoundException(`Seller ${dto.sellerId} not found`);
    }

    const entity = this.listingsRepo.create({
      sellerId: dto.sellerId,
      title: dto.title,
      description: dto.description,
      type: dto.type,
      condition: dto.condition,
      price: dto.price,
      quantity: dto.quantity,
      city: dto.city,
      imageUrls: dto.imageUrls,
      brand: dto.brand,
      width: dto.width,
      profile: dto.profile,
      diameter: dto.diameter,
      pcd: dto.pcd,
      offsetEt: dto.offsetEt,
      season: dto.season,
      boltCount: dto.boltCount,
      status: ListingStatus.ACTIVE,
    });

    const saved = await this.listingsRepo.save(entity);
    await this.sellersRepo.increment({ id: dto.sellerId }, 'listingsCount', 1);

    return this.findOne(saved.id);
  }

  async update(id: string, dto: UpdateListingDto): Promise<Listing> {
    const listing = await this.listingsRepo.findOne({ where: { id } });
    if (!listing) {
      throw new NotFoundException(`Listing ${id} not found`);
    }
    Object.assign(listing, dto);
    await this.listingsRepo.save(listing);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const listing = await this.listingsRepo.findOne({ where: { id } });
    if (!listing) {
      throw new NotFoundException(`Listing ${id} not found`);
    }
    listing.status = ListingStatus.ARCHIVED;
    await this.listingsRepo.save(listing);
  }

  async findSellers(): Promise<Seller[]> {
    const sellers = await this.sellersRepo.find({ order: { rating: 'DESC' } });
    return sellers.map((s) => this.toSeller(s));
  }

  async findSeller(id: string): Promise<Seller> {
    const seller = await this.sellersRepo.findOne({ where: { id } });
    if (!seller) {
      throw new NotFoundException(`Seller ${id} not found`);
    }
    return this.toSeller(seller);
  }
}
