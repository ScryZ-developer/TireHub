import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderStatus, Product } from '@tirehub/shared';
import { DataSource, Repository } from 'typeorm';
import { CartService } from '../cart/cart.service';
import { StoredCartItem } from '../cart/cart.types';
import { CheckoutDto } from './dto/checkout.dto';
import { OrderItem } from './order_items.entity';
import { Order } from './orders.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemsRepository: Repository<OrderItem>,
    private readonly cartService: CartService,
    private readonly config: ConfigService,
    private readonly dataSource: DataSource,
  ) {}

  async findByUser(userId: string): Promise<Order[]> {
    return this.ordersRepository.find({
      where: { userId },
      relations: ['items'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['items'],
    });

    if (!order) {
      throw new NotFoundException(`Order ${id} not found`);
    }

    return order;
  }

  async checkout(userId: string, dto: CheckoutDto): Promise<Order> {
    const cartItems = await this.cartService.getCart(userId);

    if (cartItems.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    const pricedItems = await Promise.all(
      cartItems.map(async (item) => ({
        ...item,
        price: await this.resolveItemPrice(item),
      })),
    );

    const totalPrice = pricedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const order = queryRunner.manager.create(Order, {
        userId,
        totalPrice,
        status: OrderStatus.PENDING,
        deliveryMethod: dto.deliveryMethod,
        deliveryAddress: dto.deliveryAddress,
      });

      const savedOrder = await queryRunner.manager.save(order);

      const orderItems = pricedItems.map((item) =>
        queryRunner.manager.create(OrderItem, {
          orderId: savedOrder.id,
          productId: item.productId,
          quantity: item.quantity,
          priceAtPurchase: item.price,
        }),
      );

      savedOrder.items = await queryRunner.manager.save(orderItems);
      await queryRunner.commitTransaction();

      await this.cartService.clearCart(userId);

      return this.findOne(savedOrder.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private async resolveItemPrice(item: StoredCartItem): Promise<number> {
    if (item.price != null) {
      return Number(item.price);
    }

    const catalogUrl = this.config.get<string>('CATALOG_SERVICE_URL');
    if (!catalogUrl) {
      throw new BadRequestException(
        `Price for product ${item.productId} is unavailable. Add price when adding to cart or configure CATALOG_SERVICE_URL.`,
      );
    }

    const response = await fetch(`${catalogUrl}/products/${item.productId}`);

    if (!response.ok) {
      throw new NotFoundException(`Product ${item.productId} not found in catalog`);
    }

    const product = (await response.json()) as Product;
    return Number(product.price);
  }
}
