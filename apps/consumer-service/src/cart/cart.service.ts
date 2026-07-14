import {
  BadRequestException,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { StoredCartItem } from './cart.types';

const CART_KEY_PREFIX = 'cart:';
const CART_TTL_SECONDS = 60 * 60 * 24 * 30;

@Injectable()
export class CartService implements OnModuleInit, OnModuleDestroy {
  private redis!: Redis;

  constructor(private readonly config: ConfigService) {}

  onModuleInit() {
    this.redis = new Redis({
      host: this.config.get('REDIS_HOST', 'localhost'),
      port: this.config.get<number>('REDIS_PORT', 6379),
    });
  }

  onModuleDestroy() {
    this.redis.disconnect();
  }

  private cartKey(userId: string): string {
    return `${CART_KEY_PREFIX}${userId}`;
  }

  private async readCart(userId: string): Promise<StoredCartItem[]> {
    const raw = await this.redis.get(this.cartKey(userId));
    if (!raw) {
      return [];
    }

    try {
      return JSON.parse(raw) as StoredCartItem[];
    } catch {
      return [];
    }
  }

  private async writeCart(userId: string, items: StoredCartItem[]): Promise<void> {
    const key = this.cartKey(userId);

    if (items.length === 0) {
      await this.redis.del(key);
      return;
    }

    await this.redis.set(key, JSON.stringify(items), 'EX', CART_TTL_SECONDS);
  }

  async getCart(userId: string): Promise<StoredCartItem[]> {
    return this.readCart(userId);
  }

  async addItem(userId: string, dto: AddCartItemDto): Promise<StoredCartItem[]> {
    const items = await this.readCart(userId);
    const existing = items.find((item) => item.productId === dto.productId);

    if (existing) {
      existing.quantity += dto.quantity;
      if (dto.price != null) {
        existing.price = dto.price;
      }
    } else {
      items.push({
        productId: dto.productId,
        quantity: dto.quantity,
        price: dto.price,
      });
    }

    await this.writeCart(userId, items);
    return items;
  }

  async removeItem(userId: string, productId: string): Promise<StoredCartItem[]> {
    const items = (await this.readCart(userId)).filter(
      (item) => item.productId !== productId,
    );

    await this.writeCart(userId, items);
    return items;
  }

  async updateItem(
    userId: string,
    productId: string,
    quantity: number,
  ): Promise<StoredCartItem[]> {
    const items = await this.readCart(userId);
    const item = items.find((entry) => entry.productId === productId);

    if (!item) {
      throw new BadRequestException(`Product ${productId} is not in the cart`);
    }

    item.quantity = quantity;
    await this.writeCart(userId, items);
    return items;
  }

  async clearCart(userId: string): Promise<void> {
    await this.redis.del(this.cartKey(userId));
  }
}
