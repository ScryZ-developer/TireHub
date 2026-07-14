import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductAttribute } from './entities/product-attribute.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductAttributeDto } from './dto/create-product-attribute.dto';
import { UpdateProductAttributeDto } from './dto/update-product-attribute.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(ProductAttribute)
    private readonly attributesRepository: Repository<ProductAttribute>,
  ) {}

  findAll(): Promise<Product[]> {
    return this.productsRepository.find({
      relations: ['attributes'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['attributes'],
    });

    if (!product) {
      throw new NotFoundException(`Product ${id} not found`);
    }

    return product;
  }

  async create(dto: CreateProductDto): Promise<Product> {
    const { attributes, ...productData } = dto;

    const product = this.productsRepository.create(productData);

    if (attributes) {
      product.attributes = this.attributesRepository.create(attributes);
    }

    return this.productsRepository.save(product);
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    const { attributes, ...productData } = dto;

    Object.assign(product, productData);

    if (attributes) {
      if (product.attributes) {
        Object.assign(product.attributes, attributes);
      } else {
        product.attributes = this.attributesRepository.create({
          ...attributes,
          productId: id,
        });
      }
    }

    return this.productsRepository.save(product);
  }

  async remove(id: string): Promise<void> {
    const product = await this.findOne(id);
    await this.productsRepository.remove(product);
  }

  async findAttributes(productId: string): Promise<ProductAttribute> {
    const attributes = await this.attributesRepository.findOne({
      where: { productId },
    });

    if (!attributes) {
      throw new NotFoundException(
        `Attributes for product ${productId} not found`,
      );
    }

    return attributes;
  }

  async createAttributes(
    productId: string,
    dto: CreateProductAttributeDto,
  ): Promise<ProductAttribute> {
    await this.findOne(productId);

    const existing = await this.attributesRepository.findOne({
      where: { productId },
    });

    if (existing) {
      throw new ConflictException(
        `Attributes for product ${productId} already exist`,
      );
    }

    const attributes = this.attributesRepository.create({
      ...dto,
      productId,
    });

    return this.attributesRepository.save(attributes);
  }

  async updateAttributes(
    productId: string,
    dto: UpdateProductAttributeDto,
  ): Promise<ProductAttribute> {
    const attributes = await this.findAttributes(productId);
    Object.assign(attributes, dto);
    return this.attributesRepository.save(attributes);
  }

  async removeAttributes(productId: string): Promise<void> {
    const attributes = await this.findAttributes(productId);
    await this.attributesRepository.remove(attributes);
  }
}
